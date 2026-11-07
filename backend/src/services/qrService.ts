import { qrModel } from '../models/qrModel';
import { tableModel } from '../models/tableModel';
import { AppError } from '../utils/appError';
import { generateTableQRCode } from '../utils/qrGenerator';

export const qrService = {
    async generateAndSave(tableId: number, baseUrl: string) {
        if (!Number.isInteger(tableId) || tableId <= 0) {
            throw new AppError('Ma ban phai la mot so nguyen duong.', 400);
        }
        if (!(await tableModel.findById(tableId))) {
            throw new AppError('Khong tim thay ban.', 404);
        }

        const targetUrl = `${baseUrl}/menu?table=${tableId}`;
        const qrImage = await generateTableQRCode(tableId, baseUrl);
        const record = await qrModel.saveQRCodeToDB(tableId, qrImage);

        return { tableId, targetUrl, qrImage, record };
    },
};
