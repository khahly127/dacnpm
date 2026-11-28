'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { UserHeader } from '@/components/user/UserHeader';
import { UserFilters } from '@/components/user/UserFilters';
import { UserTable } from '@/components/user/UserTable';
import { UserFormModal } from '@/components/user/UserFormModal';
import { UserDetailModal } from '@/components/user/UserDetailModal';
import { UserDeleteModal } from '@/components/user/UserDeleteModal';
import { useUser } from '@/hooks/useUser';
import { authService } from '@/services/authService';
import { CreateUserInput, UpdateUserInput } from '@/types/user';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth_state_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth_state_changed', callback);
  };
}

export default function UserPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Tự động tắt thông báo sau 3 giây
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Kiểm tra đăng nhập
  const token = useSyncExternalStore(
    subscribe,
    () => authService.getToken(),
    () => null
  );

  useEffect(() => {
    if (!authService.getToken()) {
      router.replace('/login');
    }
  }, [router]);

  const {
    userList,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    filters,
    setFilters,
    toggleStatus,

    // Modal Form (Thêm/Sửa)
    isFormOpen,
    formMode,
    editingUser,
    openCreateModal,
    openEditModal,
    closeFormModal,
    submitForm,

    // Modal Xem chi tiết
    viewingUser,
    openViewModal,
    closeViewModal,

    // Modal Xóa
    deletingUser,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useUser();

  const handleFormSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    const res = await submitForm(data);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text:
          formMode === 'create'
            ? 'Thêm nhân viên mới thành công!'
            : 'Cập nhật thông tin nhân viên thành công!',
      });
    }
    return res;
  };

  const handleDeleteConfirm = async (id: string) => {
    const res = await confirmDelete(id);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text: 'Đã xóa nhân viên khỏi hệ thống thành công!',
      });
    }
    return res;
  };

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF7F2] text-[#8E2813] font-semibold text-sm">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF7F2]">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Cột nội dung bên phải */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-5">
          {/* Toast thông báo nổi góc trên */}
          {toastMessage && (
            <div
              className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 ${
                toastMessage.type === 'success'
                  ? 'bg-white border-[#10B981] text-[#065F46]'
                  : 'bg-white border-[#C23924] text-[#C23924]'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#C23924] shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          )}

          {/* Tiêu đề & Nút thêm nhân viên */}
          <UserHeader onAddUser={openCreateModal} />

          {/* Thanh tìm kiếm & Bộ lọc */}
          <UserFilters
            filters={filters}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
          />

          {/* Bảng danh sách nhân viên */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center text-sm font-semibold text-[#8E2813]">
              Đang tải danh sách nhân sự Casa Cozy từ CSDL...
            </div>
          ) : (
            <UserTable
              users={userList}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onToggleStatus={toggleStatus}
              onViewUser={openViewModal}
              onEditUser={openEditModal}
              onDeleteUser={openDeleteModal}
            />
          )}
        </main>
      </div>

      {/* Modal 1: Thêm / Sửa Nhân Viên */}
      <UserFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialData={editingUser}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      {/* Modal 2: Xem Chi Tiết Nhân Viên (Bảng 2 cột: Trường dữ liệu & Giá trị) */}
      <UserDetailModal
        isOpen={Boolean(viewingUser)}
        user={viewingUser}
        onClose={closeViewModal}
        onEdit={(user) => {
          closeViewModal();
          openEditModal(user);
        }}
      />

      {/* Modal 3: Xác Nhận Xóa Nhân Viên */}
      <UserDeleteModal
        isOpen={Boolean(deletingUser)}
        user={deletingUser}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
