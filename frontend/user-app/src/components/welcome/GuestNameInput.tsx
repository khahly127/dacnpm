import React from 'react';
import { User } from 'lucide-react';

interface GuestNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function GuestNameInput({
  value,
  onChange,
  placeholder = 'Tên của bạn (không bắt buộc)',
}: GuestNameInputProps) {
  return (
    <div className="relative w-full flex items-center bg-white rounded-2xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] px-4 py-3.5 focus-within:border-[#8B2323] focus-within:ring-2 focus-within:ring-[#8B2323]/10 transition-all">
      <User className="w-5 h-5 text-[#A69C8E] mr-3 flex-shrink-0" strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={50}
        className="w-full bg-transparent border-none outline-none text-[#231F20] text-sm sm:text-base placeholder:text-[#A69C8E] font-normal"
      />
    </div>
  );
}
