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
};
