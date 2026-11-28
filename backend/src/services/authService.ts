import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { UserRole } from '../types';
import { employeeModel } from '../models/employeeModel';

interface TokenPayload {
    id: number;
    role: UserRole;
    username: string;
}

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError('May chu chua cau hinh JWT_SECRET.', 500);
    return secret;
}

export const authService = {
    async login(taiKhoan: unknown, matKhau: unknown) {
        if (typeof taiKhoan !== 'string' || typeof matKhau !== 'string') throw new AppError('Tai khoan va mat khau la bat buoc.', 400);
        const employee = await employeeModel.findByUsername(taiKhoan);
        const passwordIsValid = employee ? await this.verifyPassword(matKhau, employee.mat_khau) : false;
        if (!employee || !passwordIsValid) throw new AppError('Tai khoan hoac mat khau khong dung.', 401);
        const token = this.createToken({ id: employee.ma_nv, role: employee.vai_tro, username: employee.tai_khoan });
        return { token, user: { ma_nv: employee.ma_nv, ho_ten: employee.ho_ten, tai_khoan: employee.tai_khoan, vai_tro: employee.vai_tro } };
    },
    async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        // 1. Neu mat khau trong DB da ma hoa Bcrypt
        if (passwordHash && (passwordHash.startsWith('$2a$') || passwordHash.startsWith('$2b$') || passwordHash.startsWith('$2y$'))) {
            return bcrypt.compare(password, passwordHash);
        }
        // 2. Neu mat khau trong DB la chu thuong (nhu 12345678 hien tai tren Supabase)
        return password === passwordHash;
    },

    async hashPassword(password: string) {
        return bcrypt.hash(password, 12);
    },

    createToken(payload: TokenPayload): string {
        return jwt.sign(payload, getJwtSecret(), { expiresIn: '8h' });
    },

    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, getJwtSecret()) as TokenPayload;
        } catch {
            throw new AppError('Token khong hop le hoac da het han.', 401);
        }
    },

    async changePassword(userId: number, currentPass: string, newPass: string) {
        if (!currentPass || !newPass) {
            throw new AppError('Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.', 400);
        }
        if (newPass.length < 8) {
            throw new AppError('Mật khẩu mới phải có tối thiểu 8 ký tự.', 400);
        }

        const employee = await employeeModel.findById(userId);
        if (!employee) {
            throw new AppError('Không tìm thấy thông tin tài khoản nhân viên.', 404);
        }

        const passwordIsValid = await this.verifyPassword(currentPass, employee.mat_khau);
        if (!passwordIsValid) {
            throw new AppError('Mật khẩu hiện tại không chính xác.', 400);
        }

        const hashedPassword = await this.hashPassword(newPass);
        await employeeModel.update(userId, { mat_khau: hashedPassword });
        return { success: true, message: 'Đổi mật khẩu thành công.' };
    },

    async updateProfile(userId: number, input: { ho_ten: string }) {
        if (!input.ho_ten || !input.ho_ten.trim()) {
            throw new AppError('Họ và tên không được để trống.', 400);
        }
        const updated = await employeeModel.update(userId, { ho_ten: input.ho_ten.trim() });
        return {
            success: true,
            user: {
                ma_nv: updated.ma_nv,
                ho_ten: updated.ho_ten,
                tai_khoan: updated.tai_khoan,
                vai_tro: updated.vai_tro,
            },
        };
    },
};
