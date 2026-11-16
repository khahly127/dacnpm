'use client';

import React from 'react';
import { X, Pencil, ShieldCheck, Briefcase } from 'lucide-react';
import { UserItem } from '@/types/user';

interface UserDetailModalProps {
  isOpen: boolean;
  user: UserItem | null;
  onClose: () => void;
  onEdit?: (user: UserItem) => void;
}

export function UserDetailModal({
  isOpen,
  user,
  onClose,
  onEdit,
}: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  const isAdmin = user.role === 'ADMIN';
  const isActive = user.status === 'ACTIVE';

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Cấu hình bảng 2 cột: Trường dữ liệu & Giá trị
  const detailRows = [
    {
      field: 'Mã nhân viên',
      value: (
        <span className="inline-block px-2 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-xs border border-[#F6D8C8]">
          {user.code}
        </span>
      ),
    },
    {
      field: 'Họ và tên',
      value: <span className="font-bold text-[#26201E]">{user.name}</span>,
    },
    {
      field: 'Tài khoản đăng nhập',
      value: <span className="font-semibold text-[#26201E]">{user.email || user.username}</span>,
    },
    ...(user.phone
      ? [
          {
            field: 'Số điện thoại',
            value: <span className="text-[#3C342F]">{user.phone}</span>,
          },
        ]
      : []),
    {
      field: 'Vai trò & Phân quyền',
      value: isAdmin ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#8E2813] text-white shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
          <span>Quản trị viên (Toàn quyền hệ thống)</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-[#BFDBFE]">
          <Briefcase className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span>Quản lý (Bàn, đơn & ca trực)</span>
        </span>
      ),
    },
    {
      field: 'Trạng thái tài khoản',
      value: (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isActive
              ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
              : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'
            }`}
          />
          {isActive ? 'Đang hoạt động' : 'Tạm khóa'}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#342A27] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26201E]">{user.name}</h2>
              <p className="text-xs text-[#8A8175]">Chi tiết hồ sơ nhân sự hệ thống</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bảng 2 cột: Trường dữ liệu & Giá trị */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="border border-[#F0EAE1] rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-2/5">TRƯỜNG DỮ LIỆU</th>
                  <th className="py-2.5 px-4 w-3/5">GIÁ TRỊ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {detailRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#7C7267] bg-[#FCFAF7]/50">
                      {row.field}
                    </td>
                    <td className="py-3 px-4">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5 bg-[#FAF7F2]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Chỉnh sửa thông tin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
