import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.post('/', orderController.create);
router.get('/table/:tableId', orderController.listByTable);
router.get('/staff', verifyToken, checkRole('QuanLy', 'QuanTriVien'), orderController.listAll);
router.patch('/:id/status', verifyToken, checkRole('QuanLy', 'QuanTriVien'), orderController.updateStatus);
router.get('/:id', orderController.getById);
export default router;
