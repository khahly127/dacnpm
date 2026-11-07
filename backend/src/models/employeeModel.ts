import { supabase } from '../config/supabaseClient';
import { UserRole } from '../types';

const publicFields = 'ma_nv, ho_ten, tai_khoan, vai_tro';

export const employeeModel = {
    async findByUsername(username: string) {
        const { data, error } = await supabase.from('nhanvien').select('*').eq('tai_khoan', username).maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    },

    async list() {
        const { data, error } = await supabase.from('nhanvien').select(publicFields).order('ma_nv');
        if (error) throw new Error(error.message);
        return data;
    },

    async create(input: { ho_ten: string; tai_khoan: string; mat_khau: string; vai_tro: UserRole }) {
        const { data, error } = await supabase.from('nhanvien').insert(input).select(publicFields).single();
        if (error) throw new Error(error.message);
        return data;
    },

    async update(id: number, input: Record<string, unknown>) {
        const { data, error } = await supabase.from('nhanvien').update(input).eq('ma_nv', id).select(publicFields).single();
        if (error) throw new Error(error.message);
        return data;
    },

    async remove(id: number) {
        const { error } = await supabase.from('nhanvien').delete().eq('ma_nv', id);
        if (error) throw new Error(error.message);
    },
};
