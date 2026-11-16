'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DishItem,
  DishStatus,
  DishStats,
  DishFiltersState,
  CreateDishInput,
  UpdateDishInput,
} from '@/types/dish';
import { dishService } from '@/services/dishService';

export function useDish() {
  const [dishList, setDishList] = useState<DishItem[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Bộ lọc
  const [filters, setFilters] = useState<DishFiltersState>({
    searchQuery: '',
    categoryFilter: 'ALL',
    statusFilter: 'ALL',
    sortBy: 'NEWEST',
  });

  // Quản lý Modal Thêm / Sửa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);

  // Quản lý Modal Xem chi tiết
  const [viewingDish, setViewingDish] = useState<DishItem | null>(null);

  // Quản lý Modal Xóa
  const [deletingDish, setDeletingDish] = useState<DishItem | null>(null);

  // Tải danh sách món ăn & danh mục từ Backend
  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([dishService.getDishList(), dishService.getCategories()])
      .then(([dishes, cats]) => {
        setDishList(dishes);
        setCategories(cats);
      })
      .catch(() => {
        // Fallback an toàn
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.all([dishService.getDishList(), dishService.getCategories()])
      .then(([dishes, cats]) => {
        if (!ignore) {
          setDishList(dishes);
          setCategories(cats);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Tính toán 4 thẻ thống kê ở đầu màn hình
  const stats: DishStats = useMemo(() => {
    const total = dishList.length;
    const available = dishList.filter((d) => d.status === 'AVAILABLE').length;
    const outOfStock = dishList.filter((d) => d.status === 'OUT_OF_STOCK').length;
    const hidden = dishList.filter((d) => d.status === 'HIDDEN').length;
    const availableRate = total > 0 ? `${((available / total) * 100).toFixed(1)}%` : '0%';

    return {
      total,
      totalCategories: categories.length || 6,
      available,
      availableRate,
      outOfStock,
      hidden,
    };
  }, [dishList, categories]);

  // Bộ lọc dữ liệu theo tìm kiếm, danh mục, trạng thái
  const filteredDishes = useMemo(() => {
    return dishList.filter((item) => {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.categoryName.toLowerCase().includes(q);

      const matchCategory =
        filters.categoryFilter === 'ALL' || item.categoryId === Number(filters.categoryFilter);

      const matchStatus =
        filters.statusFilter === 'ALL' || item.status === filters.statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [dishList, filters]);

  // Sắp xếp dữ liệu
  const sortedDishes = useMemo(() => {
    const list = [...filteredDishes];
    if (filters.sortBy === 'PRICE_ASC') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'PRICE_DESC') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'NAME_ASC') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // NEWEST: Sắp xếp theo ID giảm dần
      list.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return list;
  }, [filteredDishes, filters.sortBy]);

  // Phân trang (10 món / trang)
  const totalItems = sortedDishes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  // Đảm bảo trang an toàn không bao giờ vượt quá totalPages (ví dụ khi tìm kiếm làm giảm tổng số trang)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedDishes = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedDishes.slice(start, start + pageSize);
  }, [sortedDishes, safeCurrentPage, pageSize]);

  // Tự động đưa về trang 1 khi thay đổi bất kỳ bộ lọc nào (tìm kiếm, danh mục, trạng thái, sắp xếp)
  const updateFilters = useCallback(
    (action: Partial<DishFiltersState> | ((prev: DishFiltersState) => DishFiltersState)) => {
      setFilters((prev) => {
        const next = typeof action === 'function' ? action(prev) : { ...prev, ...action };
        return next;
      });
      setCurrentPage(1);
    },
    []
  );

  // Bật / Tắt trạng thái phục vụ của món ăn (Toggle Switch)
  const toggleStatus = useCallback((id: string) => {
    setDishList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: DishStatus = item.status === 'AVAILABLE' ? 'HIDDEN' : 'AVAILABLE';
          const nextText = nextStatus === 'AVAILABLE' ? 'Đang phục vụ' : 'Đang ẩn';

          // Đồng bộ với backend
          dishService
            .updateDish(id, {
              name: item.name,
              subtitle: item.subtitle,
              categoryId: item.categoryId,
              price: item.price,
              image: item.image,
              status: nextStatus,
            })
            .catch(console.error);

          return { ...item, status: nextStatus, statusText: nextText };
        }
        return item;
      })
    );
  }, []);

  // 1. Mở Modal Thêm mới
  const openCreateModal = useCallback(() => {
    setFormMode('create');
    setEditingDish(null);
    setIsFormOpen(true);
  }, []);

  // 2. Mở Modal Sửa
  const openEditModal = useCallback((dish: DishItem) => {
    setFormMode('edit');
    setEditingDish(dish);
    setIsFormOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    setEditingDish(null);
  }, []);

  // 3. Mở / Đóng Modal Xem chi tiết
  const openViewModal = useCallback((dish: DishItem) => {
    setViewingDish(dish);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingDish(null);
  }, []);

  // 4. Mở / Đóng Modal Xóa
  const openDeleteModal = useCallback((dish: DishItem) => {
    setDeletingDish(dish);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingDish(null);
  }, []);

  // Gửi Form Thêm / Sửa
  const submitForm = useCallback(
    async (
      data: CreateDishInput | UpdateDishInput
    ): Promise<{ success: boolean; message?: string }> => {
      if (formMode === 'create') {
        const result = await dishService.createDish(data as CreateDishInput);
        if (result.success && result.data) {
          setDishList((prev) => [result.data!, ...prev]);
          return { success: true };
        }
        return { success: false, message: result.message || 'Thêm món ăn thất bại.' };
      } else if (formMode === 'edit' && editingDish) {
        const result = await dishService.updateDish(editingDish.id, data as UpdateDishInput);
        if (result.success && result.data) {
          setDishList((prev) =>
            prev.map((item) => (item.id === editingDish.id ? { ...item, ...result.data! } : item))
          );
          return { success: true };
        }
        return { success: false, message: result.message || 'Cập nhật món ăn thất bại.' };
      }
      return { success: false, message: 'Dữ liệu không hợp lệ.' };
    },
    [formMode, editingDish]
  );

  // Xác nhận Xóa món ăn
  const confirmDelete = useCallback(
    async (id: string): Promise<{ success: boolean; message?: string }> => {
      const result = await dishService.deleteDish(id);
      if (result.success) {
        setDishList((prev) => prev.filter((item) => item.id !== id));
        return { success: true };
      }
      return { success: false, message: result.message || 'Xóa món ăn thất bại.' };
    },
    []
  );

  // Xuất file Excel / CSV nhanh cho danh sách món ăn
  const exportExcel = useCallback(() => {
    if (dishList.length === 0) return;
    const header = 'Mã món,Tên món ăn,Mô tả,Danh mục,Giá niêm yết,Trạng thái\n';
    const rows = dishList
      .map(
        (d) =>
          `"${d.code}","${d.name}","${d.subtitle || ''}","${d.categoryName}",${d.price},"${d.statusText}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CasaCozy_ThucDon_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [dishList]);

  return {
    dishList: paginatedDishes,
    categories,
    stats,
    totalItems,
    totalPages,
    currentPage: safeCurrentPage,
    setCurrentPage,
    loading,
    filters,
    setFilters: updateFilters,
    toggleStatus,
    refreshDishes: loadData,
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
  };
}
