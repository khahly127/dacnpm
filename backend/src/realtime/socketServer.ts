import { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { subscribeToOrderCreated, subscribeToOrderStatusUpdated } from '../events/orderEvents';

const staffRoles: UserRole[] = ['QuanLy', 'QuanTriVien', 'ADMIN'];

export function attachSocketServer(httpServer: HttpServer): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: true,
            methods: ['GET', 'POST'],
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (typeof token !== 'string') {
            const tableId = Number(socket.handshake.auth?.tableId);
            if (!Number.isSafeInteger(tableId) || tableId <= 0) {
                next(new Error('Ma ban khong hop le.'));
                return;
            }
            socket.data.tableId = tableId;
            next();
            return;
        }

        try {
            const user = authService.verifyToken(token);
            if (!staffRoles.includes(user.role)) {
                next(new Error('Tai khoan khong co quyen nhan thong bao don hang.'));
                return;
            }
            socket.data.user = user;
            next();
        } catch {
            next(new Error('Token khong hop le hoac da het han.'));
        }
    });

    io.on('connection', (socket) => {
        const tableId = socket.data.tableId;
        if (typeof tableId === 'number') {
            socket.join(`table:${tableId}`);
        } else if (socket.data.user) {
            socket.join('staff');
        }
    });

    subscribeToOrderCreated((order) => {
        io.to('staff').emit('order:created', order);
        io.to(`table:${order.ma_ban}`).emit('table:orders-changed', { ma_ban: order.ma_ban });
    });

    subscribeToOrderStatusUpdated((order) => {
        io.to('staff').emit('order:status-updated', order);
        io.to(`table:${order.ma_ban}`).emit('table:orders-changed', { ma_ban: order.ma_ban });
    });

    return io;
}
