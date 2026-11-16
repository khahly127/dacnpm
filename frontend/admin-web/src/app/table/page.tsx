'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { TableHeader } from '@/components/table/TableHeader';
import { TableStatCards } from '@/components/table/TableStatCards';
import { TableFilters } from '@/components/table/TableFilters';
import { TableGridView } from '@/components/table/TableGridView';
import { TableTableView } from '@/components/table/TableTableView';
import { TableQRGridView } from '@/components/table/TableQRGridView';
import { TableQRTableView } from '@/components/table/TableQRTableView';
import { TableQRModal } from '@/components/table/TableQRModal';
import { TableFormModal } from '@/components/table/TableFormModal';
import { TableDeleteModal } from '@/components/table/TableDeleteModal';
import { TablePrintAllModal } from '@/components/table/TablePrintAllModal';
import { Pagination } from '@/components/common/Pagination';
import { useTable } from '@/hooks/useTable';
import { authService } from '@/services/authService';
import { TableItem, CreateTableInput, UpdateTableInput } from '@/types/table';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth_state_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth_state_changed', callback);
  };
}

export default function TablePage() {
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
  }, [router, token]);

  const {
    tables,
    allTables,
    isLoading,
    stats,
    tabCounts,
    viewMode,
    setViewMode,
    displayLayout,
    setDisplayLayout,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    qrModalTable,
    setQrModalTable,
    editModalTable,
    setEditModalTable,
    deleteModalTable,
    setDeleteModalTable,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isPrintAllOpen,
    setIsPrintAllOpen,
    handleToggleQr,
    handleCreateTable,
    handleUpdateTable,
    handleDeleteTable,
    handleDownloadQrPng,
    handlePrintSingle,
    handleDownloadAllZip,
    handlePrintAllPdf,
  } = useTable();

  const onOpenEdit = (table: TableItem) => {
    setEditModalTable(table);
  };

  const onOpenDelete = (table: TableItem) => {
    setDeleteModalTable(table);
  };

  const onSubmitCreate = async (input: CreateTableInput) => {
    await handleCreateTable(input);
    setToastMessage({
      type: 'success',
      text: `Đã thêm bàn mới "${input.name}" thành công!`,
    });
  };

  const onSubmitUpdate = async (id: string, input: UpdateTableInput) => {
    await handleUpdateTable(id, input);
    setToastMessage({
      type: 'success',
      text: `Cập nhật thông tin bàn thành công!`,
    });
  };

  const onConfirmDelete = async (id: string) => {
    await handleDeleteTable(id);
    setToastMessage({
      type: 'success',
      text: `Đã xóa bàn ăn khỏi hệ thống!`,
    });
  };

  const onToggleQrWithToast = async (id: string) => {
    await handleToggleQr(id);
    setToastMessage({
      type: 'success',
      text: `Đã cập nhật trạng thái hoạt động của mã QR!`,
    });
  };

  if (!token) return null;

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden font-sans">
      {/* Sidebar điều hướng */}
      <Sidebar />

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <main className="p-6 md:p-8 space-y-6 max-w-7xl">
          {/* Thông báo Toast Feedback */}
          {toastMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
                toastMessage.type === 'success'
                  ? 'bg-[#F2FBF6] border-[#D1F2DF] text-[#10B981]'
                  : 'bg-[#FDF3F2] border-[#FCD9D7] text-[#C23924]'
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

          {/* Tiêu đề & Nút chuyển chế độ xem (Danh Sách Bàn / In & Quản Lý QR) */}
          <TableHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalTables={stats.total}
          />

          {/* 4 Thẻ chỉ số tổng quan */}
          <TableStatCards stats={stats} />

          {/* Bộ lọc tabs, ô tìm kiếm, nút chuyển Lưới/Bảng & các nút thao tác */}
          <TableFilters
            viewMode={viewMode}
            filterTab={filterTab}
            onFilterTabChange={setFilterTab}
            displayLayout={displayLayout}
            onDisplayLayoutChange={setDisplayLayout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            tabCounts={tabCounts}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onDownloadAllZip={handleDownloadAllZip}
            onPrintAllPdf={handlePrintAllPdf}
          />

          {/* Danh sách hiển thị theo View Mode & Display Layout (Lưới / Bảng) */}
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center text-sm font-semibold text-[#8B2323]">
              Đang tải danh sách bàn ăn và mã QR...
            </div>
          ) : viewMode === 'tables' ? (
            displayLayout === 'grid' ? (
              <TableGridView
                tables={tables}
                onViewQr={(table) => setQrModalTable(table)}
                onEdit={onOpenEdit}
                onDelete={onOpenDelete}
              />
            ) : (
              <TableTableView
                tables={tables}
                onViewQr={(table) => setQrModalTable(table)}
                onEdit={onOpenEdit}
                onDelete={onOpenDelete}
              />
            )
          ) : (
            displayLayout === 'grid' ? (
              <TableQRGridView
                tables={tables}
                onToggleQr={onToggleQrWithToast}
                onDownloadPng={handleDownloadQrPng}
                onPrintSingle={handlePrintSingle}
              />
            ) : (
              <TableQRTableView
                tables={tables}
                onToggleQr={onToggleQrWithToast}
                onDownloadPng={handleDownloadQrPng}
                onPrintSingle={handlePrintSingle}
              />
            )
          )}

          {/* Thanh phân trang ở cuối trang */}
          {!isLoading && (
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                itemName="bàn"
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>

      {/* Modal 1: Xem & In thẻ QR để bàn */}
      <TableQRModal
        table={qrModalTable}
        onClose={() => setQrModalTable(null)}
        onDownloadPng={handleDownloadQrPng}
      />

      {/* Modal 2: Thêm mới bàn ăn */}
      <TableFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitCreate={onSubmitCreate}
        onSubmitUpdate={onSubmitUpdate}
      />

      {/* Modal 3: Chỉnh sửa bàn ăn */}
      <TableFormModal
        isOpen={Boolean(editModalTable)}
        table={editModalTable}
        onClose={() => setEditModalTable(null)}
        onSubmitCreate={onSubmitCreate}
        onSubmitUpdate={onSubmitUpdate}
      />

      {/* Modal 4: Xác nhận xóa bàn ăn */}
      <TableDeleteModal
        table={deleteModalTable}
        onClose={() => setDeleteModalTable(null)}
        onConfirmDelete={onConfirmDelete}
      />

      {/* Modal 5: In tất cả mã QR (PDF preview) */}
      <TablePrintAllModal
        isOpen={isPrintAllOpen}
        tables={allTables}
        onClose={() => setIsPrintAllOpen(false)}
      />
    </div>
  );
}
