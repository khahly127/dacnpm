import { Router } from 'express';
import { menuController } from '../controllers/menuController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.get('/', menuController.getMenu);
router.get('/categories', verifyToken, checkRole('QuanTriVien'), menuController.listCategories);
router.post('/categories', verifyToken, checkRole('QuanTriVien'), menuController.createCategory);
router.patch('/categories/:id', verifyToken, checkRole('QuanTriVien'), menuController.updateCategory);
router.delete('/categories/:id', verifyToken, checkRole('QuanTriVien'), menuController.removeCategory);
router.get('/dishes', verifyToken, checkRole('QuanTriVien'), menuController.listDishes);
router.post('/dishes', verifyToken, checkRole('QuanTriVien'), menuController.createDish);
router.patch('/dishes/:id', verifyToken, checkRole('QuanTriVien'), menuController.updateDish);
router.delete('/dishes/:id', verifyToken, checkRole('QuanTriVien'), menuController.removeDish);
export default router;
