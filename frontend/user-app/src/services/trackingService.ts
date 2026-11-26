import { TableTrackingSession, TrackedOrderRound, TrackedDishItem, DishPreparationStatus } from '@/types/tracking';

interface BackendItem {
  ma_ct?: number;
  ma_mon?: number;
  ten_mon?: string;
  monan?: {
    ma_mon?: number;
    ten_mon: string;
    hinh_anh?: string;
  };
  so_luong: number;
  don_gia: number;
  ghi_chu?: string;
}

interface BackendTableOrder {
  ma_don: number;
  trang_thai: string;
  thoi_gian_tao: string;
  tong_tien: number;
  chitietdonhang?: BackendItem[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

function parseOrderTime(dateStr?: string): string {
  if (!dateStr) return 'Vừa xong';
  try {
    const normalized = dateStr.includes('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
    return new Date(normalized).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return 'Vừa xong';
  }
}

function resolveDishStatus(orderStatus: string): { status: DishPreparationStatus; statusText: string } {
  const s = (orderStatus || '').toLowerCase();

  if (s.includes('huy') || s.includes('cancel')) {
    return { status: 'CANCELLED', statusText: 'Đã hủy' };
  }

  if (s.includes('hoan tat') || s.includes('completed')) {
    return {
      status: 'SERVED',
      statusText: 'Đã phục vụ',
    };
  }

  if (s.includes('phuc vu') || s.includes('len mon') || s.includes('served')) {
    return {
      status: 'READY',
      statusText: 'Đã lên món',
    };
  }

  if (s.includes('chuan bi') || s.includes('cooking') || s.includes('nau') || s.includes('che bien')) {
    return {
      status: 'COOKING',
      statusText: 'Đang chuẩn bị',
    };
  }

  return {
    status: 'WAITING_ACCEPT',
    statusText: 'Chờ xác nhận',
  };
}

export const trackingService = {
  /**
   * Biến đổi danh sách đơn hàng thực tế của bàn thành phiên theo dõi tiến độ chi tiết chuẩn UI
   */
  buildTableTrackingSession(
    rawOrders: BackendTableOrder[],
    tableName: string = 'Bàn số 05',
    tableNumber: string | number = '5'
  ): TableTrackingSession {
    if (!rawOrders || rawOrders.length === 0) {
      return {
        tableNumber,
        tableName,
        combinedCodesText: 'Chưa có đơn hàng',
        progressPercent: 0,
        readyDishesCount: 0,
        totalDishesCount: 0,
        timelineStep: 1,
        isConfirmed: false,
        rounds: [],
        grandTotal: 0,
      };
    }

    // Sắp xếp các đơn theo thời gian tạo tăng dần (cũ nhất là Đợt 1, tiếp theo là Đợt 2,...)
    const sortedOrders = [...rawOrders].sort((a, b) => {
      const tA = new Date(a.thoi_gian_tao).getTime() || 0;
      const tB = new Date(b.thoi_gian_tao).getTime() || 0;
      return tA - tB;
    });

    let totalDishes = 0;
    let readyDishes = 0;
    let grandTotal = 0;
    const roundSubtotals: { label: string; amount: number }[] = [];

    const rounds: TrackedOrderRound[] = sortedOrders.map((ord, idx) => {
      const roundNum = idx + 1;
      const timeStr = parseOrderTime(ord.thoi_gian_tao);
      const roundLabel = roundNum === 1 ? `Đợt 1 • ${timeStr}` : `Đợt ${roundNum} • Gọi thêm ${timeStr}`;
      const orderCode = `#DH${String(ord.ma_don).padStart(3, '0')}`;
      const subtotal = Number(ord.tong_tien) || 0;
      grandTotal += subtotal;
      roundSubtotals.push({ label: `Đợt ${roundNum}`, amount: subtotal });

      const dishes: TrackedDishItem[] = (ord.chitietdonhang || []).map((ct, ctIdx) => {
        const dName = ct.monan?.ten_mon || ct.ten_mon || `Món ăn #${ct.ma_mon || ctIdx + 1}`;
        const qty = ct.so_luong || 1;
        const unitPrice = ct.don_gia || 0;
        const total = unitPrice * qty;
        totalDishes += qty;

        const { status, statusText } = resolveDishStatus(ord.trang_thai);
        if (status === 'READY' || status === 'SERVED') {
          readyDishes += qty;
        }

        return {
          id: ct.ma_ct || `${ord.ma_don}-${ctIdx}`,
          name: dName,
          image: ct.monan?.hinh_anh,
          optionsText: ct.ghi_chu || undefined,
          status,
          statusText,
          quantity: qty,
          unitPrice,
          totalPrice: total,
        };
      });

      return {
        orderId: ord.ma_don,
        orderCode,
        roundNumber: roundNum,
        roundLabel,
        time: timeStr,
        status: ord.trang_thai,
        dishes,
        subtotal,
      };
    });

    // Chuỗi mã phiếu gộp
    const codesList = rounds.map((r) => r.orderCode).join(' & ');
    const combinedCodesText =
      rounds.length > 1
        ? `Mã phiếu gộp: ${codesList} (${rounds.length} đợt gọi)`
        : `Mã phiếu: ${codesList} (1 đợt gọi)`;

    // Tính toán bước tiến độ timeline chung của bàn
    const hasServed = sortedOrders.some((o) => o.trang_thai?.toLowerCase().includes('phuc vu') || o.trang_thai?.toLowerCase().includes('hoan tat'));
    const hasCooking = sortedOrders.some((o) => o.trang_thai?.toLowerCase().includes('chuan bi') || o.trang_thai?.toLowerCase().includes('nau'));
    
    let timelineStep: 1 | 2 | 3 = 1;
    let progressPercent = 0;
    let isConfirmed = false;

    if (hasServed) {
      isConfirmed = true;
      timelineStep = 3;
      progressPercent = totalDishes > 0 ? Math.round((readyDishes / totalDishes) * 100) : 0;
    } else if (hasCooking) {
      isConfirmed = true;
      timelineStep = 2;
      progressPercent = totalDishes > 0 ? Math.round((readyDishes / totalDishes) * 100) : 0;
    } else {
      isConfirmed = false;
      timelineStep = 1;
      progressPercent = 0;
    }

    if (readyDishes >= totalDishes && totalDishes > 0) {
      isConfirmed = true;
      progressPercent = 100;
    }

    // Chuỗi phân tách chi tiết tổng tiền: 'Đợt 1: 561.600đ + Đợt 2: 183.600đ'
    const breakdownParts = roundSubtotals.map((r) => `${r.label}: ${formatCurrency(r.amount)}đ`);
    const breakdownText = roundSubtotals.length > 1 ? `${breakdownParts.join(' + ')} (VAT 8%)` : undefined;

    return {
      tableNumber,
      tableName: tableName.startsWith('Bàn') ? tableName : `Bàn số ${String(tableNumber).padStart(2, '0')}`,
      combinedCodesText,
      progressPercent,
      readyDishesCount: readyDishes,
      totalDishesCount: totalDishes,
      timelineStep,
      isConfirmed,
      rounds,
      grandTotal,
      breakdownText,
    };
  },
};
