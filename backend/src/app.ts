import express from 'express';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import qrRoutes from './routes/qrRoutes';
import tableRoutes from './routes/tableRoutes';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/qr', qrRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
