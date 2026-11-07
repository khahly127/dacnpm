import { NextFunction, Response } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { authService } from '../services/authService';
import { AppError } from '../utils/appError';

export function verifyToken(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
    try {
        const authorization = req.headers.authorization;
        if (!authorization?.startsWith('Bearer ')) throw new AppError('Thieu Bearer token.', 401);
        req.user = authService.verifyToken(authorization.slice(7));
        next();
    } catch (error) {
        next(error);
    }
}

export function checkRole(...roles: UserRole[]) {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            next(new AppError('Ban khong co quyen truy cap chuc nang nay.', 403));
            return;
        }
        next();
    };
}
