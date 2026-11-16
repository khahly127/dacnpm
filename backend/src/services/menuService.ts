import { menuModel } from '../models/menuModel';
import { AppError } from '../utils/appError';

function getId(value: unknown): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('ID khong hop le.', 400);
    return id;
}
function getCategoryName(value: unknown): string {
    if (typeof value !== 'string' || !value.trim()) throw new AppError('ten_nhom la bat buoc.', 400);
    return value.trim();
}
function getDishInput(body: Record<string, unknown>) {
    const { ma_nhom, ten_mon, gia, hinh_anh, trang_thai } = body;
    if (!Number.isInteger(Number(ma_nhom)) || typeof ten_mon !== 'string' || !ten_mon.trim() || !Number.isFinite(Number(gia)) || Number(gia) < 0 || typeof trang_thai !== 'string') throw new AppError('Du lieu mon an khong hop le.', 400);
    return { ma_nhom: Number(ma_nhom), ten_mon: ten_mon.trim(), gia: Number(gia), hinh_anh: typeof hinh_anh === 'string' ? hinh_anh : null, trang_thai };
}

export const menuService = {
    async getMenu() { return menuModel.getMenu(); },
    async listCategories() { return menuModel.listCategories(); },
    async createCategory(body: Record<string, unknown>) { return menuModel.createCategory(getCategoryName(body.ten_nhom)); },
    async updateCategory(id: unknown, body: Record<string, unknown>) { return menuModel.updateCategory(getId(id), getCategoryName(body.ten_nhom)); },
    async removeCategory(id: unknown) { await menuModel.removeCategory(getId(id)); },
    async listDishes() { return menuModel.listDishes(); },
    async createDish(body: Record<string, unknown>) { return menuModel.createDish(getDishInput(body)); },
    async updateDish(id: unknown, body: Record<string, unknown>) { return menuModel.updateDish(getId(id), getDishInput(body)); },
    async removeDish(id: unknown) { await menuModel.removeDish(getId(id)); },
};
