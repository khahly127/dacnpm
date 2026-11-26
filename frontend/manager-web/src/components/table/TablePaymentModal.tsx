'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Receipt,
  Clock,
} from 'lucide-react';
import { tableService } from '@/services/tableService';
import { authService } from '@/services/authService';

interface OrderItemRaw {
  ma_don: number;
  ma_ban: number;
  thoi_gian_tao: string;
  tong_tien: number;
  trang_thai: string;
  trang_thai_thanh_toan?: string;
  chitietdonhang?: Array<{
    so_luong: number;
    don_gia: number;
    monan?: { ten_mon: string };
  }>;
}

interface TablePaymentModalProps {
  isOpen: boolean;
  tableId: number | string | null;
  tableName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TablePaymentModal({
  isOpen,
  tableId,
  tableName,
  onClose,
  onSuccess,
}: TablePaymentModalProps) {
  const [orders, setOrders] = useState<OrderItemRaw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'TIEN_MAT' | 'CHUYEN_KHOAN'>('TIEN_MAT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentQr, setPaymentQr] = useState<Awaited<ReturnType<typeof tableService.getPaymentQr>> | null>(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [qrErrorMessage, setQrErrorMessage] = useState<string | null>(null);
  const paymentQrRequestId = useRef(0);

  // Load danh sách đơn hàng của bàn khi mở Modal
  useEffect(() => {
    if (isOpen && tableId) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(true);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const token = authService.getToken();

      fetch(`${API_BASE_URL}/orders/staff`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((resJson) => {
          if (resJson?.success && Array.isArray(resJson.data)) {
            const tableNum = Number(tableId);
            // Lọc các đơn của bàn này, loại trừ đơn đã hủy
            const tableOrders = (resJson.data as OrderItemRaw[]).filter(
              (o) => o.ma_ban === tableNum && o.trang_thai !== 'Da huy' && o.trang_thai_thanh_toan !== 'Da thanh toan'
            );
            // Sắp xếp thứ tự đợt gọi từ sớm đến muộn (đợt 1, đợt 2...)
            tableOrders.sort((a, b) => new Date(a.thoi_gian_tao).getTime() - new Date(b.thoi_gian_tao).getTime());
            setOrders(tableOrders);
          } else {
            setOrders([]);
          }
        })
        .catch(() => {
          setErrorMessage('Không thể tải dữ liệu đơn hàng của bàn.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, tableId]);

  const handlePaymentMethodChange = async (method: 'TIEN_MAT' | 'CHUYEN_KHOAN') => {
    const requestId = ++paymentQrRequestId.current;
    setPaymentMethod(method);
    setPaymentQr(null);
    setQrErrorMessage(null);
    setIsLoadingQr(method === 'CHUYEN_KHOAN');
    if (method !== 'CHUYEN_KHOAN' || !tableId) return;

    try {
      const data = await tableService.getPaymentQr(tableId);
      if (paymentQrRequestId.current === requestId) setPaymentQr(data);
    } catch (error: unknown) {
      if (paymentQrRequestId.current === requestId) {
        setQrErrorMessage(error instanceof Error ? error.message : 'Không thể tạo mã VietQR.');
      }
    } finally {
      if (paymentQrRequestId.current === requestId) setIsLoadingQr(false);
    }
  };

  const handleClose = () => {
    paymentQrRequestId.current += 1;
    setPaymentMethod('TIEN_MAT');
    setPaymentQr(null);
    setIsLoadingQr(false);
    setQrErrorMessage(null);
    onClose();
  };

  // Kiểm tra điều kiện: Tất cả các đợt gọi đều phải ở trạng thái "Hoan tat" (Đã phục vụ)
  const unservedOrders = useMemo(() => {
    return orders.filter((o) => o.trang_thai !== 'Hoan tat');
  }, [orders]);

  const isReadyToPay = orders.length > 0 && unservedOrders.length === 0;

  // Tính tổng số tiền và tổng món
  const totalAmount = useMemo(() => {
    return orders.reduce((sum, o) => sum + (Number(o.tong_tien) || 0), 0);
  }, [orders]);

  const totalDishes = useMemo(() => {
    return orders.reduce((sum, o) => {
      const items = Array.isArray(o.chitietdonhang) ? o.chitietdonhang : [];
      return sum + items.reduce((s, it) => s + (it.so_luong || 1), 0);
    }, 0);
  }, [orders]);

  if (!isOpen || !tableId) return null;

  // Xử lý xác nhận thanh toán & Trả bàn
  const handleConfirmPayment = async () => {
    if (!isReadyToPay) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await tableService.checkoutTable(tableId, paymentMethod);
      if (result.success) {
        setSuccessMessage('Thanh toán thành công! Bàn đã được chuyển về Bàn trống.');
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 1200);
      } else {
        setErrorMessage(result.message || 'Thanh toán không thành công.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi thanh toán.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý in tạm tính
  const handlePrintDraft = () => {
    window.print();
  };

  // Định dạng giờ tạo đơn
  const formatTime = (iso?: string) => {
    if (!iso) return '--:--';
    const d = new Date(iso);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8E2813] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#26201E]">
                  Thanh Toán {tableName || `Bàn ${tableId}`}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8]">
                  #{orders.length} đợt gọi
                </span>
              </div>
              <p className="text-xs text-[#8A8175]">
                Hóa đơn tổng hợp tất cả các đợt gọi món của bàn ăn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Thông báo Thành công nếu có */}
          {successMessage && (
            <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center gap-2.5 text-xs text-[#15803D] font-medium">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Cảnh báo nếu CÒN đơn chưa phục vụ xong */}
          {!isLoading && unservedOrders.length > 0 && (
            <div className="p-3.5 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl flex items-start gap-2.5 text-xs text-[#B45309]">
              <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Chưa thể thanh toán bàn:</div>
                <div className="text-[11px] leading-relaxed">
                  Bàn hiện vẫn còn <strong>{unservedOrders.length} đợt gọi món</strong> chưa hoàn tất phục vụ lên bàn (đang ở trạng thái{' '}
                  {unservedOrders.map((o) => `#DH${String(o.ma_don).padStart(3, '0')}`).join(', ')}).
                  Vui lòng kiểm tra và bấm <strong>&quot;Hoàn tất món&quot;</strong> trước khi thực hiện thanh toán!
                </div>
              </div>
            </div>
          )}

          {/* Banner Đủ điều kiện thanh toán */}
          {!isLoading && isReadyToPay && (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-center gap-2.5 text-xs text-[#15803D]">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>
                <strong>Đủ điều kiện thanh toán:</strong> Tất cả các đợt món đã được phục vụ lên bàn đầy đủ.
              </span>
            </div>
          )}

          {/* Báo lỗi nếu có */}
          {errorMessage && (
            <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-center gap-2 text-xs text-[#C23924]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bảng danh sách các đợt gọi món */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#3C342F] uppercase tracking-wider">
                Chi tiết các đợt gọi món
              </span>
              <span className="text-xs text-[#8A8175]">
                Tổng cộng: <strong className="text-[#26201E]">{totalDishes} món</strong>
              </span>
            </div>

            <div className="border border-[#EAE3D6] rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#F0EAE1] text-[11px] font-bold text-[#8A8175] uppercase">
                    <th className="py-2.5 px-3">ĐỢT</th>
                    <th className="py-2.5 px-3">MÃ ĐƠN</th>
                    <th className="py-2.5 px-3">GIỜ GỌI</th>
                    <th className="py-2.5 px-3">SỐ LƯỢNG</th>
                    <th className="py-2.5 px-3 text-right">TIỀN ĐỢT</th>
                    <th className="py-2.5 px-3 text-center">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#8A8175]">
                        Đang tải danh sách đơn của bàn...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#8A8175]">
                        Bàn hiện không có đơn hàng nào.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, idx) => {
                      const isCompleted = order.trang_thai === 'Hoan tat';
                      const isCooking = order.trang_thai === 'Dang chuan bi';
                      const isServing = order.trang_thai === 'Dang phuc vu';
                      const isPending = order.trang_thai === 'Cho xac nhan';

                      const countItems = Array.isArray(order.chitietdonhang)
                        ? order.chitietdonhang.reduce((s, it) => s + (it.so_luong || 1), 0)
                        : 0;

                      return (
                        <tr key={order.ma_don} className="hover:bg-[#FCFAF7] transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-[#8A8175]">
                            Đợt {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-[#8E2813]">
                            #DH{String(order.ma_don).padStart(3, '0')}
                          </td>
                          <td className="py-2.5 px-3 text-[#554E46] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#A89E92]" />
                            <span>{formatTime(order.thoi_gian_tao)}</span>
                          </td>
                          <td className="py-2.5 px-3 text-[#26201E] font-medium">
                            {countItems} món
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[#26201E]">
                            {new Intl.NumberFormat('vi-VN').format(order.tong_tien)} đ
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                ✓ Đã phục vụ
                              </span>
                            )}
                            {isServing && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                                Đang phục vụ
                              </span>
                            )}
                            {isCooking && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                                Đang chuẩn bị
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                                Chờ xác nhận
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chọn phương thức thanh toán: Tiền mặt hoặc Chuyển khoản QR */}
          <div>
            <label className="block text-xs font-bold text-[#3C342F] mb-2 uppercase tracking-wider">
              Phương thức thanh toán
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange('TIEN_MAT')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'TIEN_MAT'
                    ? 'bg-[#FDF2EC] border-[#8E2813] text-[#8E2813] ring-1 ring-[#8E2813]'
                    : 'bg-white border-[#EAE3D6] text-[#69635A] hover:bg-[#FAF7F2]'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold">Tiền mặt</span>
              </button>

              <button
                type="button"
                onClick={() => handlePaymentMethodChange('CHUYEN_KHOAN')}
                className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'CHUYEN_KHOAN'
                    ? 'bg-[#FDF2EC] border-[#8E2813] text-[#8E2813] ring-1 ring-[#8E2813]'
                    : 'bg-white border-[#EAE3D6] text-[#69635A] hover:bg-[#FAF7F2]'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">Chuyển khoản QR</span>
              </button>
            </div>
          </div>

          {/* Khung QR Chuyển khoản nếu chọn Chuyển khoản */}
          {paymentMethod === 'CHUYEN_KHOAN' && (
            <div className="p-4 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex items-center gap-4">
              <div className="w-28 h-28 bg-white p-1.5 border border-[#EAE3D6] rounded-lg shadow-2xs shrink-0 flex items-center justify-center overflow-hidden">
                {isLoadingQr ? (
                  <span className="text-center text-[10px] text-[#8A8175]">Đang tạo QR...</span>
                ) : paymentQr ? (
                  <Image src={paymentQr.qrImage} alt="VietQR thanh toán" width={104} height={104} unoptimized className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-20 h-20 text-[#A89E92]" />
                )}
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-bold text-[#26201E]">VietQR - Quét mã thanh toán</div>
                {paymentQr && (
                  <>
                    <div className="text-[#8A8175]">Mã ngân hàng: <strong>{paymentQr.bankBin}</strong></div>
                    <div className="text-[#8A8175]">Số TK: <strong>{paymentQr.accountNumber}</strong> • {paymentQr.accountName}</div>
                    <div className="font-bold text-[#8E2813]">Nội dung: {paymentQr.transferContent}</div>
                    <div className="text-[11px] text-[#059669] font-medium">
                      Số tiền: {new Intl.NumberFormat('vi-VN').format(paymentQr.totalAmount)} đ
                    </div>
                  </>
                )}
                {isLoadingQr && <div className="text-[#8A8175]">Đang lấy hóa đơn và tạo mã VietQR...</div>}
                {qrErrorMessage && <div className="text-[#C23924]">{qrErrorMessage}</div>}
                <div className="text-[10px] text-[#8A8175]">Kiểm tra giao dịch trước khi xác nhận thanh toán.</div>
              </div>
            </div>
          )}

          {/* Tóm tắt tổng tiền */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#8A8175] uppercase">Tổng tiền cần thanh toán</span>
              <div className="text-xs text-[#8A8175]">
                Đã bao gồm VAT 8% • {orders.length} đợt gọi món
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-[#8E2813]">
                {new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ
              </div>
            </div>
          </div>
        </div>

        {/* Footer Hành động */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <button
            type="button"
            onClick={handlePrintDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#EAE3D6] bg-white text-xs font-bold text-[#5C5449] hover:bg-[#F5EFE6] rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In tạm tính</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-[#EAE3D6] bg-white text-xs font-bold text-[#7C7267] hover:bg-[#F5EFE6] rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleConfirmPayment}
              disabled={!isReadyToPay || isSubmitting || orders.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={
                !isReadyToPay
                  ? 'Vui lòng hoàn tất phục vụ tất cả các đợt món trước khi thanh toán'
                  : 'Xác nhận thanh toán và trả bàn trống'
              }
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Đang thanh toán...' : 'Xác nhận thanh toán & Trả bàn'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
