import QRCode from 'qrcode';

export function getTableQRCodeTargetUrl(maBan: number) {
    const paddedTableId = String(maBan).padStart(2, '0');
    return `https://casacozy.vn/b/${paddedTableId}`;
}

export async function generateTableQRCode(maBan: number) {
    try {
        return await QRCode.toDataURL(getTableQRCodeTargetUrl(maBan), {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
        });
    } catch (error) {
        throw new Error(`Khong the tao ma QR cho ban ${maBan}: ${String(error)}`);
    }
}
