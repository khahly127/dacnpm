import { supabase } from '../config/supabaseClient';
import { OrderStatus } from '../types';

export const orderModel = {
    async createOrder(input: { ma_ban: number; tong_tien: number; trang_thai: OrderStatus }) {
        const { data, error } = await supabase.from('donhang').insert(input).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async createDetails(details: Array<{ ma_don: number; ma_mon: number; so_luong: number; don_gia: number; ghi_chu: string | null }>) {
        const { data, error } = await supabase.from('chitietdonhang').insert(details).select();
        if (error) throw new Error(error.message);
        return data;
    },
    async deleteOrder(id: number) {
        const { error } = await supabase.from('donhang').delete().eq('ma_don', id);
        if (error) throw new Error(error.message);
    },
    async getById(id: number) {
        const { data, error } = await supabase.from('donhang').select('*, ban(ma_ban, ten_ban), nhanvien(ma_nv, ho_ten), chitietdonhang(ma_ct, ma_mon, so_luong, don_gia, ghi_chu, monan(ma_mon, ten_mon, hinh_anh))').eq('ma_don', id).maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    },
    async listByTable(tableId: number) {
        const { data, error } = await supabase.from('donhang').select('*, chitietdonhang(ma_ct, ma_mon, so_luong, don_gia, ghi_chu, monan(ma_mon, ten_mon, hinh_anh))').eq('ma_ban', tableId).order('thoi_gian_tao', { ascending: false });
        if (error) throw new Error(error.message);
        return data;
    },
    async listAll(status?: string) {
        let query = supabase.from('donhang').select('*, ban(ma_ban, ten_ban), nhanvien(ma_nv, ho_ten), chitietdonhang(ma_ct, ma_mon, so_luong, don_gia, ghi_chu, monan(ma_mon, ten_mon))').order('thoi_gian_tao', { ascending: false });
        if (status) query = query.eq('trang_thai', status);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        return data;
    },
    async updateStatus(id: number, status: OrderStatus, employeeId: number) {
        const { data, error } = await supabase.from('donhang').update({ trang_thai: status, ma_nv: employeeId }).eq('ma_don', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
};
