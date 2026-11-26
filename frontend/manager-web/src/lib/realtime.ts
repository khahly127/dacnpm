import { io, Socket } from 'socket.io-client';

export interface NewOrderNotification {
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

type OrderListener = (order: NewOrderNotification) => void;

const listeners = new Set<OrderListener>();
let socket: Socket | null = null;
let socketToken: string | null = null;

function getSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function subscribeToNewOrders(token: string, listener: OrderListener): () => void {
  listeners.add(listener);

  if (!socket || socketToken !== token) {
    socket?.disconnect();
    socket = io(getSocketUrl(), {
      autoConnect: false,
      auth: { token },
    });
    socketToken = token;
    socket.on('order:created', (order: NewOrderNotification) => {
      listeners.forEach((currentListener) => currentListener(order));
    });
    socket.on('connect_error', (error) => {
      console.error('Không thể kết nối kênh đơn hàng realtime:', error.message);
    });
    socket.connect();
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      socket?.disconnect();
      socket = null;
      socketToken = null;
    }
  };
}
