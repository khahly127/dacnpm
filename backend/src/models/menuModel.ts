import { supabase } from '../config/supabaseClient';

export const menuModel = {
    async getMenu() {
        const { data, error } = await supabase.from('nhommon').select('ma_nhom, ten_nhom, monan(ma_mon, ten_mon, gia, hinh_anh, trang_thai, mo_ta)').order('ma_nhom');
        if (error) throw new Error(error.message);
        return data;
    },
    async listCategories() {
        const { data, error } = await supabase.from('nhommon').select('*, monan(ma_mon, ten_mon)').order('ma_nhom');
        if (error) throw new Error(error.message);
        return data;
    },
    async createCategory(ten_nhom: string) {
        const { data: maxRow } = await supabase.from('nhommon').select('ma_nhom').order('ma_nhom', { ascending: false }).limit(1).maybeSingle();
        const nextId = (maxRow?.ma_nhom || 0) + 1;
        const { data, error } = await supabase.from('nhommon').insert({ ma_nhom: nextId, ten_nhom }).select().single();
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
    async countDishesInCategory(categoryId: number): Promise<number> {
        const { count, error } = await supabase.from('monan').select('*', { count: 'exact', head: true }).eq('ma_nhom', categoryId);
        if (error) return 0;
        return count || 0;
    },
    async isDishInOrders(dishId: number): Promise<boolean> {
        const { count, error } = await supabase.from('chitietdonhang').select('*', { count: 'exact', head: true }).eq('ma_mon', dishId);
        if (error) return false;
        return (count || 0) > 0;
    },
    async listDishes() {
        const { data, error } = await supabase.from('monan').select('*, nhommon(ma_nhom, ten_nhom)').order('ma_mon');
        if (error) throw new Error(error.message);
        return data;
    },
    async createDish(input: Record<string, unknown>) {
        const payload = { ...input };
        if (!payload.ma_mon) {
            const { data: maxRow } = await supabase.from('monan').select('ma_mon').order('ma_mon', { ascending: false }).limit(1).maybeSingle();
            payload.ma_mon = (maxRow?.ma_mon || 0) + 1;
        }
        const { data, error } = await supabase.from('monan').insert(payload).select('*, nhommon(ma_nhom, ten_nhom)').single();
        if (error) throw new Error(error.message);
        return data;
    },
    async updateDish(id: number, input: Record<string, unknown>) {
        const { data, error } = await supabase.from('monan').update(input).eq('ma_mon', id).select('*, nhommon(ma_nhom, ten_nhom)').single();
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
