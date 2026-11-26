import { qrModel } from '../models/qrModel';
import { tableModel } from '../models/tableModel';
import { AppError } from '../utils/appError';
import { generateTableQRCode, getTableQRCodeTargetUrl } from '../utils/qrGenerator';
import { generateVietQrImage } from '../utils/vietQrGenerator';

export const qrService = {
    async generateAndSave(tableId: number) {
        if (!Number.isInteger(tableId) || tableId <= 0) {
            throw new AppError('Ma ban phai la mot so nguyen duong.', 400);
        }
        if (!(await tableModel.findById(tableId))) {
            throw new AppError('Khong tim thay ban.', 404);
        }

        const targetUrl = getTableQRCodeTargetUrl(tableId);
        const qrImage = await generateTableQRCode(tableId);
        const record = await qrModel.saveQRCodeToDB(tableId, qrImage);

        return { tableId, targetUrl, qrImage, record };
    },
    async generatePaymentQr(tableId: number) {
        if (!Number.isInteger(tableId) || tableId <= 0) {
            throw new AppError('Ma ban phai la mot so nguyen duong.', 400);
        }

        const bankBin = process.env.VIETQR_BANK_BIN;
        const accountNumber = process.env.VIETQR_ACCOUNT_NUMBER;
        const configuredAccountName = process.env.VIETQR_ACCOUNT_NAME;
        if (!bankBin || !/^\d{6}$/.test(bankBin)) {
            throw new AppError('Cau hinh VIETQR_BANK_BIN chua hop le.', 500);
        }
        if (!accountNumber || !/^[A-Za-z0-9]{1,25}$/.test(accountNumber)) {
            throw new AppError('Cau hinh VIETQR_ACCOUNT_NUMBER chua hop le.', 500);
        }
        if (!configuredAccountName?.trim()) {
            throw new AppError('Chua cau hinh VIETQR_ACCOUNT_NAME.', 500);
        }

        const accountName = configuredAccountName.trim().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'D')
            .toUpperCase()
            .replace(/[^A-Z0-9 ]/g, ' ')
            .replace(/\s+/g, ' ');
        if (!accountName || Buffer.byteLength(accountName, 'utf8') > 25) {
            throw new AppError('Cau hinh VIETQR_ACCOUNT_NAME phai co toi da 25 ky tu.', 500);
        }

        const bill = await tableModel.getPaymentBill(tableId);
        const latestOrderId = Math.max(...bill.orderIds);
        const transferContent = `B${bill.tableId} DH${latestOrderId}`;
        const qrImage = await generateVietQrImage({
            bankBin,
            accountNumber,
            accountName,
            amount: bill.totalAmount,
            transferContent,
        });

        return {
            ...bill,
            bankBin,
            accountNumber,
            accountName,
            transferContent,
            qrImage,
        };
    },
};
