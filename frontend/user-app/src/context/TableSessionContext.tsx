'use client';

import React, { createContext, useContext, useState, useEffect, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tableService } from '@/services/tableService';

interface TableSessionContextType {
  tableName: string;
  tableNumber: string;
  guestName: string;
  setGuestName: (name: string) => void;
  setTable: (tableIdOrName: string) => void;
  isCallingStaff: boolean;
  callStaffStatus: { open: boolean; message: string; success: boolean };
  callStaff: () => Promise<void>;
  closeFeedbackModal: () => void;
  startOrdering: () => void;
}

const TableSessionContext = createContext<TableSessionContextType | null>(null);

const STORAGE_KEYS = {
  TABLE_NAME: 'casacozy_table_name',
  TABLE_ID: 'casacozy_table_id',
  GUEST_NAME: 'casacozy_guest_name',
};

export function TableSessionProvider({
  children,
  initialTable = '05',
}: {
  children: React.ReactNode;
  initialTable?: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Khởi tạo giá trị đồng nhất giữa Server và Client để tránh lỗi Hydration Mismatch
  const [tableName, setTableName] = useState<string>(() =>
    tableService.formatTableDisplay(initialTable)
  );

  const [tableNumber, setTableNumber] = useState<string>(initialTable);

  const [guestName, setGuestName] = useState<string>('');

  // Đồng bộ dữ liệu từ localStorage sau khi client mount
  useEffect(() => {
    try {
      const storedName = localStorage.getItem(STORAGE_KEYS.TABLE_NAME);
      const storedId = localStorage.getItem(STORAGE_KEYS.TABLE_ID);
      const storedGuest = localStorage.getItem(STORAGE_KEYS.GUEST_NAME);
      if (storedName) setTableName(storedName);
      if (storedId) setTableNumber(storedId);
      if (storedGuest) setGuestName(storedGuest);
    } catch {}
  }, []);

  const [isCallingStaff, setIsCallingStaff] = useState<boolean>(false);
  const [callStaffStatus, setCallStaffStatus] = useState<{
    open: boolean;
    message: string;
    success: boolean;
  }>({
    open: false,
    message: '',
    success: true,
  });

  const setTable = useCallback((tableIdOrName: string) => {
    const formatted = tableService.formatTableDisplay(tableIdOrName);
    setTableName(formatted);
    setTableNumber(tableIdOrName);
    try {
      localStorage.setItem(STORAGE_KEYS.TABLE_NAME, formatted);
      localStorage.setItem(STORAGE_KEYS.TABLE_ID, tableIdOrName);
    } catch {}
  }, []);

  const handleSetGuestName = useCallback((name: string) => {
    setGuestName(name);
    try {
      localStorage.setItem(STORAGE_KEYS.GUEST_NAME, name);
    } catch {}
  }, []);

  const callStaff = async () => {
    if (isCallingStaff) return;
    setIsCallingStaff(true);
    try {
      const res = await tableService.callStaff({
        tableId: tableNumber,
        tableName,
        guestName: guestName.trim() || undefined,
      });

      setCallStaffStatus({
        open: true,
        message: res.message,
        success: res.success,
      });
    } catch {
      setCallStaffStatus({
        open: true,
        message: 'Đã gửi yêu cầu đến nhân viên phục vụ!',
        success: true,
      });
    } finally {
      setIsCallingStaff(false);
    }
  };

  const closeFeedbackModal = () => {
    setCallStaffStatus((prev) => ({ ...prev, open: false }));
  };

  const startOrdering = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.TABLE_NAME, tableName);
      localStorage.setItem(STORAGE_KEYS.TABLE_ID, tableNumber);
      if (guestName.trim()) {
        localStorage.setItem(STORAGE_KEYS.GUEST_NAME, guestName.trim());
      }
    } catch {}

    startTransition(() => {
      router.push(`/menu?table=${encodeURIComponent(tableNumber)}`);
    });
  };

  return (
    <TableSessionContext.Provider
      value={{
        tableName,
        tableNumber,
        guestName,
        setGuestName: handleSetGuestName,
        setTable,
        isCallingStaff,
        callStaffStatus,
        callStaff,
        closeFeedbackModal,
        startOrdering,
      }}
    >
      {children}
    </TableSessionContext.Provider>
  );
}

export function useTableSessionContext() {
  const context = useContext(TableSessionContext);
  if (!context) {
    throw new Error('useTableSessionContext must be used within TableSessionProvider');
  }
  return context;
}
