import { NextFunction, Request, Response } from 'express';
import { orderModel } from '../models/orderModel';
import { orderService } from '../services/orderService';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../utils/appError';

export const orderController = {
    async create(req: Request, res: Response, next: NextFunction) { try { const data = await orderService.createOrder(req.body.ma_ban, req.body.items); res.status(201).json({ success: true, message: 'Dat mon thanh cong.', data }); } catch (e) { next(e); } },
    async getById(req: Request, res: Response, next: NextFunction) { try { const data = await orderModel.getById(orderService.parseId(req.params.id, 'Ma don')); if (!data) throw new AppError('Khong tim thay don hang.', 404); res.json({ success: true, data }); } catch (e) { next(e); } },
    async listByTable(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await orderModel.listByTable(orderService.parseId(req.params.tableId, 'Ma ban')) }); } catch (e) { next(e); } },
    async listAll(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const status = typeof req.query.status === 'string' ? req.query.status : undefined; res.json({ success: true, data: await orderModel.listAll(status) }); } catch (e) { next(e); } },
    async updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const data = await orderService.updateStatus(req.params.id, req.body.trang_thai, req.user!.id); res.json({ success: true, data }); } catch (e) { next(e); } },
};
