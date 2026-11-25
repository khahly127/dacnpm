'use client';

import React from 'react';
import { Camera, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

interface QrCameraScannerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isCameraActive: boolean;
  cameraError: string | null;
  onRetry: () => void;
  detectedSuccess?: boolean;
}

export function QrCameraScanner({
  videoRef,
  isCameraActive,
  cameraError,
  onRetry,
  detectedSuccess = false,
}: QrCameraScannerProps) {
  // Giải phóng thẻ video khi unmount để Windows tắt đèn LED dứt khoát
  React.useEffect(() => {
    return () => {
      const el = videoRef.current;
      if (el) {
        try {
          el.pause();
          el.srcObject = null;
        } catch {}
      }
    };
  }, [videoRef]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Khung ngắm Camera hình vuông chuẩn máy quét */}
      <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-[#1E1917] border-2 border-[#EAE3D6] shadow-md flex items-center justify-center">
        {/* Thẻ Video stream từ Webcam / Camera điện thoại */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover ${
            isCameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 1. Trạng thái nhận diện thành công */}
        {detectedSuccess && (
          <div className="absolute inset-0 bg-[#065F46]/90 flex flex-col items-center justify-center text-white p-4 text-center animate-fade-in z-20">
            <CheckCircle2 className="w-12 h-12 text-[#34D399] mb-2 animate-bounce" />
            <span className="text-sm font-bold">Đã nhận diện bàn ăn!</span>
            <span className="text-xs text-white/80 mt-0.5">Đang chuyển vào thực đơn...</span>
          </div>
        )}

        {/* 2. Trạng thái Camera đang hoạt động: Hiển thị 4 góc và tia laser quét */}
        {isCameraActive && !detectedSuccess && (
          <>
            {/* 4 Góc bo ngắm máy quét màu đỏ mận Casa Cozy */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-[3.5px] border-l-[3.5px] border-[#8E2813] rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-[3.5px] border-r-[3.5px] border-[#8E2813] rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-[3.5px] border-l-[3.5px] border-[#8E2813] rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-[3.5px] border-r-[3.5px] border-[#8E2813] rounded-br-lg pointer-events-none" />

            {/* Tia laser đỏ phát sáng lướt lên xuống */}
            <div className="absolute left-4 right-4 h-[2.5px] bg-gradient-to-r from-transparent via-[#EF4444] to-transparent shadow-[0_0_10px_#EF4444] animate-laser-scan pointer-events-none z-10" />

            {/* Tâm ngắm chấm nhỏ ở giữa */}
            <div className="w-1.5 h-1.5 rounded-full bg-white/40 pointer-events-none" />
          </>
        )}

        {/* 3. Trạng thái lỗi không mở được Camera */}
        {cameraError && (
          <div className="absolute inset-0 bg-[#2D2421] p-4 flex flex-col items-center justify-center text-center text-white z-20">
            <AlertCircle className="w-8 h-8 text-[#F87171] mb-2" />
            <p className="text-[11px] text-[#EDE5D8] leading-relaxed mb-3">
              {cameraError}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử lại camera</span>
            </button>
          </div>
        )}

        {/* 4. Trạng thái đang khởi động kết nối Camera */}
        {!isCameraActive && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 p-4 text-center">
            <Camera className="w-8 h-8 text-[#A89E92] animate-pulse mb-2" />
            <span className="text-xs font-medium text-[#D8CFBF]">Đang kết nối camera...</span>
          </div>
        )}
      </div>

      {/* Dòng hướng dẫn phụ bên dưới khung quét */}
      <p className="text-xs text-[#6E6357] font-medium text-center mt-3">
        {isCameraActive
          ? '🎯 Giơ mã QR bàn ăn vào giữa khung ngắm'
          : 'Đang mở webcam hoặc camera của thiết bị'}
      </p>
    </div>
  );
}
