import { NextFunction, Request, Response } from 'express';
import { menuModel } from '../models/menuModel';
import { AppError } from '../utils/appError';

function getId(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('ID khong hop le.', 400);
    return id;
}

function getDishInput(body: Record<string, unknown>) {
    const { ma_nhom, ten_mon, gia, hinh_anh, trang_thai } = body;
    if (!Number.isInteger(Number(ma_nhom)) || typeof ten_mon !== 'string' || !ten_mon.trim() || !Number.isFinite(Number(gia)) || Number(gia) < 0 || typeof trang_thai !== 'string') {
        throw new AppError('Du lieu mon an khong hop le.', 400);
    }
    return { ma_nhom: Number(ma_nhom), ten_mon: ten_mon.trim(), gia: Number(gia), hinh_anh: typeof hinh_anh === 'string' ? hinh_anh : null, trang_thai };
}

export const menuController = {
    async getMenu(_req: Request, res: Response, next: NextFunction) {
        try { res.json({ success: true, data: await menuModel.getMenu() }); } catch (error) { next(error); }
    },
    async listCategories(_req: Request, res: Response, next: NextFunction) {
        try { res.json({ success: true, data: await menuModel.listCategories() }); } catch (error) { next(error); }
    },
    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { ten_nhom } = req.body;
            if (typeof ten_nhom !== 'string' || !ten_nhom.trim()) throw new AppError('ten_nhom la bat buoc.', 400);
            const category = await menuModel.createCategory(ten_nhom.trim());
            res.status(201).json({ success: true, data: category });
        } catch (error) { next(error); }
    },
    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { ten_nhom } = req.body;
            if (typeof ten_nhom !== 'string' || !ten_nhom.trim()) throw new AppError('ten_nhom la bat buoc.', 400);
            const category = await menuModel.updateCategory(getId(req.params.id as string), ten_nhom.trim());
            res.json({ success: true, data: category });
        } catch (error) { next(error); }
    },
    async removeCategory(req: Request, res: Response, next: NextFunction) {
        try {
            await menuModel.removeCategory(getId(req.params.id as string));
            res.status(204).send();
        } catch (error) { next(error); }
    },
    async listDishes(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await menuModel.listDishes() });
        } catch (error) { next(error); }
    },
    async createDish(req: Request, res: Response, next: NextFunction) {
        try {
            const dish = await menuModel.createDish(getDishInput(req.body));
            res.status(201).json({ success: true, data: dish });
        } catch (error) { next(error); }
    },
    async updateDish(req: Request, res: Response, next: NextFunction) {
        try {
            const dish = await menuModel.updateDish(getId(req.params.id as string), getDishInput(req.body));
            res.json({ success: true, data: dish });
        } catch (error) { next(error); }
    },
    async removeDish(req: Request, res: Response, next: NextFunction) {
        try {
            await menuModel.removeDish(getId(req.params.id as string));
            res.status(204).send();
        } catch (error) { next(error); }
    },
};
