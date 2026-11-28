'use client';

import { useMemo, useState } from 'react';
import { Dish, DishOption, DishOptionGroup, SelectedOption } from '@/types/menu';
import { dishDetailService } from '@/services/dishDetailService';
import { useCart } from '@/hooks/useCart';

export function useDishDetail(dish: Dish | null, onAdded?: () => void) {
  const { addToCart, getItemQuantity } = useCart();
  const currentCartQty = dish ? getItemQuantity(dish.id) : 0;
  const [quantity, setQuantity] = useState<number>(() => (currentCartQty > 0 ? currentCartQty : 1));
  const [kitchenNote, setKitchenNote] = useState<string>('');

  // Generate option groups for this dish
  const optionGroups = useMemo<DishOptionGroup[]>(() => {
    if (!dish) return [];
    return dishDetailService.getOptionGroupsForDish(dish);
  }, [dish]);

  // Quick tags
  const quickTags = useMemo<string[]>(() => {
    if (!dish) return [];
    return dishDetailService.getQuickNoteTags(dish);
  }, [dish]);

  // Selected options state: Record<groupId, optionId[]>
  const [selectedMap, setSelectedMap] = useState<Record<string, string[]>>(() => {
    if (!dish) return {};
    const groups = dishDetailService.getOptionGroupsForDish(dish);
    const initial: Record<string, string[]> = {};
    groups.forEach((g) => {
      const defaultOpt = g.options.find((o) => o.isDefault) || (g.required ? g.options[0] : null);
      if (defaultOpt) {
        initial[g.id] = [defaultOpt.id];
      } else {
        initial[g.id] = [];
      }
    });
    return initial;
  });

  // Calculate flat selected options
  const selectedOptionsList = useMemo<SelectedOption[]>(() => {
    const list: SelectedOption[] = [];
    optionGroups.forEach((group) => {
      const selectedIds = selectedMap[group.id] || [];
      group.options.forEach((opt) => {
        if (selectedIds.includes(opt.id)) {
          list.push({
            groupId: group.id,
            groupTitle: group.title,
            optionId: opt.id,
            optionName: opt.name,
            price: opt.price,
          });
        }
      });
    });
    return list;
  }, [optionGroups, selectedMap]);

  // Extra price from options
  const extraPricePerItem = useMemo(() => {
    return selectedOptionsList.reduce((sum, item) => sum + item.price, 0);
  }, [selectedOptionsList]);

  // Total price
  const basePrice = dish?.price || 0;
  const unitPrice = basePrice + extraPricePerItem;
  const totalPrice = unitPrice * quantity;
  const formattedTotalPrice = `${totalPrice.toLocaleString('vi-VN')}đ`;

  // Option toggling
  const selectSingleOption = (groupId: string, option: DishOption) => {
    setSelectedMap((prev) => ({
      ...prev,
      [groupId]: [option.id],
    }));
  };

  const toggleMultipleOption = (groupId: string, option: DishOption) => {
    setSelectedMap((prev) => {
      const current = prev[groupId] || [];
      const exists = current.includes(option.id);
      return {
        ...prev,
        [groupId]: exists
          ? current.filter((id) => id !== option.id)
          : [...current, option.id],
      };
    });
  };

  const isOptionSelected = (groupId: string, optionId: string): boolean => {
    return (selectedMap[groupId] || []).includes(optionId);
  };

  const toggleQuickTag = (tag: string) => {
    if (kitchenNote.includes(tag)) {
      setKitchenNote((prev) =>
        prev
          .replace(tag, '')
          .replace(/,\s*,/g, ',')
          .trim()
      );
    } else {
      setKitchenNote((prev) => (prev ? `${prev}, ${tag}` : tag));
    }
  };

  const increaseQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const handleConfirmAddToCart = () => {
    if (!dish) return;

    addToCart(dish, selectedOptionsList, kitchenNote, quantity, true);

    if (onAdded) onAdded();
  };

  return {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    kitchenNote,
    setKitchenNote,
    optionGroups,
    quickTags,
    selectedOptionsList,
    totalPrice,
    formattedTotalPrice,
    selectSingleOption,
    toggleMultipleOption,
    isOptionSelected,
    toggleQuickTag,
    handleConfirmAddToCart,
  };
}
