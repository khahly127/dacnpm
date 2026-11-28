'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CategoryItem,
  CategoryFiltersState,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/category';
import { categoryService } from '@/services/categoryService';

export function useCategory() {
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  // Bộ lọc
  const [filters, setFilters] = useState<CategoryFiltersState>({
    searchQuery: '',
    statusFilter: 'ALL',
    sortBy: 'MENU_ORDER',
  });

  // Quản lý Modal Thêm / Sửa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Quản lý Modal Xem chi tiết
  const [viewingCategory, setViewingCategory] = useState<CategoryItem | null>(null);

  // Quản lý Modal Xác nhận Xóa
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách danh mục từ Backend
  const loadCategories = useCallback(() => {
    setLoading(true);
    setError(null);
    categoryService
      .getCategoryList()
      .then((data) => {
        setCategoryList(data);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ Backend.';
        setError(msg);
        setCategoryList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    setError(null);
    categoryService
      .getCategoryList()
      .then((data) => {
        if (!ignore) {
          setCategoryList(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ Backend.';
          setError(msg);
          setCategoryList([]);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Bộ lọc dữ liệu theo tìm kiếm, trạng thái QR
  const filteredCategories = useMemo(() => {
    return categoryList.filter((item) => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      const matchStatus =
        filters.statusFilter === 'ALL' || item.status === filters.statusFilter;

      return matchSearch && matchStatus;
    });
  }, [categoryList, filters]);

  // Sắp xếp dữ liệu
  const sortedCategories = useMemo(() => {
    const list = [...filteredCategories];
    if (filters.sortBy === 'DISH_COUNT') {
      list.sort((a, b) => b.dishCount - a.dishCount);
    } else if (filters.sortBy === 'NAME_ASC') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // MENU_ORDER
      list.sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return list;
  }, [filteredCategories, filters.sortBy]);

  // Phân trang (6 danh mục / trang)
  const totalItems = sortedCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCategories = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedCategories.slice(start, start + pageSize);
  }, [sortedCategories, safeCurrentPage, pageSize]);

  const updateFilters = useCallback(
    (action: Partial<CategoryFiltersState> | ((prev: CategoryFiltersState) => CategoryFiltersState)) => {
      setFilters((prev) => {
        const next = typeof action === 'function' ? action(prev) : { ...prev, ...action };
        return next;
      });
      setCurrentPage(1);
    },
    []
  );

  // Bật / Tắt trạng thái hiển thị trên Menu QR
  const toggleStatus = useCallback((id: string) => {
    setCategoryList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  }, []);

  // 1. Mở Modal Thêm mới
  const openCreateModal = useCallback(() => {
    setFormMode('create');
    setEditingCategory(null);
    setIsFormOpen(true);
  }, []);

  // 2. Mở Modal Sửa
  const openEditModal = useCallback((category: CategoryItem) => {
    setFormMode('edit');
    setEditingCategory(category);
    setIsFormOpen(true);
  }, []);

  // Đóng Modal Form
  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    setEditingCategory(null);
  }, []);

  // 3. Mở / Đóng Modal Xem chi tiết
  const openViewModal = useCallback((category: CategoryItem) => {
    setViewingCategory(category);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingCategory(null);
  }, []);

  // 4. Mở / Đóng Modal Xóa
  const openDeleteModal = useCallback((category: CategoryItem) => {
    setDeletingCategory(category);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingCategory(null);
  }, []);

  // Gửi Form Thêm / Sửa
  const submitForm = useCallback(
    async (
      data: CreateCategoryInput | UpdateCategoryInput
    ): Promise<{ success: boolean; message?: string }> => {
      if (formMode === 'create') {
        const result = await categoryService.createCategory(data as CreateCategoryInput);
        if (result.success && result.data) {
          setCategoryList((prev) => [...prev, result.data!]);
          return { success: true };
        }
        return { success: false, message: result.message || 'Thêm danh mục thất bại.' };
      } else if (formMode === 'edit' && editingCategory) {
        const result = await categoryService.updateCategory(
          editingCategory.id,
          data as UpdateCategoryInput
        );
        if (result.success && result.data) {
          setCategoryList((prev) =>
            prev.map((item) =>
              item.id === editingCategory.id ? { ...item, ...result.data! } : item
            )
          );
          return { success: true };
        }
        return { success: false, message: result.message || 'Cập nhật danh mục thất bại.' };
      }
      return { success: false, message: 'Dữ liệu không hợp lệ.' };
    },
    [formMode, editingCategory]
  );

  // Xác nhận Xóa danh mục
  const confirmDelete = useCallback(
    async (id: string): Promise<{ success: boolean; message?: string }> => {
      const result = await categoryService.deleteCategory(id);
      if (result.success) {
        setCategoryList((prev) => prev.filter((item) => item.id !== id));
        return { success: true };
      }
      return { success: false, message: result.message || 'Xóa danh mục thất bại.' };
    },
    []
  );

  return {
    categoryList: paginatedCategories,
    totalItems,
    totalPages,
    currentPage: safeCurrentPage,
    setCurrentPage,
    loading,
    error,
    filters,
    setFilters: updateFilters,
    toggleStatus,
    refreshCategories: loadCategories,

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
  };
}
