import { Router } from 'express';
import { employeeController } from '../controllers/employeeController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.use(verifyToken, checkRole('QuanTriVien'));
router.get('/', employeeController.list);
router.post('/', employeeController.create);
router.patch('/:id', employeeController.update);
router.delete('/:id', employeeController.remove);
export default router;
