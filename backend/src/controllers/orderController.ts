import { NextFunction, Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { AuthenticatedRequest } from '../types';

export const orderController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderService.createOrder(req.body.ma_ban, req.body.items);
            res.status(201).json({ success: true, message: 'Dat mon thanh cong.', data: order });
        } catch (error) { next(error); }
    },
    async getById(req: Request, res: Response, next: NextFunction) {
        try { res.json({ success: true, data: await orderService.getById(req.params.id) }); } catch (error) { next(error); }
    },
    async listByTable(req: Request, res: Response, next: NextFunction) {
        try { res.json({ success: true, data: await orderService.listByTable(req.params.tableId) }); } catch (error) { next(error); }
    },
    async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const status = typeof req.query.status === 'string' ? req.query.status : undefined;
            res.json({ success: true, data: await orderService.listAll(status) });
        } catch (error) { next(error); }
    },
    async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try { res.json({ success: true, data: await orderService.updateStatus(req.params.id, req.body.trang_thai, req.user!.id) }); } catch (error) { next(error); }
    },
};
