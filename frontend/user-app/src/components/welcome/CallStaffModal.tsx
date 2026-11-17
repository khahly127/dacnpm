'use client';

import React, { useEffect } from 'react';
import { BellRing, CheckCircle2, X } from 'lucide-react';

interface CallStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  message?: string;
  success?: boolean;
}

export function CallStaffModal({
  isOpen,
  onClose,
  tableName,
  message,
  success = true,
}: CallStaffModalProps) {
  // Auto-close after 5 seconds
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#EFE9DF] text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-2xl bg-[#F5EFE6] flex items-center justify-center text-[#8B2323] mb-4 shadow-inner">
          {success ? (
            <BellRing className="w-8 h-8 animate-bounce text-[#8B2323]" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-[#8B2323]" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#231F20]">
          Đã gọi nhân viên!
        </h3>

        {/* Message */}
        <p className="mt-2 text-sm text-[#5C5248] leading-relaxed">
          {message ||
            `Nhân viên phục vụ của Casa Cozy đã nhận được thông báo và sẽ đến ${tableName} ngay lập tức.`}
        </p>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-[#8B2323] hover:bg-[#781E1E] text-white font-medium text-sm py-3 px-5 rounded-xl transition-all cursor-pointer shadow-md"
        >
          Đã hiểu
        </button>
      </div>
    </div>
  );
}
