'use client';

import React from 'react';
import { Eye, Pencil, Trash2, ShieldCheck, Briefcase } from 'lucide-react';
import { UserItem } from '@/types/user';
import { Pagination } from '@/components/common/Pagination';

interface UserTableProps {
  users: UserItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string) => void;
  onViewUser: (user: UserItem) => void;
  onEditUser: (user: UserItem) => void;
  onDeleteUser: (user: UserItem) => void;
}

export function UserTable({
  users,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 8,
  onPageChange,
  onToggleStatus,
  onViewUser,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  // Lấy chữ cái viết tắt đại diện cho avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="py-3.5 px-5 whitespace-nowrap">MÃ NV</th>
              <th className="py-3.5 px-5 whitespace-nowrap">HỌ VÀ TÊN</th>
              <th className="py-3.5 px-5 whitespace-nowrap">TÀI KHOẢN ĐĂNG NHẬP</th>
              <th className="py-3.5 px-5 whitespace-nowrap">VAI TRÒ & PHÂN QUYỀN</th>
              <th className="py-3.5 px-5 whitespace-nowrap">TRẠNG THÁI</th>
              <th className="py-3.5 px-5 text-right whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#8A8175]">
                  Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isAdmin = user.role === 'ADMIN';
                const isActive = user.status === 'ACTIVE';

                return (
                  <tr key={user.id} className="hover:bg-[#FCFAF7] transition-colors">
                    {/* Cột 1: Mã NV */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8] whitespace-nowrap">
                        {user.code}
                      </span>
                    </td>

                    {/* Cột 2: Họ và tên + Avatar (Đã xóa email bên dưới) */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#342A27] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {getInitials(user.name)}
                        </div>
                        <div className="font-bold text-[#26201E] leading-snug">
                          {user.name}
                        </div>
                      </div>
                    </td>

                    {/* Cột 3: Tài khoản đăng nhập (Hiển thị đúng tài khoản từ CSDL Supabase, xóa số điện thoại ảo) */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-semibold text-[#26201E]">
                        {user.email || user.username}
                      </div>
                    </td>

                    {/* Cột 4: Vai trò & Phân quyền */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#8E2813] text-white shadow-2xs">
                          <ShieldCheck className="w-3 h-3 text-amber-300" />
                          <span>Quản trị viên</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-[#BFDBFE]">
                          <Briefcase className="w-3 h-3 text-[#1D4ED8]" />
                          <span>Quản lý</span>
                        </span>
                      )}
                    </td>

                    {/* Cột 5: Trạng thái (Switch toggle - Đã xóa text Cố định) */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(user.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isActive ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'
                          }`}
                          title="Bật/tắt trạng thái hoạt động của nhân viên"
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                              isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className={`text-[11px] font-bold ${isActive ? 'text-[#059669]' : 'text-[#6B7280]'}`}>
                          {isActive ? 'Hoạt động' : 'Tạm khóa'}
                        </span>
                      </div>
                    </td>

                    {/* Cột 6: Thao tác (Xem, Sửa, Xóa) */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 text-[#8A8175]">
                        <button
                          type="button"
                          title="Xem chi tiết"
                          onClick={() => onViewUser(user)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => onEditUser(user)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Xóa"
                          onClick={() => onDeleteUser(user)}
                          className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang đặt trọn vẹn ở dưới cùng bên trong bảng */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemName="nhân viên"
        onPageChange={onPageChange}
      />
    </div>
  );
}
