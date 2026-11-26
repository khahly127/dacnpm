'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Bell, CheckCircle2 } from 'lucide-react';
import { useQrScanner } from '@/hooks/useQrScanner';
import { tableService } from '@/services/tableService';
import { CheckInHeader } from './CheckInHeader';
import { QrCameraScanner } from './QrCameraScanner';
import { QrImageUploader } from './QrImageUploader';
import { ManualTableInput } from './ManualTableInput';

interface TableCheckInScreenProps {
  onTableConfirmed: (tableId: string) => void;
  onCallHelp?: () => void;
}

export function TableCheckInScreen({
  onTableConfirmed,
  onCallHelp,
}: TableCheckInScreenProps) {
  const [helpSent, setHelpSent] = useState<boolean>(false);

  const {
    activeTab,
    setActiveTab,
    videoRef,
    isCameraActive,
    cameraError,
    retryCamera,
    isProcessingImage,
    imageError,
    decodeImageFile,
    manualTableNumber,
    setManualTableNumber,
    manualError,
    submitManualTable,
    detectedSuccess,
  } = useQrScanner({
    onTableDetected: (tableId) => {
      // Delay nhẹ 400ms để người dùng kịp thấy hiệu ứng tick xanh thành công
      setTimeout(() => {
        onTableConfirmed(tableId);
      }, 400);
    },
  });

  const handleCallHelpClick = async () => {
    setHelpSent(true);
    try {
      if (onCallHelp) {
        onCallHelp();
      } else {
        await tableService.callStaff({
          tableId: '00',
          tableName: 'Cổng vào / Chờ xếp bàn',
          guestName: 'Khách cần hỗ trợ xếp bàn',
        });
      }
    } catch {
      // Bỏ qua lỗi kết nối máy chủ
    }
    setTimeout(() => {
      setHelpSent(false);
    }, 4000);
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen w-full bg-[#EAE3D9] flex justify-center items-stretch overflow-hidden">
      {/* Mobile Column - chuẩn kích thước ứng dụng gọi món Casa Cozy */}
      <main className="w-full max-w-[420px] h-full max-h-full bg-[#FAF7F2] border-x border-[#E2D9CC] shadow-sm flex flex-col justify-between px-5 py-6 sm:py-8 relative overflow-y-auto no-scrollbar">
        {/* Phần 1: Header thương hiệu Casa Cozy */}
        <div className="w-full flex flex-col items-center">
          <CheckInHeader />

          {/* Phần 2: Thanh chuyển đổi 2 Tab [ 📷 Camera ] và [ 🖼️ Tải ảnh QR ] */}
          <div className="w-full mt-4">
            <div className="flex items-center p-1 bg-[#EFE9DF] rounded-xl border border-[#E0D5C5] gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('CAMERA')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'CAMERA'
                    ? 'bg-white text-[#8E2813] shadow-xs'
                    : 'text-[#6E6357] hover:text-[#231F20]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera / Webcam</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('IMAGE')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'IMAGE'
                    ? 'bg-white text-[#8E2813] shadow-xs'
                    : 'text-[#6E6357] hover:text-[#231F20]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Tải ảnh mã QR</span>
              </button>
            </div>

            {/* Nội dung Tab đang chọn */}
            <div className="mt-3.5">
              {activeTab === 'CAMERA' ? (
                <QrCameraScanner
                  videoRef={videoRef}
                  isCameraActive={isCameraActive}
                  cameraError={cameraError}
                  onRetry={retryCamera}
                  detectedSuccess={detectedSuccess}
                />
              ) : (
                <QrImageUploader
                  onFileSelect={decodeImageFile}
                  isProcessing={isProcessingImage}
                  error={imageError}
                  detectedSuccess={detectedSuccess}
                />
              )}
            </div>

            {/* Phần 3: Ô nhập số bàn thủ công (Hướng 1: áp dụng cho 1 - 100 bàn) */}
            <ManualTableInput
              value={manualTableNumber}
              onChange={setManualTableNumber}
              onSubmit={submitManualTable}
              error={manualError}
            />
          </div>
        </div>

        {/* Phần 4: Chân trang hỗ trợ khách */}
        <div className="w-full pt-4 mt-2 border-t border-[#EAE3D6]/70 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={handleCallHelpClick}
            disabled={helpSent}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              helpSent
                ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                : 'bg-white border border-[#EAE3D6] text-[#5C5046] hover:bg-[#F5EFE6] shadow-2xs'
            }`}
          >
            {helpSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Đã gọi nhân viên hỗ trợ xếp bàn!</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5 text-[#8E2813]" />
                <span>Cần nhân viên hỗ trợ xếp bàn</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-[#A89E92] mt-2 font-medium">
            Mã QR và số bàn được in cố định trên mặt bàn ăn
          </p>
        </div>
      </main>
    </div>
  );
}
