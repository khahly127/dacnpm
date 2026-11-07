import { Router } from 'express';
import { tableController } from '../controllers/tableController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.get('/:id', tableController.getTable);
router.get('/', verifyToken, checkRole('QuanLy', 'QuanTriVien'), tableController.list);
router.post('/', verifyToken, checkRole('QuanTriVien'), tableController.create);
router.patch('/:id', verifyToken, checkRole('QuanLy', 'QuanTriVien'), tableController.update);
export default router;
