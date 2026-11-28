import { NextFunction, Request, Response } from 'express';
import { tableService } from '../services/tableService';

export const tableController = {
    async getTable(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await tableService.getById(req.params.id) });
        } catch (error) { next(error); }
    },
    async list(_req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await tableService.list() });
        } catch (error) { next(error); }
    },
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(201).json({ success: true, data: await tableService.create(req.body) });
        } catch (error) { next(error); }
    },
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            res.json({ success: true, data: await tableService.update(req.params.id, req.body) });
        } catch (error) { next(error); }
    },
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await tableService.delete(req.params.id);
            res.json({ success: true, message: 'Xoa ban thanh cong.' });
        } catch (error) { next(error); }
    },
    async checkout(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await tableService.checkout(req.params.id, req.body);
            res.json({ success: true, message: 'Thanh toán bàn thành công!', data: result });
        } catch (error) { next(error); }
    },
};
