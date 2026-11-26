import { API_BASE_URL } from '@/lib/utils';
import { EnhancedCartItem, OrderCreationResult } from '@/types/cart';

export const orderService = {
  /**
   * Calculate VAT & Service fee (8%)
   */
  calculateVat(subtotal: number): number {
    return Math.round(subtotal * 0.08);
  },

  /**
   * Submit table order to backend API
   */
  async submitOrder(
    tableIdInput: string | number,
    cartItems: EnhancedCartItem[],
    tableNote?: string
  ): Promise<OrderCreationResult> {
    const rawNum = parseInt(String(tableIdInput).replace(/\D/g, ''), 10);
    const ma_ban = isNaN(rawNum) || rawNum <= 0 ? 5 : rawNum;

    // Build items payload
    const items = cartItems.map((item) => {
      // Build detailed note combining selected options and kitchen note
      const optionTexts = item.selectedOptions.map((o) => o.optionName);
      if (item.note.trim()) {
        optionTexts.push(`Ghi chú: ${item.note.trim()}`);
      }
      const combinedNote = optionTexts.join(' • ');

      return {
        ma_mon: item.dish.id,
        so_luong: item.quantity,
        don_gia: item.unitPrice,
        ghi_chu: combinedNote || undefined,
      };
    });

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ma_ban,
          items,
          ghi_chu_ban: tableNote?.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          success: false,
          message: json.message || 'Không thể gửi đơn hàng đến máy chủ.',
        };
      }

      const orderId = Number(json.data?.ma_don);
      if (!Number.isInteger(orderId) || orderId <= 0) {
        return { success: false, message: 'Máy chủ không trả về mã đơn hợp lệ.' };
      }

      return {
        success: true,
        message: json.message || 'Đặt món thành công! Đơn hàng đã được chuyển tới quầy bếp.',
        orderId,
        orderCode: `#DH${String(orderId).padStart(3, '0')}`,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? `Không thể kết nối máy chủ để gửi đơn: ${error.message}`
          : 'Không thể kết nối máy chủ để gửi đơn.',
      };
    }
  },
};
