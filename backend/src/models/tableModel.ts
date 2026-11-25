import { supabase } from '../config/supabaseClient';
import { qrModel } from './qrModel';
import { generateTableQRCode } from '../utils/qrGenerator';
import { AppError } from '../utils/appError';

// Lưu thời điểm bàn được giải phóng / reset về 'Trong' (Bàn trống)
const tableResetMap = new Map<number, Date>();

export const tableModel = {
    async findById(id: number) {
        const { data, error } = await supabase.from('ban').select('*, maqr(*)').eq('ma_ban', id).maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    },
    async list() {
        const { data: tables, error } = await supabase
            .from('ban')
            .select('*, maqr(*)')
            .order('ma_ban');
        if (error) throw new Error(error.message);

        try {
            // Lấy tất cả các đơn hàng chưa bị hủy (bao gồm 'Cho xac nhan', 'Dang chuan bi', 'Dang phuc vu', 'Hoan tat')
            const { data: activeOrders } = await supabase
                .from('donhang')
                .select('ma_don, ma_ban, thoi_gian_tao, tong_tien, trang_thai, chitietdonhang(so_luong)')
                .in('trang_thai', ['Cho xac nhan', 'Dang chuan bi', 'Dang phuc vu', 'Hoan tat'])
                .order('thoi_gian_tao', { ascending: false });

            // Tập hợp các bàn đang có khách thực tế (không phải bàn trống)
            const occupiedTableIds = new Set<number>(
                (tables || [])
                    .filter((t: any) => t.trang_thai !== 'Trong' && t.trang_thai !== 'Dat truoc')
                    .map((t: any) => t.ma_ban)
            );

            const orderMap = new Map<number, any>();
            if (activeOrders) {
                for (const order of activeOrders) {
                    if (order.ma_ban && occupiedTableIds.has(order.ma_ban)) {
                        // Nếu bàn đã được reset về 'Trong' sau thời điểm tạo đơn này thì bỏ qua đơn cũ
                        const resetTime = tableResetMap.get(order.ma_ban);
                        if (resetTime && new Date(order.thoi_gian_tao) <= resetTime) {
                            continue;
                        }

                        const totalDishes = Array.isArray(order.chitietdonhang)
                            ? order.chitietdonhang.reduce((sum: number, item: any) => sum + (item.so_luong || 1), 0)
                            : 0;
                        const orderPrice = Number(order.tong_tien) || 0;
                        const isPending = order.trang_thai?.toLowerCase().includes('cho');

                        const existing = orderMap.get(order.ma_ban);
                        if (!existing) {
                            orderMap.set(order.ma_ban, {
                                ma_don: order.ma_don,
                                danh_sach_ma_don: [order.ma_don],
                                so_don: 1,
                                so_mon: totalDishes,
                                thoi_gian_tao: order.thoi_gian_tao,
                                thoi_gian_bat_dau: order.thoi_gian_tao,
                                tong_tien: orderPrice,
                                trang_thai: order.trang_thai,
                                has_pending: isPending,
                            });
                        } else {
                            existing.so_don += 1;
                            existing.so_mon += totalDishes;
                            existing.tong_tien += orderPrice;
                            existing.danh_sach_ma_don.push(order.ma_don);
                            if (new Date(order.thoi_gian_tao) < new Date(existing.thoi_gian_bat_dau)) {
                                existing.thoi_gian_bat_dau = order.thoi_gian_tao;
                            }
                            if (isPending) {
                                existing.has_pending = true;
                            }
                        }
                    }
                }
            }

            return (tables || []).map((table: any) => ({
                ...table,
                don_hang_hien_tai: table.trang_thai === 'Trong' ? null : (orderMap.get(table.ma_ban) || null),
            }));
        } catch {
            return tables || [];
        }
    },
    async create(input: { ten_ban: string; trang_thai: string }) {
        const { data: maxRow } = await supabase.from('ban').select('ma_ban').order('ma_ban', { ascending: false }).limit(1).maybeSingle();
        const nextId = (maxRow?.ma_ban || 0) + 1;
        const payload = { ...input, ma_ban: nextId };
        const { data, error } = await supabase.from('ban').insert(payload).select().single();
        if (error) throw new Error(error.message);
        try {
            await qrModel.saveQRCodeToDB(data.ma_ban, `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://casacozy.vn/b/${data.ma_ban}`);
        } catch { }
        return data;
    },
    async update(id: number, input: Record<string, unknown>) {
        if (input.trang_thai === 'Trong') {
            tableResetMap.set(id, new Date());
        }
        const { data, error } = await supabase.from('ban').update(input).eq('ma_ban', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async hasActiveOrders(tableId: number): Promise<boolean> {
        const { data, error } = await supabase
            .from('donhang')
            .select('ma_don')
            .eq('ma_ban', tableId)
            .in('trang_thai', ['Cho tiep nhan', 'Cho xac nhan', 'Dang chuan bi', 'Dang phuc vu'])
            .limit(1);
        if (error) return false;
        return Boolean(data && data.length > 0);
    },
    async delete(id: number) {
        try {
            await supabase.from('maqr').delete().eq('ma_ban', id);
        } catch { }
        const { error } = await supabase.from('ban').delete().eq('ma_ban', id);
        if (error) throw new Error(error.message);
        return true;
    },
    async checkout(tableId: number, paymentMethod: string = 'TIEN_MAT') {
        const table = await this.findById(tableId);
        if (!table) throw new AppError('Không tìm thấy bàn ăn.', 404);

        // Lấy tất cả đơn hàng chưa hủy của bàn này
        const { data: orders, error } = await supabase
            .from('donhang')
            .select('ma_don, ma_ban, thoi_gian_tao, tong_tien, trang_thai, chitietdonhang(so_luong)')
            .eq('ma_ban', tableId)
            .neq('trang_thai', 'Da huy')
            .order('thoi_gian_tao', { ascending: false });

        if (error) throw new Error(error.message);

        // Lọc các đơn thuộc phiên hiện tại (sau thời điểm reset gần nhất nếu có)
        const resetTime = tableResetMap.get(tableId);
        const currentOrders = (orders || []).filter((o: any) => {
            if (resetTime && new Date(o.thoi_gian_tao) <= resetTime) return false;
            return true;
        });

        if (currentOrders.length === 0) {
            throw new AppError('Bàn hiện không có đơn hàng nào cần thanh toán.', 400);
        }

        // Kiểm tra điều kiện: Tất cả các đơn phải ở trạng thái 'Hoan tat' (Đã phục vụ)
        const unservedOrders = currentOrders.filter((o: any) => o.trang_thai !== 'Hoan tat');
        if (unservedOrders.length > 0) {
            throw new AppError(
                `Bàn vẫn còn ${unservedOrders.length} đợt gọi món chưa hoàn tất phục vụ lên bàn. Vui lòng bấm "Hoàn tất món" trước khi thanh toán!`,
                400
            );
        }

        // Tính tổng tiền và tổng món
        const totalAmount = currentOrders.reduce((sum: number, o: any) => sum + (Number(o.tong_tien) || 0), 0);
        const totalDishes = currentOrders.reduce((sum: number, o: any) => {
            const count = Array.isArray(o.chitietdonhang)
                ? o.chitietdonhang.reduce((s: number, item: any) => s + (item.so_luong || 1), 0)
                : 0;
            return sum + count;
        }, 0);
        const orderIds = currentOrders.map((o: any) => o.ma_don);

        // Cập nhật trạng thái bàn về 'Trong' (Bàn trống)
        await this.update(tableId, { trang_thai: 'Trong' });
        tableResetMap.set(tableId, new Date());

        return {
            tableId,
            tableName: table.ten_ban,
            totalAmount,
            totalDishes,
            orderCount: currentOrders.length,
            orderIds,
            paymentMethod,
            checkoutTime: new Date().toISOString(),
        };
    },
};
