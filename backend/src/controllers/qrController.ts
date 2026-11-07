import { NextFunction, Request, Response } from 'express';
import { qrService } from '../services/qrService';

export const qrController = {
    async generateAndSaveQR(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tableId = Number(req.params.maBan);
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const result = await qrService.generateAndSave(tableId, baseUrl);

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
};
