import { Router } from 'express';
import { authController } from '../controllers/authController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();
router.post('/login', authController.login);
router.post('/change-password', verifyToken, authController.changePassword);
router.put('/profile', verifyToken, authController.updateProfile);
export default router;
