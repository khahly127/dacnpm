'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTableSession } from '@/hooks/useTableSession';
import { useCallStaff } from '@/hooks/useCallStaff';
import { BrandHeader } from './BrandHeader';
import { TableCard } from './TableCard';
import { GuestNameInput } from './GuestNameInput';
import { ActionButtons } from './ActionButtons';
import { CallStaffModal } from './CallStaffModal';

interface WelcomeScreenProps {
  onChangeTable?: () => void;
}

export function WelcomeScreen({ onChangeTable }: WelcomeScreenProps = {}) {
  const router = useRouter();
  const { tableName, guestName, setGuestName, startOrdering } = useTableSession();
  const { isCallingStaff, callStaffStatus, callStaff, closeFeedbackModal } = useCallStaff();

  const handleChangeTable = onChangeTable || (() => router.push('/?scan=true'));

  return (
    <div className="h-screen h-[100dvh] max-h-screen w-full bg-[#EAE3D9] flex justify-center items-stretch overflow-hidden">
      {/* Mobile Column - kéo sát từ mép trên cùng xuống mép dưới cùng màn hình, cố định chiều dài */}
      <main className="w-full max-w-[420px] h-full max-h-full bg-[#FAF7F2] border-x border-[#E2D9CC] shadow-sm flex flex-col justify-center px-6 py-8 sm:py-12 relative overflow-y-auto no-scrollbar">
        <div className="w-full flex flex-col items-center">
          {/* Brand & Slogan */}
          <BrandHeader
            title="Casa Cozy"
            slogan="Bếp ấm & Bàn ăn • Trải nghiệm ẩm thực trọn vẹn"
          />

          {/* Form and Controls */}
          <div className="w-full mt-8 flex flex-col gap-3.5">
            {/* Table Indicator Card */}
            <TableCard tableName={tableName} onChangeTable={handleChangeTable} />

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
