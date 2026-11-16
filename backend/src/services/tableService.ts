import { tableModel } from '../models/tableModel';
import { AppError } from '../utils/appError';

function getTableId(value: unknown): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw new AppError('Ma ban khong hop le.', 400);
    return id;
}

export const tableService = {
    async getById(idValue: unknown) {
        const table = await tableModel.findById(getTableId(idValue));
        if (!table) throw new AppError('Khong tim thay ban.', 404);
        return table;
    },
    async list() { return tableModel.list(); },
    async create(body: Record<string, unknown>) {
        const { ten_ban, trang_thai = 'Trong' } = body;
        if (typeof ten_ban !== 'string' || !ten_ban.trim() || typeof trang_thai !== 'string') throw new AppError('Du lieu ban khong hop le.', 400);
        return tableModel.create({ ten_ban: ten_ban.trim(), trang_thai });
    },
    async update(idValue: unknown, body: Record<string, unknown>) {
        const changes: Record<string, unknown> = {};
        if (typeof body.ten_ban === 'string' && body.ten_ban.trim()) changes.ten_ban = body.ten_ban.trim();
        if (typeof body.trang_thai === 'string' && body.trang_thai.trim()) changes.trang_thai = body.trang_thai.trim();
        if (!Object.keys(changes).length) throw new AppError('Khong co du lieu cap nhat hop le.', 400);
        return tableModel.update(getTableId(idValue), changes);
    },
};
