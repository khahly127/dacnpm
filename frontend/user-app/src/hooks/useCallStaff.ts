'use client';

import { useTableSessionContext } from '@/context/TableSessionContext';

export function useCallStaff() {
  const context = useTableSessionContext();

  return {
    isCallingStaff: context.isCallingStaff,
    callStaffStatus: context.callStaffStatus,
    callStaff: context.callStaff,
    closeFeedbackModal: context.closeFeedbackModal,
  };
}
