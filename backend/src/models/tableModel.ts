import { supabase } from '../config/supabaseClient';

export const tableModel = {
    async findById(id: number) {
        const { data, error } = await supabase.from('ban').select('*').eq('ma_ban', id).maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    },
    async list() {
        const { data, error } = await supabase.from('ban').select('*').order('ma_ban');
        if (error) throw new Error(error.message);
        return data;
    },
    async create(input: { ten_ban: string; trang_thai: string }) {
        const { data, error } = await supabase.from('ban').insert(input).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
    async update(id: number, input: Record<string, unknown>) {
        const { data, error } = await supabase.from('ban').update(input).eq('ma_ban', id).select().single();
        if (error) throw new Error(error.message);
        return data;
    },
};
