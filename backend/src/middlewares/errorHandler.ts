import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({
        success: false,
        message: `Khong tim thay endpoint ${req.method} ${req.originalUrl}`,
    });
}

export function errorHandler(error: any, _req: Request, res: Response, _next: NextFunction): void {
    console.error(error);
    let statusCode = error instanceof AppError ? error.statusCode : 500;
    let message = error.message || 'Lỗi máy chủ nội bộ.';

    // Map Postgres foreign key constraint error code 23503
    if (error?.code === '23503' || (typeof error?.message === 'string' && error.message.includes('foreign key constraint'))) {
        statusCode = 400;
        message = 'Dữ liệu đang được liên kết với các bản ghi khác (đơn hàng, món ăn hoặc hóa đơn), không thể xóa trực tiếp!';
    }
    // Map Postgres unique constraint error code 23505
    else if (error?.code === '23505' || (typeof error?.message === 'string' && error.message.includes('duplicate key value'))) {
        statusCode = 400;
        message = 'Dữ liệu bị trùng lặp (khóa chính hoặc tài khoản đã tồn tại trên hệ thống)!';
    }
    // Map Supabase no rows found error code PGRST116
    else if (error?.code === 'PGRST116') {
        statusCode = 404;
        message = 'Không tìm thấy bản ghi dữ liệu yêu cầu.';
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
}
