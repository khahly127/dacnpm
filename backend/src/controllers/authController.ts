import { NextFunction, Request, Response } from 'express';
import { employeeModel } from '../models/employeeModel';
import { authService } from '../services/authService';
import { AppError } from '../utils/appError';

export const authController = {
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { tai_khoan, mat_khau } = req.body;
            if (typeof tai_khoan !== 'string' || typeof mat_khau !== 'string') {
                throw new AppError('Tai khoan va mat khau la bat buoc.', 400);
            }
            const employee = await employeeModel.findByUsername(tai_khoan);
            if (!employee || !(await authService.verifyPassword(mat_khau, employee.mat_khau))) {
                throw new AppError('Tai khoan hoac mat khau khong dung.', 401);
            }
            const token = authService.createToken({ id: employee.ma_nv, role: employee.vai_tro, username: employee.tai_khoan });
            res.status(200).json({ success: true, token, user: { ma_nv: employee.ma_nv, ho_ten: employee.ho_ten, tai_khoan: employee.tai_khoan, vai_tro: employee.vai_tro } });
        } catch (error) { next(error); }
    },
};
