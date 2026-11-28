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
  trang_thai?: string;
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

function resolveDishStatus(orderStatus: string, dishName: string): { status: DishPreparationStatus; statusText: string; cookingNote?: string } {
  const s = (orderStatus || '').toLowerCase();

  if (s.includes('hoan tat') || s.includes('completed')) {
    return {
      status: 'SERVED',
      statusText: '✓ Đã phục vụ tại bàn',
    };
  }

  if (s.includes('phuc vu') || s.includes('len mon') || s.includes('served')) {
    return {
      status: 'READY',
      statusText: '✓ Đã xong - Chờ lên bàn',
    };
  }

  if (s.includes('chuan bi') || s.includes('cooking') || s.includes('nau') || s.includes('che bien')) {
    const nameLower = dishName.toLowerCase();
    if (nameLower.includes('nuong') || nameLower.includes('bò') || nameLower.includes('steak')) {
      return {
        status: 'COOKING',
        statusText: '🔄 Đang nướng than hoa',
        cookingNote: 'Đang ủ than nướng thảo mộc ~3 phút cuối',
      };
    }
    if (nameLower.includes('lẩu') || nameLower.includes('canh') || nameLower.includes('om')) {
      return {
        status: 'COOKING',
        statusText: '🔄 Đang sôi trên bếp',
        cookingNote: 'Bếp nóng đang chuẩn bị nước dùng và gia vị',
      };
    }
    if (nameLower.includes('trà') || nameLower.includes('nước') || nameLower.includes('chua') || nameLower.includes('cam')) {
      return {
        status: 'COOKING',
        statusText: '🔄 Đang pha chế',
      };
    }
    if (nameLower.includes('bánh') || nameLower.includes('mochi') || nameLower.includes('panna') || nameLower.includes('kem')) {
      return {
        status: 'COOKING',
        statusText: '🕒 Chờ làm tráng miệng',
        cookingNote: 'Ghi chú: Lên sau khi dùng xong món chính',
      };
    }
    return {
      status: 'COOKING',
      statusText: '🔄 Đang chuẩn bị',
    };
  }

  // Mặc định: Chờ xác nhận (Khi Admin Web chưa bấm duyệt đơn)
  return {
    status: 'WAITING_ACCEPT',
    statusText: '⏳ Chờ xác nhận',
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
        zoneText: 'Tầng 1 • Trong Nhà',
        combinedCodesText: 'Chưa có đơn hàng',
        estimatedMinutesText: '~0 phút',
        kitchenStatusText: 'Chưa có đơn',
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

        const { status, statusText, cookingNote } = resolveDishStatus(ord.trang_thai, dName);
        if (status === 'READY' || status === 'SERVED') {
          readyDishes += qty;
        }

        return {
          id: ct.ma_ct || `${ord.ma_don}-${ctIdx}`,
          name: dName,
          image: ct.monan?.hinh_anh,
          optionsText: ct.ghi_chu || undefined,
          cookingNote,
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
    let estimatedMinutesText = '~12 - 18 phút nữa';
    let kitchenStatusText = 'Chờ xác nhận';

    if (hasServed) {
      isConfirmed = true;
      timelineStep = 3;
      progressPercent = totalDishes > 0 ? Math.max(75, Math.round((readyDishes / totalDishes) * 100)) : 85;
      estimatedMinutesText = readyDishes >= totalDishes ? 'Đã lên đủ món' : '~3 - 5 phút nữa';
      kitchenStatusText = 'Bếp đang ra món';
    } else if (hasCooking) {
      isConfirmed = true;
      timelineStep = 2;
      progressPercent = 50;
      estimatedMinutesText = '~8 - 12 phút nữa';
      kitchenStatusText = 'Bếp đang chuẩn bị';
    } else {
      // Đơn hàng đang ở trạng thái 'Cho xac nhan' - Admin chưa duyệt
      isConfirmed = false;
      timelineStep = 1;
      progressPercent = 0;
      estimatedMinutesText = 'Đang chờ duyệt đơn';
      kitchenStatusText = 'Chờ xác nhận';
    }

    if (readyDishes >= totalDishes && totalDishes > 0) {
      isConfirmed = true;
      progressPercent = 100;
      kitchenStatusText = 'Đã lên đủ món';
      estimatedMinutesText = 'Đã hoàn tất';
    }

    // Tính tổng tiền món ăn trước thuế và VAT 8%
    const dishesTotal = rounds.reduce(
      (sum, r) => sum + r.dishes.reduce((dSum, d) => dSum + d.totalPrice, 0),
      0
    );
    const vatAmount = Math.max(0, grandTotal - dishesTotal);

    // Chuỗi phân tách chi tiết tổng tiền: 'Đợt 1: 561.600đ + Đợt 2: 183.600đ'
    const breakdownParts = roundSubtotals.map((r) => `${r.label}: ${formatCurrency(r.amount)}đ`);
    const breakdownText = roundSubtotals.length > 1 ? `${breakdownParts.join(' + ')} (Đã gồm VAT 8%)` : undefined;

    return {
      tableNumber,
      tableName: tableName.startsWith('Bàn') ? tableName : `Bàn số ${String(tableNumber).padStart(2, '0')}`,
      zoneText: 'Tầng 1 • Trong Nhà',
      combinedCodesText,
      estimatedMinutesText,
      kitchenStatusText,
      progressPercent,
      readyDishesCount: readyDishes,
      totalDishesCount: totalDishes,
      timelineStep,
      isConfirmed,
      rounds,
      dishesTotal,
      vatAmount,
      grandTotal,
      breakdownText,
    };
  },
};
