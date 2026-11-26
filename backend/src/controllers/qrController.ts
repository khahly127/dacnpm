import { NextFunction, Request, Response } from 'express';
import { qrService } from '../services/qrService';

export const qrController = {
    async generateAndSaveQR(req: Request, res: Response, next: NextFunction) {
        try {
            const tableId = Number(req.params.maBan);
            const result = await qrService.generateAndSave(tableId);

            res.status(200).json({
                success: true,
                message: `Da tao va luu ma QR cho ban ${result.tableId}.`,
                table_id: result.tableId,
                target_url: result.targetUrl,
                qr_image: result.qrImage,
                data: result.record,
            });
        } catch (error) {
            next(error);
        }
    },
    async generatePaymentQr(req: Request, res: Response, next: NextFunction) {
        try {
            const tableId = Number(req.params.maBan);
            const data = await qrService.generatePaymentQr(tableId);
            res.status(200).json({ success: true, data });
        } catch (error) {
            next(error);
        }
    },
};
