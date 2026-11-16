import { NextFunction, Response } from 'express';
import { employeeModel } from '../models/employeeModel';
import { authService } from '../services/authService';
import { AuthenticatedRequest, UserRole } from '../types';
import { AppError } from '../utils/appError';

function getEmployeeId(value: string): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError('Ma nhan vien khong hop le.', 400);
    }
    return id;
}

function getManagerRole(value: unknown): UserRole {
    if (value !== 'QuanLy') {
        throw new AppError('Quan tri vien chi co the tao tai khoan QuanLy.', 400);
    }
    return value;
}

export const employeeController = {
    async list(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const employees = await employeeModel.list();
            res.json({ success: true, data: employees });
        } catch (error) {
            next(error);
        }
    },

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { ho_ten, tai_khoan, mat_khau, vai_tro } = req.body;

            if (typeof ho_ten !== 'string' || typeof tai_khoan !== 'string' || typeof mat_khau !== 'string') {
                throw new AppError('Ho ten, tai_khoan va mat_khau la bat buoc.', 400);
            }
            if (!ho_ten.trim() || !tai_khoan.trim()) {
                throw new AppError('Ho ten va tai khoan khong duoc de trong.', 400);
            }
            if (mat_khau.length < 8) {
                throw new AppError('Mat khau phai co it nhat 8 ky tu.', 400);
            }

            const employee = await employeeModel.create({
                ho_ten: ho_ten.trim(),
                tai_khoan: tai_khoan.trim(),
                mat_khau: await authService.hashPassword(mat_khau),
                vai_tro: getManagerRole(vai_tro),
            });

            res.status(201).json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    },

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const changes: Record<string, unknown> = {};
            const employeeId = getEmployeeId(req.params.id as string);

            if (typeof req.body.ho_ten === 'string' && req.body.ho_ten.trim()) {
                changes.ho_ten = req.body.ho_ten.trim();
            }
            if (typeof req.body.tai_khoan === 'string' && req.body.tai_khoan.trim()) {
                changes.tai_khoan = req.body.tai_khoan.trim();
            }
            if (req.body.vai_tro !== undefined) {
                changes.vai_tro = getManagerRole(req.body.vai_tro);
            }
            if (req.body.mat_khau !== undefined) {
                if (typeof req.body.mat_khau !== 'string' || req.body.mat_khau.length < 8) {
                    throw new AppError('Mat khau phai co it nhat 8 ky tu.', 400);
                }
                changes.mat_khau = await authService.hashPassword(req.body.mat_khau);
            }
            if (Object.keys(changes).length === 0) {
                throw new AppError('Khong co du lieu cap nhat hop le.', 400);
            }

            const employee = await employeeModel.update(employeeId, changes);
            res.json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    },

    async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const employeeId = getEmployeeId(req.params.id as string);

            if (employeeId === req.user?.id) {
                throw new AppError('Khong the xoa tai khoan dang dang nhap.', 400);
            }

            await employeeModel.remove(employeeId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};
