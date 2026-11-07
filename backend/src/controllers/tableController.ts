import { NextFunction, Request, Response } from 'express';
import { tableModel } from '../models/tableModel';
import { AppError } from '../utils/appError';

const tableId = (raw: string) => { const value = Number(raw); if (!Number.isInteger(value) || value <= 0) throw new AppError('Ma ban khong hop le.', 400); return value; };

export const tableController = {
    async getTable(req: Request, res: Response, next: NextFunction) { try { const table = await tableModel.findById(tableId(req.params.id as string)); if (!table) throw new AppError('Khong tim thay ban.', 404); res.json({ success: true, data: table }); } catch (e) { next(e); } },
    async list(req: Request, res: Response, next: NextFunction) { try { res.json({ success: true, data: await tableModel.list() }); } catch (e) { next(e); } },
    async create(req: Request, res: Response, next: NextFunction) { try { const { ten_ban, trang_thai = 'Trong' } = req.body; if (typeof ten_ban !== 'string' || !ten_ban.trim() || typeof trang_thai !== 'string') throw new AppError('Du lieu ban khong hop le.', 400); res.status(201).json({ success: true, data: await tableModel.create({ ten_ban: ten_ban.trim(), trang_thai }) }); } catch (e) { next(e); } },
    async update(req: Request, res: Response, next: NextFunction) { try { const input: Record<string, unknown> = {}; if (typeof req.body.ten_ban === 'string' && req.body.ten_ban.trim()) input.ten_ban = req.body.ten_ban.trim(); if (typeof req.body.trang_thai === 'string' && req.body.trang_thai.trim()) input.trang_thai = req.body.trang_thai.trim(); if (!Object.keys(input).length) throw new AppError('Khong co du lieu cap nhat hop le.', 400); res.json({ success: true, data: await tableModel.update(tableId(req.params.id as string), input) }); } catch (e) { next(e); } },
};
