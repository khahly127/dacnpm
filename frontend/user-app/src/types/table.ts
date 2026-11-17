export interface TableSession {
  tableId: string;
  tableName: string;
  tableNumber: string;
  guestName: string;
  isValid: boolean;
}

export interface TableDetail {
  ma_ban: number;
  ten_ban: string;
  trang_thai: string;
  maqr?: {
    id_qr?: number;
    duong_dan_qr?: string;
    trang_thai_hoat_dong?: boolean;
  }[];
}

export interface CallStaffRequest {
  tableId: string | number;
  tableName: string;
  guestName?: string;
  note?: string;
}

export interface CallStaffResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}
