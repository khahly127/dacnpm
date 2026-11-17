'use client';

import { useTableSessionContext } from '@/context/TableSessionContext';

export function useTableSession() {
  const context = useTableSessionContext();

  return {
    tableName: context.tableName,
    tableNumber: context.tableNumber,
    guestName: context.guestName,
    setGuestName: context.setGuestName,
    setTable: context.setTable,
    startOrdering: context.startOrdering,
  };
}
