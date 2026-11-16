import { NextFunction, Request, Response } from 'express';
import { tableModel } from '../models/tableModel';
import { AppError } from '../utils/appError';

function getTableId(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('Ma ban khong hop le.', 400);
    return id;
}

export const tableController = {
    async getTable(req: Request, res: Response, next: NextFunction) {
        try {
            const table = await tableModel.findById(getTableId(req.params.id as string));
            if (!table) throw new AppError('Khong tim thay ban.', 404);
            res.json({ success: true, data: table });
        } catch (error) { next(error); }
    },
    async list(_req: Request, res: Response, next: NextFunction) {
        try { const tables = await tableModel.list(); res.json({ success: true, data: tables }); } catch (error) { next(error); }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { ten_ban, trang_thai = 'Trong' } = req.body;
            if (typeof ten_ban !== 'string' || !ten_ban.trim() || typeof trang_thai !== 'string') throw new AppError('Du lieu ban khong hop le.', 400);
            const table = await tableModel.create({ ten_ban: ten_ban.trim(), trang_thai });
            res.status(201).json({ success: true, data: table });
        } catch (error) { next(error); }
    },
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const changes: Record<string, unknown> = {};
            if (typeof req.body.ten_ban === 'string' && req.body.ten_ban.trim()) changes.ten_ban = req.body.ten_ban.trim();
            if (typeof req.body.trang_thai === 'string' && req.body.trang_thai.trim()) changes.trang_thai = req.body.trang_thai.trim();
            if (!Object.keys(changes).length) throw new AppError('Khong co du lieu cap nhat hop le.', 400);
            const table = await tableModel.update(getTableId(req.params.id as string), changes);
            res.json({ success: true, data: table });
        } catch (error) { next(error); }
    },
};
