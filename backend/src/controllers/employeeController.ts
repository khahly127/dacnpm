import { NextFunction, Response } from 'express';
import { employeeModel } from '../models/employeeModel';
import { authService } from '../services/authService';
import { AuthenticatedRequest, UserRole } from '../types';
import { AppError } from '../utils/appError';

const employeeId = (raw: string) => { const value = Number(raw); if (!Number.isInteger(value) || value <= 0) throw new AppError('Ma nhan vien khong hop le.', 400); return value; };
const managerRole = (value: unknown): UserRole => {
    if (value !== 'QuanLy') throw new AppError('Quan tri vien chi co the tao tai khoan QuanLy.', 400);
    return value;
};

export const employeeController = {
    async list(_req: AuthenticatedRequest, res: Response, next: NextFunction) { try { res.json({ success: true, data: await employeeModel.list() }); } catch (e) { next(e); } },
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const { ho_ten, tai_khoan, mat_khau, vai_tro } = req.body; if ([ho_ten, tai_khoan, mat_khau].some(value => typeof value !== 'string' || !value.trim())) throw new AppError('Ho ten, tai_khoan va mat_khau la bat buoc.', 400); if (mat_khau.length < 8) throw new AppError('Mat khau phai co it nhat 8 ky tu.', 400); const data = await employeeModel.create({ ho_ten: ho_ten.trim(), tai_khoan: tai_khoan.trim(), mat_khau: await authService.hashPassword(mat_khau), vai_tro: managerRole(vai_tro) }); res.status(201).json({ success: true, data }); } catch (e) { next(e); } },
    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const input: Record<string, unknown> = {}; if (typeof req.body.ho_ten === 'string' && req.body.ho_ten.trim()) input.ho_ten = req.body.ho_ten.trim(); if (typeof req.body.tai_khoan === 'string' && req.body.tai_khoan.trim()) input.tai_khoan = req.body.tai_khoan.trim(); if (req.body.vai_tro !== undefined) input.vai_tro = managerRole(req.body.vai_tro); if (req.body.mat_khau !== undefined) { if (typeof req.body.mat_khau !== 'string' || req.body.mat_khau.length < 8) throw new AppError('Mat khau phai co it nhat 8 ky tu.', 400); input.mat_khau = await authService.hashPassword(req.body.mat_khau); } if (!Object.keys(input).length) throw new AppError('Khong co du lieu cap nhat hop le.', 400); res.json({ success: true, data: await employeeModel.update(employeeId(req.params.id as string), input) }); } catch (e) { next(e); } },
    async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) { try { const id = employeeId(req.params.id as string); if (id === req.user?.id) throw new AppError('Khong the xoa tai khoan dang dang nhap.', 400); await employeeModel.remove(id); res.status(204).send(); } catch (e) { next(e); } },
};
