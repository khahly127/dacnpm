import { io } from 'socket.io-client';

function getSocketUrl(): string {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function subscribeToTableOrderChanges(tableId: number, listener: () => void): () => void {
  const socket = io(getSocketUrl(), {
    autoConnect: false,
    auth: { tableId },
  });

  socket.on('connect', listener);
  socket.on('table:orders-changed', (event: { ma_ban?: number }) => {
    if (event.ma_ban === tableId) listener();
  });
  socket.on('connect_error', (error) => {
    console.error('Không thể kết nối theo dõi đơn hàng realtime:', error.message);
  });
  socket.connect();

  return () => socket.disconnect();
}
