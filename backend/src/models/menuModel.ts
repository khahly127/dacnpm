import { supabase } from '../config/supabaseClient';

export const menuModel = {
    async getMenu() {
        const { data, error } = await supabase.from('nhommon').select('ma_nhom, ten_nhom, monan(ma_mon, ten_mon, gia, hinh_anh, trang_thai)').order('ma_nhom');
        if (error) throw new Error(error.message);
        return data;
    },
    async listCategories() {
        const { data, error } = await supabase.from('nhommon').select('*').order('ma_nhom');
        if (error) throw new Error(error.message);
        return data;
    },
    async createCategory(ten_nhom: string) {
        const { data, error } = await supabase.from('nhommon').insert({ ten_nhom }).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async updateCategory(id: number, ten_nhom: string) {
        const { data, error } = await supabase.from('nhommon').update({ ten_nhom }).eq('ma_nhom', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async removeCategory(id: number) {
        const { error } = await supabase.from('nhommon').delete().eq('ma_nhom', id);
        if (error) throw new Error(error.message);
    },
    async listDishes() {
        const { data, error } = await supabase.from('monan').select('*, nhommon(ma_nhom, ten_nhom)').order('ma_mon');
        if (error) throw new Error(error.message);
        return data;
    },
    async createDish(input: Record<string, unknown>) {
        const { data, error } = await supabase.from('monan').insert(input).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async updateDish(id: number, input: Record<string, unknown>) {
        const { data, error } = await supabase.from('monan').update(input).eq('ma_mon', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async removeDish(id: number) {
        const { error } = await supabase.from('monan').delete().eq('ma_mon', id);
        if (error) throw new Error(error.message);
    },
    async getDishesByIds(ids: number[]) {
        const { data, error } = await supabase.from('monan').select('ma_mon, ten_mon, gia, trang_thai').in('ma_mon', ids);
        if (error) throw new Error(error.message);
        return data ?? [];
    },
};
