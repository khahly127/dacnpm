import QRCode from 'qrcode';

export async function generateTableQRCode(maBan: number, baseUrl: string): Promise<string> {
    try {
        const targetUrl = `${baseUrl}/menu?table=${maBan}`;

        return await QRCode.toDataURL(targetUrl, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
        });
    } catch (error) {
        throw new Error(`Khong the tao ma QR cho ban ${maBan}: ${String(error)}`);
    }
}
