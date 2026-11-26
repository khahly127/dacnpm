import QRCode from 'qrcode';

function tlv(tag: string, value: string): string {
    return `${tag}${String(Buffer.byteLength(value, 'utf8')).padStart(2, '0')}${value}`;
}

export function calculateCrc16(input: string): string {
    let crc = 0xffff;
    for (const byte of Buffer.from(input, 'utf8')) {
        crc ^= byte << 8;
        for (let bit = 0; bit < 8; bit += 1) {
            crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
            crc &= 0xffff;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildVietQrPayload(input: {
    bankBin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    transferContent: string;
}): string {
    const beneficiary = tlv('00', input.bankBin) + tlv('01', input.accountNumber);
    const merchantAccount = tlv('00', 'A000000727')
        + tlv('01', beneficiary)
        + tlv('02', 'QRIBFTTA');
    const additionalData = tlv('08', input.transferContent);

    const payload = tlv('00', '01')
        + tlv('01', '12')
        + tlv('38', merchantAccount)
        + tlv('53', '704')
        + tlv('54', String(input.amount))
        + tlv('58', 'VN')
        + tlv('59', input.accountName)
        + tlv('62', additionalData)
        + '6304';

    return `${payload}${calculateCrc16(payload)}`;
}

export async function generateVietQrImage(input: {
    bankBin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    transferContent: string;
}): Promise<string> {
    const payload = buildVietQrPayload(input);
    return QRCode.toDataURL(payload, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 360,
    });
}
