import { supabase } from '../config/supabaseClient';
import { qrModel } from './qrModel';

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
            const { data: activeOrders } = await supabase
                .from('donhang')
                .select('ma_don, ma_ban, thoi_gian_tao, tong_tien, trang_thai, chitietdonhang(so_luong)')
                .in('trang_thai', ['Cho xac nhan', 'Dang chuan bi', 'Dang phuc vu'])
                .order('thoi_gian_tao', { ascending: false });

            const orderMap = new Map<number, any>();
            if (activeOrders) {
                for (const order of activeOrders) {
                    if (order.ma_ban && !orderMap.has(order.ma_ban)) {
                        const totalDishes = Array.isArray(order.chitietdonhang)
                            ? order.chitietdonhang.reduce((sum: number, item: any) => sum + (item.so_luong || 1), 0)
                            : 0;
                        orderMap.set(order.ma_ban, {
                            ma_don: order.ma_don,
                            so_mon: totalDishes,
                            thoi_gian_tao: order.thoi_gian_tao,
                            tong_tien: order.tong_tien,
                            trang_thai: order.trang_thai,
                        });
                    }
                }
            }

            return (tables || []).map((table: any) => ({
                ...table,
                don_hang_hien_tai: orderMap.get(table.ma_ban) || null,
            }));
        } catch {
            return tables || [];
        }
    },
    async create(input: { ten_ban: string; trang_thai: string }) {
        const { data, error } = await supabase.from('ban').insert(input).select().single();
        if (error) throw new Error(error.message);
        try {
            await qrModel.saveQRCodeToDB(data.ma_ban, `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://casacozy.vn/b/${data.ma_ban}`);
        } catch {}
        return data;
    },
    async update(id: number, input: Record<string, unknown>) {
        const { data, error } = await supabase.from('ban').update(input).eq('ma_ban', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async delete(id: number) {
        try {
            await supabase.from('maqr').delete().eq('ma_ban', id);
        } catch {}
        const { error } = await supabase.from('ban').delete().eq('ma_ban', id);
        if (error) throw new Error(error.message);
        return true;
    },
};
