import { Router } from 'express';
import { menuController } from '../controllers/menuController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.get('/', menuController.getMenu);
router.get('/categories', verifyToken, checkRole('QuanTriVien', 'ADMIN', 'QuanLy'), menuController.listCategories);
router.post('/categories', verifyToken, checkRole('QuanTriVien', 'ADMIN'), menuController.createCategory);
router.patch('/categories/:id', verifyToken, checkRole('QuanTriVien', 'ADMIN'), menuController.updateCategory);
router.delete('/categories/:id', verifyToken, checkRole('QuanTriVien', 'ADMIN'), menuController.removeCategory);

router.get('/dishes', verifyToken, checkRole('QuanTriVien', 'ADMIN', 'QuanLy'), menuController.listDishes);
router.post('/dishes', verifyToken, checkRole('QuanTriVien', 'ADMIN'), menuController.createDish);
router.patch('/dishes/:id', verifyToken, checkRole('QuanTriVien', 'ADMIN'), menuController.updateDish);
router.delete('/dishes/:id', verifyToken, checkRole('QuanTriVien', 'ADMIN'), menuController.removeDish);

export default router;
