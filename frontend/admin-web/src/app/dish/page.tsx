'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DishHeader } from '@/components/dish/DishHeader';
import { DishStatCards } from '@/components/dish/DishStatCards';
import { DishFilters } from '@/components/dish/DishFilters';
import { DishTable } from '@/components/dish/DishTable';
import { DishFormModal } from '@/components/dish/DishFormModal';
import { DishDetailModal } from '@/components/dish/DishDetailModal';
import { DishDeleteModal } from '@/components/dish/DishDeleteModal';
import { useDish } from '@/hooks/useDish';
import { authService } from '@/services/authService';
import { CreateDishInput, UpdateDishInput } from '@/types/dish';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth_state_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth_state_changed', callback);
  };
}

export default function DishPage() {
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
    dishList,
    categories,
    stats,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    filters,
    setFilters,
    toggleStatus,
    refreshDishes,
    exportExcel,

    // Modal Form (Thêm/Sửa)
    isFormOpen,
    formMode,
    editingDish,
    openCreateModal,
    openEditModal,
    closeFormModal,
    submitForm,

    // Modal Xem chi tiết
    viewingDish,
    openViewModal,
    closeViewModal,

    // Modal Xóa
    deletingDish,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDish();

  const handleFormSubmit = async (data: CreateDishInput | UpdateDishInput) => {
    const res = await submitForm(data);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text:
          formMode === 'create'
            ? 'Thêm món ăn mới vào thực đơn thành công!'
            : 'Cập nhật món ăn thành công!',
      });
    }
    return res;
  };

  const handleDeleteConfirm = async (id: string) => {
    const res = await confirmDelete(id);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text: 'Đã xóa món ăn khỏi thực đơn thành công!',
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

          {/* Tiêu đề & Nút thao tác (Xuất Excel & Thêm món mới) */}
          <DishHeader
            onAddDish={openCreateModal}
            onExportExcel={exportExcel}
          />

          {/* 4 Thẻ thống kê thực đơn */}
          <DishStatCards stats={stats} />

          {/* Thanh tìm kiếm & Bộ lọc thực đơn */}
          <DishFilters
            filters={filters}
            categories={categories}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
            onRefresh={refreshDishes}
          />

          {/* Bảng danh sách món ăn */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center text-sm font-semibold text-[#8E2813]">
              Đang tải danh sách thực đơn món ăn từ CSDL...
            </div>
          ) : (
            <DishTable
              dishes={dishList}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={10}
              onPageChange={setCurrentPage}
              onToggleStatus={toggleStatus}
              onViewDish={openViewModal}
              onEditDish={openEditModal}
              onDeleteDish={openDeleteModal}
            />
          )}
        </main>
      </div>

      {/* Modal 1: Thêm / Sửa Món Ăn */}
      <DishFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialData={editingDish}
        categories={categories}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      {/* Modal 2: Xem Chi Tiết Món Ăn (Bảng 2 cột: Trường dữ liệu & Giá trị) */}
      <DishDetailModal
        isOpen={Boolean(viewingDish)}
        dish={viewingDish}
        onClose={closeViewModal}
        onEdit={(dish) => {
          closeViewModal();
          openEditModal(dish);
        }}
      />

      {/* Modal 3: Xác Nhận Xóa Món Ăn */}
      <DishDeleteModal
        isOpen={Boolean(deletingDish)}
        dish={deletingDish}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
