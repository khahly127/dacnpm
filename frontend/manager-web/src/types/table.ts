export type TableStatus = 'occupied' | 'available' | 'reserved';

export type TableArea = 'Sảnh Chính Tầng 1' | 'Khu Ban Công' | 'Phòng VIP Lầu 2';

export type TableViewMode = 'tables' | 'qr';

export type TableDisplayLayout = 'grid' | 'table';

export type TableFilterTab = 'all' | 'occupied' | 'available' | 'reserved';

export interface TableItem {
  id: string;
  code: string;
  name: string;
  area: TableArea;
  seats: number;
  isVip?: boolean;
  status: TableStatus;
  qrEnabled: boolean;
  qrUrl: string;
  qrImage?: string;
  occupiedInfo?: {
    orderCode: string;
    dishCount: number;
    duration: string;
    guestCount?: number;
  };
  availableInfo?: {
    statusText: string;
    lastCleaned: string;
  };
  reservedInfo?: {
    reservedTime: string;
    guestName: string;
    note: string;
    guestCount: number;
  };
  vipInfo?: {
    bookedBy?: string;
    devicesConnected?: string;
  };
}

export interface TableStats {
  total: number;
  occupied: number;
  available: number;
  reserved: number;
  qrActive: number;
  capacityPercentage: number;
  areaCount: number;
}

export interface PaymentQrData {
  tableId: number;
  tableName: string;
  totalAmount: number;
  orderIds: number[];
  bankBin: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
  qrImage: string;
}

export interface CreateTableInput {
  name: string;
  area: TableArea;
  seats: number;
  isVip?: boolean;
  status?: TableStatus;
  note?: string;
}

export interface UpdateTableInput {
  name?: string;
  area?: TableArea;
  seats?: number;
  isVip?: boolean;
  status?: TableStatus;
  qrEnabled?: boolean;
  note?: string;
}
