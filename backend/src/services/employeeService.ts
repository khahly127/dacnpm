import { employeeModel } from '../models/employeeModel';
import { UserRole } from '../types';
import { AppError } from '../utils/appError';
import { authService } from './authService';

function getEmployeeId(value: unknown): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('Ma nhan vien khong hop le.', 400);
    return id;
}

function getRole(value: unknown): UserRole {
    if (value === 'QuanLy' || value === 'QuanTriVien' || value === 'ADMIN') return value as UserRole;
    throw new AppError('Vai tro khong hop le (chi chap nhan QuanLy, QuanTriVien, ADMIN).', 400);
}

export const employeeService = {
    async list() {
        return employeeModel.list();
    },
    async create(body: Record<string, unknown>) {
        const { ho_ten, tai_khoan, mat_khau, vai_tro } = body;
        if (typeof ho_ten !== 'string' || typeof tai_khoan !== 'string' || typeof mat_khau !== 'string') throw new AppError('Ho ten, tai_khoan va mat_khau la bat buoc.', 400);
        if (!ho_ten.trim() || !tai_khoan.trim()) throw new AppError('Ho ten va tai khoan khong duoc de trong.', 400);
        if (mat_khau.length < 8) throw new AppError('Mat khau phai co it nhat 8 ky tu.', 400);

        const existing = await employeeModel.findByUsername(tai_khoan.trim());
        if (existing) throw new AppError(`Tài khoản "${tai_khoan.trim()}" đã tồn tại trên hệ thống.`, 400);

        return employeeModel.create({ ho_ten: ho_ten.trim(), tai_khoan: tai_khoan.trim(), mat_khau: await authService.hashPassword(mat_khau), vai_tro: getRole(vai_tro || 'QuanLy') });
    },
    async update(idValue: unknown, body: Record<string, unknown>) {
        const employeeId = getEmployeeId(idValue);
        const changes: Record<string, unknown> = {};
        if (typeof body.ho_ten === 'string' && body.ho_ten.trim()) changes.ho_ten = body.ho_ten.trim();
        if (typeof body.tai_khoan === 'string' && body.tai_khoan.trim()) {
            const trimmedUsername = body.tai_khoan.trim();
            const existing = await employeeModel.findByUsername(trimmedUsername);
            if (existing && existing.ma_nv !== employeeId) {
                throw new AppError(`Tài khoản "${trimmedUsername}" đã được sử dụng bởi nhân viên khác.`, 400);
            }
            changes.tai_khoan = trimmedUsername;
        }
        if (body.vai_tro !== undefined) changes.vai_tro = getRole(body.vai_tro);
        if (body.mat_khau !== undefined) {
            if (typeof body.mat_khau !== 'string' || body.mat_khau.length < 8) throw new AppError('Mat khau phai co it nhat 8 ky tu.', 400);
            changes.mat_khau = await authService.hashPassword(body.mat_khau);
        }
        if (!Object.keys(changes).length) throw new AppError('Khong co du lieu cap nhat hop le.', 400);
        return employeeModel.update(employeeId, changes);
    },
    async remove(idValue: unknown, currentUserId: number) {
        const employeeId = getEmployeeId(idValue);
        if (employeeId === currentUserId) throw new AppError('Khong the xoa tai khoan dang dang nhap.', 400);
        await employeeModel.remove(employeeId);
    },
};
