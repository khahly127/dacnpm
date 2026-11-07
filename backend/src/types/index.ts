export type UserRole = 'QuanLy' | 'QuanTriVien';

export interface AuthenticatedRequest extends Request {
    user?: { id: number; role: UserRole; username: string };
}

export interface OrderItemInput {
    ma_mon: number;
    so_luong: number;
    ghi_chu?: string;
}

export const ORDER_STATUSES = ['Cho xac nhan', 'Dang chuan bi', 'Dang phuc vu', 'Hoan tat', 'Da huy'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
import { Request } from 'express';

