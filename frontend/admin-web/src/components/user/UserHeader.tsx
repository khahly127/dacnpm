'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';

interface UserHeaderProps {
  onAddUser?: () => void;
}

export function UserHeader({ onAddUser }: UserHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-[#26201E] tracking-tight">
          Quản Lý Tài Khoản Nhân Viên
        </h1>
        <p className="text-xs text-[#7C7267] mt-1 font-normal">
          Quản lý danh sách tài khoản hệ thống, phân quyền vai trò và kiểm soát ca trực điều phối của nhân sự.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddUser}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
      >
        <UserPlus className="w-4 h-4" />
        <span>Thêm Nhân Viên Mới</span>
      </button>
    </div>
  );
}