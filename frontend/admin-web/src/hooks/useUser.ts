'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserItem, UserFiltersState, CreateUserInput, UpdateUserInput } from '@/types/user';
import { userService } from '@/services/userService';

export function useUser() {
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Bộ lọc
  const [filters, setFilters] = useState<UserFiltersState>({
    searchQuery: '',
    roleFilter: 'ALL',
    statusFilter: 'ALL',
    sortBy: 'NEWEST',
  });

  // Quản lý Modal Thêm / Sửa
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  // Quản lý Modal Xem chi tiết
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null);

  // Quản lý Modal Xác nhận Xóa
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);

  // Tải danh sách nhân viên từ Backend
  const loadUsers = useCallback(() => {
    setLoading(true);
    userService
      .getUserList()
      .then((data) => {
        setUserList(data);
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
    userService
      .getUserList()
      .then((data) => {
        if (!ignore) {
          setUserList(data);
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

  // Bộ lọc dữ liệu theo tìm kiếm, vai trò, trạng thái
  const filteredUsers = useMemo(() => {
    return userList.filter((user) => {
      // 1. Tìm kiếm theo tên, mã NV, username, phone, email
      const q = filters.searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.code.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.phone.includes(q) ||
        user.email.toLowerCase().includes(q);

      // 2. Lọc vai trò
      const matchRole =
        filters.roleFilter === 'ALL' || user.role === filters.roleFilter;

      // 3. Lọc trạng thái
      const matchStatus =
        filters.statusFilter === 'ALL' || user.status === filters.statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [userList, filters]);

  // Sắp xếp dữ liệu
  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    if (filters.sortBy === 'NAME_ASC') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredUsers, filters.sortBy]);

  // Phân trang (8 người / trang)
  const totalItems = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, safeCurrentPage, pageSize]);

  const updateFilters = useCallback(
    (action: Partial<UserFiltersState> | ((prev: UserFiltersState) => UserFiltersState)) => {
      setFilters((prev: UserFiltersState) => {
        const next = typeof action === 'function' ? action(prev) : { ...prev, ...action };
        return next;
      });
      setCurrentPage(1);
    },
    []
  );

  // Bật / Tắt trạng thái hoạt động (Switch)
  const toggleStatus = useCallback((id: string) => {
    setUserList((prev) =>
      prev.map((item) => {
        if (item.id === id && !item.isFixed) {
          const nextStatus = item.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  }, []);

  // 1. Mở Modal Thêm mới
  const openCreateModal = useCallback(() => {
    setFormMode('create');
    setEditingUser(null);
    setIsFormOpen(true);
  }, []);

  // 2. Mở Modal Sửa
  const openEditModal = useCallback((user: UserItem) => {
    setFormMode('edit');
    setEditingUser(user);
    setIsFormOpen(true);
  }, []);

  // Đóng Modal Form
  const closeFormModal = useCallback(() => {
    setIsFormOpen(false);
    setEditingUser(null);
  }, []);

  // 3. Mở / Đóng Modal Xem chi tiết
  const openViewModal = useCallback((user: UserItem) => {
    setViewingUser(user);
  }, []);

  const closeViewModal = useCallback(() => {
    setViewingUser(null);
  }, []);

  // 4. Mở / Đóng Modal Xóa
  const openDeleteModal = useCallback((user: UserItem) => {
    setDeletingUser(user);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingUser(null);
  }, []);

  // Xử lý gửi Form Thêm / Sửa
  const submitForm = useCallback(
    async (
      data: CreateUserInput | UpdateUserInput
    ): Promise<{ success: boolean; message?: string }> => {
      if (formMode === 'create') {
        const result = await userService.createUser(data as CreateUserInput);
        if (result.success && result.data) {
          setUserList((prev) => [result.data!, ...prev]);
          return { success: true };
        }
        return { success: false, message: result.message || 'Thêm nhân viên thất bại.' };
      } else if (formMode === 'edit' && editingUser) {
        const result = await userService.updateUser(editingUser.id, data as UpdateUserInput);
        if (result.success && result.data) {
          setUserList((prev) =>
            prev.map((item) => (item.id === editingUser.id ? { ...item, ...result.data! } : item))
          );
          return { success: true };
        }
        return { success: false, message: result.message || 'Cập nhật nhân viên thất bại.' };
      }
      return { success: false, message: 'Dữ liệu không hợp lệ.' };
    },
    [formMode, editingUser]
  );

  // Xử lý Xác nhận Xóa nhân viên
  const confirmDelete = useCallback(
    async (id: string): Promise<{ success: boolean; message?: string }> => {
      const result = await userService.deleteUser(id);
      if (result.success) {
        setUserList((prev) => prev.filter((item) => item.id !== id));
        return { success: true };
      }
      return { success: false, message: result.message || 'Xóa nhân viên thất bại.' };
    },
    []
  );

  return {
    userList: paginatedUsers,
    totalItems,
    totalPages,
    currentPage: safeCurrentPage,
    setCurrentPage,
    loading,
    filters,
    setFilters: updateFilters,
    toggleStatus,
    refreshUsers: loadUsers,

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
  };
}
