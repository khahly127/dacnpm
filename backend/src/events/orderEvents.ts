import { EventEmitter } from 'node:events';

export interface OrderCreatedEvent {
    ma_don: number;
    ma_ban: number;
    ten_ban: string;
    tong_tien: number;
    thoi_gian_tao: string;
    trang_thai: string;
    items: Array<{
        ten_mon: string;
        so_luong: number;
        don_gia: number;
        ghi_chu: string | null;
    }>;
}

export interface OrderStatusUpdatedEvent {
    ma_don: number;
    ma_ban: number;
    trang_thai: string;
}

const emitter = new EventEmitter();

export function emitOrderCreated(event: OrderCreatedEvent): void {
    emitter.emit('order:created', event);
}

export function subscribeToOrderCreated(listener: (event: OrderCreatedEvent) => void): () => void {
    emitter.on('order:created', listener);
    return () => emitter.off('order:created', listener);
}

export function emitOrderStatusUpdated(event: OrderStatusUpdatedEvent): void {
    emitter.emit('order:status-updated', event);
}

export function subscribeToOrderStatusUpdated(listener: (event: OrderStatusUpdatedEvent) => void): () => void {
    emitter.on('order:status-updated', listener);
    return () => emitter.off('order:status-updated', listener);
}
