export type CheckInTab = 'CAMERA' | 'IMAGE';

export interface CheckInResult {
  success: boolean;
  tableId?: string;
  tableName?: string;
  error?: string;
}

/**
 * Trích xuất mã số bàn từ chuỗi quét được (URL, nội dung SVG, tên file, hoặc văn bản)
 * Ví dụ hỗ trợ:
 * - http://localhost:3001/table/5 -> "5"
 * - https://casacozy.vn/b/01 -> "01"
 * - casacozy.vn/b/02 -> "02"
 * - QR_BAN-01.svg -> "01"
 * - QR_BAN-VIP-05.svg -> "05"
 * - Bàn 1.png, ban_02.jpg, TB03.png -> "1", "02", "03"
 * - Nội dung file SVG chứa "casacozy.vn/b/04" -> "04"
 */
export function extractTableIdFromQRText(rawText: string): string | null {
  if (!rawText) return null;
  const trimmed = rawText.trim();

  // 1. Nếu là URL hoặc đường dẫn có chứa /table/XX, /b/XX, ?table=XX, ?b=XX, _b_XX
  const urlMatch = trimmed.match(/(?:[\/_]table[\/_]|[\/_]b[\/_]|[?&]table=|[?&]b=)(\d+)/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1];
  }

  // 2. Nếu chuỗi có chứa tên bàn định dạng: BAN-01, BAN_01, BAN-VIP-05, Bàn 5, Table 12, TB01...
  const banPattern = /(?:bàn|ban|table|tb)[\s\-_]*(?:số|so|ăn|an|vip[\s\-_]*)?[\s\-_]*(\d+)/i;
  const banMatch = trimmed.match(banPattern);
  if (banMatch && banMatch[1]) {
    return banMatch[1];
  }

  // 3. Nếu tên file chứa định dạng QR: qr-1, qr_05, qr03...
  const qrPattern = /(?:^|[^a-z0-9])qr[\s\-_]*(\d+)/i;
  const qrMatch = trimmed.match(qrPattern);
  if (qrMatch && qrMatch[1]) {
    return qrMatch[1];
  }

  // 4. Nếu là chuỗi thuần số (vd: "5", "05", "42") từ 1 đến 200
  if (/^\d{1,3}$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    if (num > 0 && num <= 200) {
      return String(num);
    }
  }

  return null;
}
