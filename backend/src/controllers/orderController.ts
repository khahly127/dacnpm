import { NextFunction, Request, Response } from 'express';
import { orderModel } from '../models/orderModel';
import { orderService } from '../services/orderService';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../utils/appError';

export const orderController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderService.createOrder(req.body.ma_ban, req.body.items);
            res.status(201).json({ success: true, message: 'Dat mon thanh cong.', data: order });
        } catch (error) { next(error); }
    },
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const order = await orderModel.getById(orderService.parseId(req.params.id, 'Ma don'));
            if (!order) throw new AppError('Khong tim thay don hang.', 404); res.json({ success: true, data: order });
        } catch (error) { next(error); }
    },
    async listByTable(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await orderModel.listByTable(orderService.parseId(req.params.tableId, 'Ma ban'));
            res.json({ success: true, data: orders });
        } catch (error) { next(error); }
    },
    async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const status = typeof req.query.status === 'string' ? req.query.status : undefined;
            const orders = await orderModel.listAll(status); res.json({ success: true, data: orders });
        } catch (error) { next(error); }
    },
    async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const order = await orderService.updateStatus(req.params.id, req.body.trang_thai, req.user!.id);
            res.json({ success: true, data: order });
        } catch (error) { next(error); }
    },
};
