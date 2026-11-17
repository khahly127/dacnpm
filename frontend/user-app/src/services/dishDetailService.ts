import { Dish, DishOptionGroup } from '@/types/menu';

export const dishDetailService = {
  /**
   * Generates relevant option groups for a dish based on its name and category
   */
  getOptionGroupsForDish(dish: Dish): DishOptionGroup[] {
    const lowerName = dish.name.toLowerCase();
    const lowerCat = dish.categoryName.toLowerCase();

    // 1. Meat / Steak / Grill
    if (
      lowerName.includes('bò') ||
      lowerName.includes('wagyu') ||
      lowerName.includes('bít tết') ||
      lowerName.includes('steak') ||
      lowerName.includes('cừu')
    ) {
      return [
        {
          id: 'doneness',
          title: 'Độ chín của thịt',
          subtitle: 'Chọn 1 mức nhiệt để đạt trải nghiệm béo ngậy mềm mọng nhất',
          required: true,
          type: 'single',
          badgeText: 'Bắt buộc',
          options: [
            {
              id: 'medium_rare',
              name: 'Tái vừa (Medium Rare)',
              subtitle: '⭐ Đầu bếp khuyên dùng',
              price: 0,
              isDefault: true,
            },
            {
              id: 'medium',
              name: 'Vừa chín tới (Medium)',
              subtitle: 'Hồng nhẹ, trong mọng nước cân bằng',
              price: 0,
            },
            {
              id: 'well_done',
              name: 'Chín kỹ (Well Done)',
              subtitle: 'Chín đều toàn phần thịt',
              price: 0,
            },
          ],
        },
        {
          id: 'sauce',
          title: 'Sốt ăn kèm',
          subtitle: 'Hương vị sốt hòa quyện làm nổi bật vị ngọt của thịt',
          required: false,
          type: 'single',
          badgeText: 'Chọn 1',
          options: [
            {
              id: 'sauce_pepper',
              name: 'Sốt tiêu đen Phú Quốc',
              subtitle: 'Vị cay nồng ấm từ tiêu đảo',
              price: 0,
              isDefault: true,
            },
            {
              id: 'sauce_truffle',
              name: 'Sốt nấm rừng Truffle',
              subtitle: 'Hương nấm Ý thơm lừng ngậy béo',
              price: 35000,
            },
            {
              id: 'sauce_cheese',
              name: 'Sốt phô mai cay nhẹ',
              subtitle: 'Cheddar vàng tan chảy cùng ớt paprika',
              price: 0,
            },
          ],
        },
        {
          id: 'sides',
          title: 'Món ăn kèm thêm',
          subtitle: 'Gia tăng khẩu phần cho bữa ăn trọn vẹn',
          required: false,
          type: 'multiple',
          badgeText: 'Tùy chọn',
          options: [
            {
              id: 'side_asparagus',
              name: 'Thêm măng tây nướng',
              subtitle: 'Áp chảo muối biển & dầu ô liu',
              price: 35000,
            },
            {
              id: 'side_mash_potato',
              name: 'Thêm khoai tây nghiền bơ tỏi',
              subtitle: 'Bơ Normandy Pháp đậm béo',
              price: 30000,
            },
          ],
        },
      ];
    }

    // 2. Hotpot / Lẩu
    if (lowerName.includes('lẩu') || lowerCat.includes('lẩu')) {
      return [
        {
          id: 'spice_level',
          title: 'Mức độ cay của nước lẩu',
          subtitle: 'Chọn mức độ cay phù hợp với khẩu vị của bạn',
          required: true,
          type: 'single',
          badgeText: 'Bắt buộc',
          options: [
            {
              id: 'medium_spicy',
              name: 'Cay vừa (Tiêu chuẩn)',
              subtitle: '⭐ Hương vị cay nồng chuẩn vị Casa Cozy',
              price: 0,
              isDefault: true,
            },
            {
              id: 'mild_spicy',
              name: 'Ít cay / Không cay',
              subtitle: 'Thanh dịu, phù hợp gia đình có trẻ em',
              price: 0,
            },
            {
              id: 'very_spicy',
              name: 'Cay nhiều (Sa tế ớt hiểm)',
              subtitle: 'Đậm đà cay tê dành cho tín đồ ăn cay',
              price: 0,
            },
          ],
        },
        {
          id: 'hotpot_topping',
          title: 'Món nhúng kèm thêm',
          subtitle: 'Thêm đồ nhúng cao cấp thả lẩu',
          required: false,
          type: 'multiple',
          badgeText: 'Tùy chọn',
          options: [
            {
              id: 'add_beef_slice',
              name: 'Thêm thịt bò Mỹ nhúng lẩu (150g)',
              subtitle: 'Bò tươi cắt lát mỏng mềm ngọt',
              price: 65000,
            },
            {
              id: 'add_mushroom_veggies',
              name: 'Thêm đĩa nấm tươi & rau xanh',
              subtitle: 'Nấm đùi gà, nấm kim châm và rau tổng hợp',
              price: 35000,
            },
            {
              id: 'add_egg_noodles',
              name: 'Thêm đĩa mì trứng tươi',
              subtitle: 'Sợi mì dai vàng óng',
              price: 20000,
            },
          ],
        },
      ];
    }

    // 3. Drinks / Đồ uống
    if (
      lowerCat.includes('uống') ||
      lowerName.includes('trà') ||
      lowerName.includes('nước') ||
      lowerName.includes('soda')
    ) {
      return [
        {
          id: 'sugar_ice',
          title: 'Độ ngọt & Lượng đá',
          subtitle: 'Tùy chỉnh tỷ lệ pha chế theo khẩu vị',
          required: true,
          type: 'single',
          badgeText: 'Bắt buộc',
          options: [
            {
              id: 'standard_ice_sugar',
              name: '100% Đường • 100% Đá (Tiêu chuẩn)',
              subtitle: 'Vị đậm đà mát lạnh giải nhiệt',
              price: 0,
              isDefault: true,
            },
            {
              id: 'less_sugar',
              name: '70% Đường • 70% Đá (Ngọt thanh)',
              subtitle: 'Thanh mát, dịu nhẹ vị trà tự nhiên',
              price: 0,
            },
            {
              id: 'low_sugar',
              name: '50% Đường • 50% Đá (Ít ngọt)',
              subtitle: 'Giảm ngọt tối đa, thơm đậm tinh dầu thảo mộc',
              price: 0,
            },
          ],
        },
        {
          id: 'drink_toppings',
          title: 'Thêm topping',
          subtitle: 'Gia tăng độ giòn ngon cho thức uống',
          required: false,
          type: 'multiple',
          badgeText: 'Tùy chọn',
          options: [
            {
              id: 'add_chia_seeds',
              name: 'Thêm hạt chia hữu cơ',
              subtitle: 'Bổ sung chất xơ và thanh mát',
              price: 10000,
            },
            {
              id: 'add_peach_slices',
              name: 'Thêm đào miếng giòn ngọt (3 miếng)',
              subtitle: 'Đào ngâm vàng ươm giòn tan',
              price: 15000,
            },
          ],
        },
      ];
    }

    // 4. Default for other dishes (Appetizers, seafood, desserts, etc.)
    return [
      {
        id: 'sauce_dip',
        title: 'Sốt ăn kèm',
        subtitle: 'Chọn sốt chấm phù hợp nhất',
        required: false,
        type: 'single',
        badgeText: 'Chọn 1',
        options: [
          {
            id: 'house_sauce',
            name: 'Sốt đặc trưng Casa Cozy',
            subtitle: 'Pha chế thủ công chuẩn vị nhà hàng',
            price: 0,
            isDefault: true,
          },
          {
            id: 'chili_mayo',
            name: 'Sốt mayonnaise cay dịu',
            subtitle: 'Béo ngậy quyện ớt ngọt paprika',
            price: 0,
          },
          {
            id: 'truffle_butter',
            name: 'Sốt bơ tỏi nấm Truffle',
            subtitle: 'Thơm nức mùi nấm Ý quý hiếm',
            price: 25000,
          },
        ],
      },
      {
        id: 'extras',
        title: 'Món ăn kèm thêm',
        subtitle: 'Thêm khẩu phần cho món',
        required: false,
        type: 'multiple',
        badgeText: 'Tùy chọn',
        options: [
          {
            id: 'extra_portion',
            name: 'Khẩu phần cỡ lớn (+30% lượng món)',
            subtitle: 'Thích hợp dùng chung 2 - 3 người',
            price: 35000,
          },
          {
            id: 'garlic_bread',
            name: 'Thêm bánh mì bơ tỏi nướng giòn',
            subtitle: 'Bánh mì nướng bơ tỏi thảo mộc',
            price: 20000,
          },
        ],
      },
    ];
  },

  /**
   * Quick note tags for kitchen note section
   */
  getQuickNoteTags(dish: Dish): string[] {
    const lowerName = dish.name.toLowerCase();
    const lowerCat = dish.categoryName.toLowerCase();

    if (
      lowerName.includes('bò') ||
      lowerName.includes('steak') ||
      lowerName.includes('wagyu') ||
      lowerName.includes('nướng')
    ) {
      return ['Không cay', 'Sốt để riêng', 'Ít tiêu', 'Cắt lát sẵn', 'Nướng xém cạnh'];
    }

    if (lowerName.includes('lẩu') || lowerCat.includes('lẩu')) {
      return ['Không hành lá', 'Ít cay', 'Nước dùng riêng', 'Không ớt', 'Ít chua'];
    }

    if (lowerCat.includes('uống') || lowerName.includes('trà') || lowerName.includes('nước')) {
      return ['Để riêng đá', 'Không đường', 'Ít đá', 'Mang về', 'Giao ngay'];
    }

    return ['Không cay', 'Sốt để riêng', 'Ít dầu mỡ', 'Không hành', 'Làm nóng kỹ'];
  },

  /**
   * Helper to format dish portion subtitle e.g. "Bò Úc hảo hạng • Định lượng 200g"
   */
  getDishPortionSubtitle(dish: Dish): string {
    const lowerName = dish.name.toLowerCase();
    if (lowerName.includes('wagyu') || lowerName.includes('bò')) {
      return 'Bò Úc hảo hạng • Định lượng 200g';
    }
    if (lowerName.includes('cá hồi')) {
      return 'Cá hồi tươi Nauy • Định lượng 180g';
    }
    if (lowerName.includes('lẩu')) {
      return 'Nồi lẩu tiêu chuẩn • Dành cho 2 - 4 khách';
    }
    if (lowerName.includes('trà') || lowerName.includes('nước')) {
      return 'Ly 500ml • Thảo mộc & Trái cây tươi';
    }
    return `${dish.categoryName} • Đặc sản Casa Cozy Bistro`;
  },
};
