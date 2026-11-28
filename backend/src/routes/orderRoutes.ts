import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.post('/', orderController.create);
router.get('/table/:tableId', orderController.listByTable);
router.get('/staff', orderController.listAll);
router.patch('/:id/status', orderController.updateStatus);
router.get('/:id', orderController.getById);
export default router;
