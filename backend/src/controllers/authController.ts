import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/authService';

export const authController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body.tai_khoan, req.body.mat_khau);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    },
};
