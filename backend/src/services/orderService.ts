import { menuModel } from '../models/menuModel';
import { orderModel } from '../models/orderModel';
import { tableModel } from '../models/tableModel';
import { OrderItemInput, OrderStatus } from '../types';
import { AppError } from '../utils/appError';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const parseId = (value: unknown, field: string) => { const result = Number(value); if (!Number.isInteger(result) || result <= 0) throw new AppError(`${field} khong hop le.`, 400); return result; };

export const orderService = {
    async createOrder(tableIdValue: unknown, items: unknown) {
        const tableId = parseId(tableIdValue, 'Ma ban');
        if (!Array.isArray(items) || items.length === 0) throw new AppError('Don hang phai co it nhat mot mon.', 400);
        const table = await tableModel.findById(tableId);
        if (!table) throw new AppError('Khong tim thay ban.', 404);
        const validatedItems = items.map((item: OrderItemInput) => {
            const dishId = parseId(item?.ma_mon, 'Ma mon');
            const quantity = parseId(item?.so_luong, 'So luong');
            if (item.ghi_chu !== undefined && typeof item.ghi_chu !== 'string') throw new AppError('Ghi chu khong hop le.', 400);
            return { dishId, quantity, note: item.ghi_chu?.trim() || null };
        });
        const dishes = await menuModel.getDishesByIds([...new Set(validatedItems.map(item => item.dishId))]);
        if (dishes.length !== new Set(validatedItems.map(item => item.dishId)).size) throw new AppError('Mot hoac nhieu mon an khong ton tai.', 400);
        const dishMap = new Map(dishes.map(dish => [dish.ma_mon, dish]));
        for (const item of validatedItems) {
            const dish = dishMap.get(item.dishId);
            if (!dish || normalize(dish.trang_thai) !== 'con mon') throw new AppError(`Mon ${dish?.ten_mon ?? item.dishId} da het.`, 400);
        }
        const total = validatedItems.reduce((sum, item) => sum + Number(dishMap.get(item.dishId)!.gia) * item.quantity, 0);
        const order = await orderModel.createOrder({ ma_ban: tableId, tong_tien: total, trang_thai: 'Cho xac nhan' });
        try {
            await orderModel.createDetails(validatedItems.map(item => ({ ma_don: order.ma_don, ma_mon: item.dishId, so_luong: item.quantity, don_gia: Number(dishMap.get(item.dishId)!.gia), ghi_chu: item.note })));
            await tableModel.update(tableId, { trang_thai: 'Dang phuc vu' });
            return await orderModel.getById(order.ma_don);
        } catch (error) {
            await orderModel.deleteOrder(order.ma_don).catch(() => undefined);
            throw error;
        }
    },
    async updateStatus(orderIdValue: unknown, status: unknown, employeeId: number) {
        const orderId = parseId(orderIdValue, 'Ma don');
        if (typeof status !== 'string' || !['Dang chuan bi', 'Dang phuc vu', 'Hoan tat', 'Da huy'].includes(status)) throw new AppError('Trang thai don hang khong hop le.', 400);
        const order = await orderModel.getById(orderId);
        if (!order) throw new AppError('Khong tim thay don hang.', 404);
        const updated = await orderModel.updateStatus(orderId, status as OrderStatus, employeeId);
        if (status === 'Hoan tat' || status === 'Da huy') {
            const activeOrders = await orderModel.listByTable(order.ma_ban);
            if (!activeOrders.some(item => item.ma_don !== orderId && !['Hoan tat', 'Da huy'].includes(item.trang_thai))) await tableModel.update(order.ma_ban, { trang_thai: 'Trong' });
        }
        return updated;
    },
    parseId,
};
