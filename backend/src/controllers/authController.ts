import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/authService';
import { AuthenticatedRequest } from '../types';

export const authController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body.tai_khoan, req.body.mat_khau);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.user?.id);
            const { currentPassword, newPassword } = req.body;
            const result = await authService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = Number(req.user?.id);
            const { ho_ten } = req.body;
            const result = await authService.updateProfile(userId, { ho_ten });
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};
