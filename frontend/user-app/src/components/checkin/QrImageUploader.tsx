'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QrImageUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
  detectedSuccess?: boolean;
}

export function QrImageUploader({
  onFileSelect,
  isProcessing,
  error,
  detectedSuccess = false,
}: QrImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Vùng kéo thả file hình vuông tương đồng với camera */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full max-w-[260px] aspect-square rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[#8E2813] bg-[#8E2813]/5 scale-102'
            : 'border-[#D8CFBF] bg-white hover:border-[#8E2813] hover:bg-[#FAF7F2]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.svg"
          onChange={handleInputChange}
          className="hidden"
        />

        {/* 1. Trạng thái thành công */}
        {detectedSuccess && (
          <div className="flex flex-col items-center text-[#065F46] animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-[#10B981] mb-2 animate-bounce" />
            <span className="text-xs font-bold">Nhận diện mã QR thành công!</span>
          </div>
        )}

        {/* 2. Trạng thái đang đọc ảnh */}
        {!detectedSuccess && isProcessing && (
          <div className="flex flex-col items-center text-[#8E2813]">
            <Loader2 className="w-9 h-9 animate-spin mb-2" />
            <span className="text-xs font-bold">Đang quét mã QR từ ảnh...</span>
            <span className="text-[10px] text-[#8A7E72] mt-0.5">Vui lòng đợi giây lát</span>
          </div>
        )}

        {/* 3. Trạng thái chờ người dùng chọn ảnh */}
        {!detectedSuccess && !isProcessing && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8E2813] mb-3 shadow-2xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#231F20]">
              Tải file ảnh mã QR
            </span>
            <p className="text-[10px] text-[#8A7E72] mt-1 leading-relaxed max-w-[190px]">
              Kéo thả hoặc bấm để chọn ảnh mã QR đã lưu từ máy (.png, .jpg, .svg)
            </p>
          </>
        )}
      </div>

      {/* Thông báo lỗi nếu ảnh không hợp lệ */}
      {error && (
        <div className="mt-3 p-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2 text-left w-full max-w-[280px]">
          <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
          <span className="text-[11px] text-[#991B1B] leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}
