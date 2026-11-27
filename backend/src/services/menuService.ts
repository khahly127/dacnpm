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
    const { ma_nhom, ten_mon, gia, hinh_anh, trang_thai, mo_ta } = body;
    if (!Number.isInteger(Number(ma_nhom)) || typeof ten_mon !== 'string' || !ten_mon.trim() || !Number.isFinite(Number(gia)) || Number(gia) < 0 || typeof trang_thai !== 'string') throw new AppError('Du lieu mon an khong hop le.', 400);
    return {
        ma_nhom: Number(ma_nhom),
        ten_mon: ten_mon.trim(),
        gia: Number(gia),
        hinh_anh: typeof hinh_anh === 'string' ? hinh_anh : null,
        trang_thai,
        mo_ta: typeof mo_ta === 'string' && mo_ta.trim() ? mo_ta.trim() : null,
    };
}
function getUpdateDishInput(body: Record<string, unknown>) {
    const input: Record<string, unknown> = {};
    if (body.ma_nhom !== undefined) input.ma_nhom = Number(body.ma_nhom);
    if (typeof body.ten_mon === 'string' && body.ten_mon.trim()) input.ten_mon = body.ten_mon.trim();
    if (body.gia !== undefined && Number.isFinite(Number(body.gia))) input.gia = Number(body.gia);
    if (body.hinh_anh !== undefined) input.hinh_anh = typeof body.hinh_anh === 'string' ? body.hinh_anh : null;
    if (typeof body.trang_thai === 'string' && body.trang_thai.trim()) input.trang_thai = body.trang_thai.trim();
    if (body.mo_ta !== undefined) input.mo_ta = typeof body.mo_ta === 'string' && body.mo_ta.trim() ? body.mo_ta.trim() : null;
    if (!Object.keys(input).length) throw new AppError('Khong co du lieu cap nhat hop le.', 400);
    return input;
}

export const menuService = {
    async getMenu() { return menuModel.getMenu(); },
    async listCategories() { return menuModel.listCategories(); },
    async createCategory(body: Record<string, unknown>) { return menuModel.createCategory(getCategoryName(body.ten_nhom)); },
    async updateCategory(id: unknown, body: Record<string, unknown>) { return menuModel.updateCategory(getId(id), getCategoryName(body.ten_nhom)); },
    async removeCategory(id: unknown) {
        const categoryId = getId(id);
        const count = await menuModel.countDishesInCategory(categoryId);
        if (count > 0) {
            throw new AppError(`Không thể xóa danh mục đang có ${count} món ăn. Vui lòng chuyển hoặc xóa các món ăn thuộc danh mục này trước!`, 400);
        }
        await menuModel.removeCategory(categoryId);
    },
    async listDishes() { return menuModel.listDishes(); },
    async createDish(body: Record<string, unknown>) { return menuModel.createDish(getDishInput(body)); },
    async updateDish(id: unknown, body: Record<string, unknown>) { return menuModel.updateDish(getId(id), getUpdateDishInput(body)); },
    async removeDish(id: unknown) {
        const dishId = getId(id);
        const inOrders = await menuModel.isDishInOrders(dishId);
        if (inOrders) {
            throw new AppError('Món ăn này đã có trong lịch sử đơn hàng, không thể xóa để bảo toàn dữ liệu. Vui lòng chuyển trạng thái sang "Đã ẩn"!', 400);
        }
        await menuModel.removeDish(dishId);
    },
};
