'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { CategoryFilters } from '@/components/category/CategoryFilters';
import { CategoryTable } from '@/components/category/CategoryTable';
import { CategoryFormModal } from '@/components/category/CategoryFormModal';
import { CategoryDetailModal } from '@/components/category/CategoryDetailModal';
import { CategoryDeleteModal } from '@/components/category/CategoryDeleteModal';
import { useCategory } from '@/hooks/useCategory';
import { authService } from '@/services/authService';
import { CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth_state_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth_state_changed', callback);
  };
}

export default function CategoryPage() {
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
    categoryList,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    error,
    filters,
    setFilters,
    toggleStatus,
    refreshCategories,

    // Modal Form (Thêm/Sửa)
    isFormOpen,
    formMode,
    editingCategory,
    openCreateModal,
    openEditModal,
    closeFormModal,
    submitForm,

    // Modal Xem chi tiết
    viewingCategory,
    openViewModal,
    closeViewModal,

    // Modal Xóa
    deletingCategory,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useCategory();

  const handleFormSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    const res = await submitForm(data);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text:
          formMode === 'create'
            ? 'Thêm danh mục món ăn mới thành công!'
            : 'Cập nhật danh mục thành công!',
      });
    }
    return res;
  };

  const handleDeleteConfirm = async (id: string) => {
    const res = await confirmDelete(id);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text: 'Đã xóa danh mục khỏi hệ thống thành công!',
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

          {/* Tiêu đề & Nút thêm danh mục */}
          <CategoryHeader onAddCategory={openCreateModal} />

          {/* Thanh tìm kiếm & Bộ lọc */}
          <CategoryFilters
            filters={filters}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters }))
            }
            onRefresh={refreshCategories}
          />

          {/* Bảng danh sách danh mục */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center text-sm font-semibold text-[#8E2813]">
              Đang tải danh mục thực đơn Casa Cozy từ CSDL...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl border border-red-200 p-10 text-center shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-50 text-[#C23924] flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#26201E] mb-1">
                Không thể kết nối đến máy chủ Backend
              </h3>
              <p className="text-xs text-[#8A8175] max-w-md mx-auto mb-4 leading-relaxed">
                {error} Vui lòng kiểm tra lại dịch vụ Backend đang chạy trên cổng 5000.
              </p>
              <button
                type="button"
                onClick={refreshCategories}
                className="px-4 py-2 bg-[#8E2813] hover:bg-[#77210e] text-white text-xs font-bold rounded-xl shadow active:scale-95 transition"
              >
                Thử kết nối lại
              </button>
            </div>
          ) : (
            <CategoryTable
              categories={categoryList}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onToggleStatus={toggleStatus}
              onViewCategory={openViewModal}
              onEditCategory={openEditModal}
              onDeleteCategory={openDeleteModal}
            />
          )}
        </main>
      </div>

      {/* Modal 1: Thêm / Sửa Danh Mục */}
      <CategoryFormModal
        isOpen={isFormOpen}
        mode={formMode}
        initialData={editingCategory}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
      />

      {/* Modal 2: Xem Chi Tiết Danh Mục (Bảng 2 cột: Trường dữ liệu & Giá trị) */}
      <CategoryDetailModal
        isOpen={Boolean(viewingCategory)}
        category={viewingCategory}
        onClose={closeViewModal}
        onEdit={(category) => {
          closeViewModal();
          openEditModal(category);
        }}
      />

      {/* Modal 3: Xác Nhận Xóa Danh Mục */}
      <CategoryDeleteModal
        isOpen={Boolean(deletingCategory)}
        category={deletingCategory}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
