import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { UserRole } from '../types';

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
    async verifyPassword(password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    },

    async hashPassword(password: string): Promise<string> {
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
