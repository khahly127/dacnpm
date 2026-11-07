import { NextFunction, Request, Response } from 'express';
import { menuModel } from '../models/menuModel';
import { AppError } from '../utils/appError';

const id = (value: string) => { const parsed = Number(value); if (!Number.isInteger(parsed) || parsed <= 0) throw new AppError('ID khong hop le.', 400); return parsed; };
const dishInput = (body: Record<string, unknown>) => {
    const { ma_nhom, ten_mon, gia, hinh_anh, trang_thai } = body;
    if (!Number.isInteger(Number(ma_nhom)) || typeof ten_mon !== 'string' || !ten_mon.trim() || !Number.isFinite(Number(gia)) || Number(gia) < 0 || typeof trang_thai !== 'string') throw new AppError('Du lieu mon an khong hop le.', 400);
    return { ma_nhom: Number(ma_nhom), ten_mon: ten_mon.trim(), gia: Number(gia), hinh_anh: typeof hinh_anh === 'string' ? hinh_anh : null, trang_thai };
};

export const menuController = {
    async getMenu(_req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await menuModel.getMenu() }); } catch (e) { next(e); } },
    async listCategories(_req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await menuModel.listCategories() }); } catch (e) { next(e); } },
    async createCategory(req: Request, res: Response, next: NextFunction) { try { const name = req.body.ten_nhom; if (typeof name !== 'string' || !name.trim()) throw new AppError('ten_nhom la bat buoc.', 400); res.status(201).json({ success: true, data: await menuModel.createCategory(name.trim()) }); } catch (e) { next(e); } },
    async updateCategory(req: Request, res: Response, next: NextFunction) { try { const name = req.body.ten_nhom; if (typeof name !== 'string' || !name.trim()) throw new AppError('ten_nhom la bat buoc.', 400); res.json({ success: true, data: await menuModel.updateCategory(id(req.params.id as string), name.trim()) }); } catch (e) { next(e); } },
    async removeCategory(req: Request, res: Response, next: NextFunction) { try { await menuModel.removeCategory(id(req.params.id as string)); res.status(204).send(); } catch (e) { next(e); } },
    async listDishes(_req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await menuModel.listDishes() }); } catch (e) { next(e); } },
    async createDish(req: Request, res: Response, next: NextFunction) { try { res.status(201).json({ success: true, data: await menuModel.createDish(dishInput(req.body)) }); } catch (e) { next(e); } },
    async updateDish(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await menuModel.updateDish(id(req.params.id as string), dishInput(req.body)) }); } catch (e) { next(e); } },
    async removeDish(req: Request, res: Response, next: NextFunction) { try { await menuModel.removeDish(id(req.params.id as string)); res.status(204).send(); } catch (e) { next(e); } },
};
