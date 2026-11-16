'use client';

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { UserItem } from '@/types/user';

interface UserDeleteModalProps {
  isOpen: boolean;
  user: UserItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export function UserDeleteModal({
  isOpen,
  user,
  onClose,
  onConfirm,
}: UserDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    if (user.isFixed) {
      setErrorMessage('Không thể xóa tài khoản Quản trị viên này.');
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage(null);
      const result = await onConfirm(user.id);
      if (!result.success) {
        setErrorMessage(result.message || 'Xóa nhân viên thất bại.');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi khi kết nối máy chủ để xóa nhân viên.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDF2F0] text-[#C23924] flex items-center justify-center shrink-0 border border-[#F8D7DA]">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26201E]">Xác nhận xóa tài khoản</h2>
              <p className="text-xs text-[#8A8175]">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung xác nhận */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-start gap-2 text-xs text-[#C23924]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-[#3C342F] leading-relaxed">
            Bạn có chắc chắn muốn xóa nhân sự sau đây khỏi cơ sở dữ liệu hệ thống Casa Cozy không?
          </p>

          {/* Hộp thông tin nhân viên sẽ bị xóa */}
          <div className="p-3.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#26201E]">{user.name}</span>
              <span className="px-2 py-0.5 bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] rounded-md border border-[#F6D8C8]">
                {user.code}
              </span>
            </div>
            <div className="text-[11px] text-[#7C7267]">{user.email}</div>
            <div className="text-[11px] text-[#8A8175]">
              Vai trò: {user.role === 'ADMIN' ? 'Quản trị viên' : 'Quản lý'}
            </div>
          </div>

          {user.isFixed ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Đây là <strong>tài khoản quản trị gốc</strong> (hoặc tài khoản bạn đang đăng nhập). Hệ thống bảo mật không cho phép xóa tài khoản này.
              </span>
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700">
              ⚠️ <strong>Lưu ý:</strong> Sau khi xác nhận, toàn bộ phiên đăng nhập của nhân viên này sẽ bị hủy bỏ và không thể phục hồi.
            </div>
          )}
        </div>

        {/* Footer Nút bấm */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5 bg-[#FAF7F2]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || user.isFixed}
            className="px-5 py-2 bg-[#C23924] hover:bg-[#a72e1c] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
