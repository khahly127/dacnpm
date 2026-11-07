import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        message: `Khong tim thay endpoint ${req.method} ${req.originalUrl}`,
    });
}

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    console.error(error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Loi may chu noi bo.' : error.message,
    });
}
