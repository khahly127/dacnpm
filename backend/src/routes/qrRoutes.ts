import { Router } from 'express';
import { qrController } from '../controllers/qrController';
import { checkRole, verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/payment/:maBan', qrController.generatePaymentQr);
router.get('/:maBan', verifyToken, checkRole('QuanTriVien'), qrController.generateAndSaveQR);

export default router;
