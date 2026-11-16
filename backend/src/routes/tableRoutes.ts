import { Router } from 'express';
import { tableController } from '../controllers/tableController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.get('/:id', tableController.getTable);
router.get('/', tableController.list);
router.post('/', verifyToken, checkRole('QuanLy', 'QuanTriVien', 'ADMIN'), tableController.create);
router.patch('/:id', verifyToken, checkRole('QuanLy', 'QuanTriVien', 'ADMIN'), tableController.update);
router.delete('/:id', verifyToken, checkRole('QuanLy', 'QuanTriVien', 'ADMIN'), tableController.delete);
export default router;
