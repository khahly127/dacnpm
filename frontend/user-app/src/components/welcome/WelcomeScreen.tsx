'use client';

import React from 'react';
import { useTableSession } from '@/hooks/useTableSession';
import { useCallStaff } from '@/hooks/useCallStaff';
import { BrandHeader } from './BrandHeader';
import { TableCard } from './TableCard';
import { GuestNameInput } from './GuestNameInput';
import { ActionButtons } from './ActionButtons';
import { CallStaffModal } from './CallStaffModal';

export function WelcomeScreen() {
  const { tableName, guestName, setGuestName, startOrdering } = useTableSession();
  const { isCallingStaff, callStaffStatus, callStaff, closeFeedbackModal } = useCallStaff();

  return (
    <div className="min-h-screen w-full bg-[#EAE3D9] flex justify-center items-stretch">
      {/* Mobile Column - kéo sát từ mép trên cùng xuống mép dưới cùng màn hình */}
      <main className="w-full max-w-[420px] min-h-screen bg-[#FAF7F2] border-x border-[#E2D9CC] shadow-sm flex flex-col justify-center px-6 py-8 sm:py-12 relative">
        <div className="w-full flex flex-col items-center">
          {/* Brand & Slogan */}
          <BrandHeader
            title="Casa Cozy"
            slogan="Bếp ấm & Bàn ăn • Trải nghiệm ẩm thực trọn vẹn"
          />

          {/* Form and Controls */}
          <div className="w-full mt-8 flex flex-col gap-3.5">
            {/* Table Indicator Card */}
            <TableCard tableName={tableName} />

            {/* Guest Name Input */}
            <GuestNameInput
              value={guestName}
              onChange={setGuestName}
              placeholder="Tên của bạn (không bắt buộc)"
            />

            {/* Action Buttons */}
            <div className="mt-3">
              <ActionButtons
                onStartOrdering={startOrdering}
                onCallStaff={callStaff}
                isCallingStaff={isCallingStaff}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Staff Call Feedback Modal */}
      <CallStaffModal
        isOpen={callStaffStatus.open}
        onClose={closeFeedbackModal}
        tableName={tableName}
        message={callStaffStatus.message}
        success={callStaffStatus.success}
      />
    </div>
  );
}
