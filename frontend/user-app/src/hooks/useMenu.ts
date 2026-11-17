'use client';

import { useEffect, useMemo, useState } from 'react';
import { CategoryItem, Dish } from '@/types/menu';
import { menuService } from '@/services/menuService';

export function useMenu() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null); // null = "Tất cả"
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);

  const refetch = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        const [catsData, dishesData] = await Promise.all([
          menuService.getCategories(),
          menuService.getDishes(),
        ]);

        if (ignore) return;

        // Calculate dynamic count of dishes per category from actual DB dishes
        const categoryCounts = new Map<number, number>();
        dishesData.forEach((dish) => {
          categoryCounts.set(dish.categoryId, (categoryCounts.get(dish.categoryId) || 0) + 1);
        });

        const updatedCategories = catsData.map((cat) => ({
          ...cat,
          count: categoryCounts.get(cat.id) || 0,
        }));

        setCategories(updatedCategories);
        setDishes(dishesData);
        setError(null);
      } catch (err: unknown) {
        if (ignore) return;
        console.error('Lỗi khởi tạo thực đơn:', err);
        const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ Backend.';
        setError(msg);
        setCategories([]);
        setDishes([]);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  // Filter dishes by category and search query
  const filteredDishes = useMemo(() => {
    let result = dishes;

    // 1. Filter by category
    if (selectedCategoryId !== null) {
      result = result.filter((d) => d.categoryId === selectedCategoryId);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.categoryName.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [dishes, selectedCategoryId, searchQuery]);

  return {
    categories,
    dishes,
    filteredDishes,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    totalDishesCount: dishes.length,
    isLoading,
    error,
    refetch,
  };
}
