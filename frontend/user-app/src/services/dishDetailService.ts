import { Dish, DishOptionGroup } from '@/types/menu';

export const dishDetailService = {
  /**
   * Phân loại tùy chọn thông minh theo từng loại món ăn chuẩn thực tế
   */
  getOptionGroupsForDish(dish: Dish): DishOptionGroup[] {
    const lowerName = dish.name.toLowerCase();
    const lowerCat = dish.categoryName.toLowerCase();

    // 1. Đồ ăn vặt / Snack -> Tuyệt đối không cần tùy chọn sốt hay món kèm
    if (
      lowerCat.includes('ăn vặt') ||
      lowerCat.includes('snack') ||
      lowerName.includes('lays') ||
      lowerName.includes('oishi') ||
      lowerName.includes('khoai tây sấy') ||
      lowerName.includes('đậu phộng')
    ) {
      return [];
    }

    // 2. Món Lẩu (Kiểm tra trước bò/thịt để tránh Lẩu bò bị tính thành Bít tết)
    if (lowerName.includes('lẩu') || lowerCat.includes('lẩu')) {
      // 2.1. Lẩu chay -> Chỉ có đồ nhúng chay thuần khiết, KHÔNG CÓ THỊT
      if (lowerName.includes('chay')) {
        return [
          {
            id: 'spice_level',
            title: 'Mức độ cay của nước lẩu chay',
            subtitle: 'Chọn mức độ cay phù hợp với khẩu vị của bạn',
            required: true,
            type: 'single',
            badgeText: 'Bắt buộc',
            options: [
              {
                id: 'mild_spicy',
                name: 'Không cay / Thanh đạm (Tiêu chuẩn)',
                subtitle: 'Hương vị thanh mát thuần chay, ngọt vị rau củ',
                price: 0,
                isDefault: true,
              },
              {
                id: 'medium_spicy',
                name: 'Cay vừa dịu nhẹ',
                subtitle: 'Cay ấm thoang thoảng kích thích vị giác',
                price: 0,
              },
              {
                id: 'very_spicy',
                name: 'Cay nhiều (Sa tế nấm chay)',
                subtitle: 'Đậm đà cay thơm cho tín đồ ăn cay',
                price: 0,
              },
            ],
          },
          {
            id: 'veg_hotpot_toppings',
            title: 'Món nhúng chay kèm thêm',
            subtitle: 'Thêm đồ nhúng tươi ngon thanh tịnh',
            required: false,
            type: 'multiple',
            badgeText: 'Tùy chọn',
            options: [
              {
                id: 'add_mushrooms_veg',
                name: 'Thêm đĩa nấm tươi tổng hợp',
                subtitle: 'Nấm đùi gà, nấm kim châm, đông cô tươi',
                price: 35000,
              },
              {
                id: 'add_tofu_beancurd',
                name: 'Thêm đậu hũ non & tàu hũ ky chiên',
                subtitle: 'Tàu hũ giòn bùi, đậu hũ mềm mịn',
                price: 25000,
              },
              {
                id: 'add_green_veggies',
                name: 'Thêm đĩa rau xanh nhúng lẩu',
                subtitle: 'Rau cải thảo, mồng tơi, tần ô tươi mát',
                price: 20000,
              },
              {
                id: 'add_veg_noodles',
                name: 'Thêm đĩa mì nấm / bún tươi',
                subtitle: 'Sợi mì chay dai ngon thanh đạm',
                price: 15000,
              },
            ],
          },
        ];
      }

      // 2.2. Lẩu cá kèo -> Đồ nhúng đặc sản cá kèo, rau đắng, lá giang
      if (lowerName.includes('kèo')) {
        return [
          {
            id: 'spice_level',
            title: 'Mức độ cay của nước lẩu lá giang',
            subtitle: 'Chọn mức độ cay phù hợp với khẩu vị của bạn',
            required: true,
            type: 'single',
            badgeText: 'Bắt buộc',
            options: [
              {
                id: 'medium_spicy',
                name: 'Cay vừa chuẩn vị (Tiêu chuẩn)',
                subtitle: 'Hòa quyện vị chua thanh lá giang & cay nồng ớt hiểm',
                price: 0,
                isDefault: true,
              },
              {
                id: 'mild_spicy',
                name: 'Ít cay / Không ớt',
                subtitle: 'Vị chua thanh mát, dịu nhẹ',
                price: 0,
              },
              {
                id: 'very_spicy',
                name: 'Cay nhiều sa tế ớt hiểm',
                subtitle: 'Đậm đà cay tê chuẩn chất miền Tây',
                price: 0,
              },
            ],
          },
          {
            id: 'fish_hotpot_toppings',
            title: 'Món nhúng kèm thêm',
            subtitle: 'Thêm đồ nhúng đặc sản ăn kèm lẩu cá kèo',
            required: false,
            type: 'multiple',
            badgeText: 'Tùy chọn',
            options: [
              {
                id: 'add_keo_fish',
                name: 'Thêm đĩa cá kèo tươi (8 - 10 con)',
                subtitle: 'Cá kèo sống tươi béo ngậy ngọt thịt',
                price: 75000,
              },
              {
                id: 'add_rau_dang',
                name: 'Thêm đĩa rau đắng, bông súng, rau nhút',
                subtitle: 'Bộ ba rau nhúng lẩu cá kèo miền Tây đặc trưng',
                price: 30000,
              },
              {
                id: 'add_fresh_noodles',
                name: 'Thêm đĩa bún tươi / mì trứng',
                subtitle: 'Bún sợi dai mềm ăn kèm nước lẩu lá giang',
                price: 15000,
              },
              {
                id: 'add_mushrooms',
                name: 'Thêm đĩa nấm tươi tổng hợp',
                subtitle: 'Nấm đùi gà, kim châm, nấm rơm',
                price: 35000,
              },
            ],
          },
        ];
      }

      // 2.3. Lẩu cua đồng / Riêu cua
      if (lowerName.includes('cua')) {
        return [
          {
            id: 'spice_level',
            title: 'Mức độ cay của nước lẩu riêu cua',
            subtitle: 'Chọn mức độ cay phù hợp với khẩu vị của bạn',
            required: true,
            type: 'single',
            badgeText: 'Bắt buộc',
            options: [
              {
                id: 'medium_spicy',
                name: 'Cay vừa (Tiêu chuẩn)',
                subtitle: 'Vị ngọt thanh dậy mùi riêu cua béo ngậy',
                price: 0,
                isDefault: true,
              },
              {
                id: 'mild_spicy',
                name: 'Ít cay / Không cay',
                subtitle: 'Vị thanh ngọt tự nhiên, thích hợp cho trẻ nhỏ',
                price: 0,
              },
              {
                id: 'very_spicy',
                name: 'Cay nhiều (Sa tế ớt chưng)',
                subtitle: 'Ớt chưng gia truyền cay thơm nồng nàn',
                price: 0,
              },
            ],
          },
          {
            id: 'crab_hotpot_toppings',
            title: 'Món nhúng kèm thêm',
            subtitle: 'Gia tăng topping thả lẩu riêu cua đồng',
            required: false,
            type: 'multiple',
            badgeText: 'Tùy chọn',
            options: [
              {
                id: 'add_crab_roe',
                name: 'Thêm đĩa riêu cua đồng & mọc giòn',
                subtitle: 'Riêu cua đồng tươi nguyên chất béo ngậy',
                price: 55000,
              },
              {
                id: 'add_beef_slice',
                name: 'Thêm bắp bò Mỹ nhúng riêu cua (150g)',
                subtitle: 'Thịt bắp bò giòn mềm ngọt đậm đà',
                price: 65000,
              },
              {
                id: 'add_banh_da_red',
                name: 'Thêm bánh đa đỏ Hải Phòng & mì trứng',
                subtitle: 'Bánh đa dai mềm chuẩn vị lẩu cua',
                price: 20000,
              },
              {
                id: 'add_banana_flower',
                name: 'Thêm đĩa hoa chuối & rau đồng nội',
                subtitle: 'Hoa chuối bào, rau muống chẻ, tía tô',
                price: 25000,
              },
            ],
          },
        ];
      }

      // 2.4. Các món lẩu khác (Lẩu đặc biệt, Lẩu ếch...)
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

    // 3. Món Bò / Steak / Bít tết cao cấp
    if (
      lowerName.includes('bò nướng') ||
      lowerName.includes('bít tết') ||
      lowerName.includes('steak') ||
      lowerName.includes('wagyu') ||
      lowerName.includes('cừu nướng')
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

    // 4. Món Nướng / Hải sản / Món Nhậu (Bạch tuộc nướng, Hàu nướng, Tôm nướng, Chân gà, Cá nướng...)
    if (
      lowerCat.includes('nhậu') ||
      lowerName.includes('nướng') ||
      lowerName.includes('bạch tuộc') ||
      lowerName.includes('hàu') ||
      lowerName.includes('tôm nướng') ||
      lowerName.includes('chân gà') ||
      lowerName.includes('sườn nướng') ||
      lowerName.includes('cá nướng')
    ) {
      return [
        {
          id: 'grill_spice',
          title: 'Gia vị & Độ cay món nướng',
          subtitle: 'Chọn phong cách tẩm ướp yêu thích',
          required: true,
          type: 'single',
          badgeText: 'Bắt buộc',
          options: [
            {
              id: 'spicy_sate',
              name: 'Ướp sa tế cay nồng (Chuẩn vị nhà hàng)',
              subtitle: 'Đậm đà cay thơm vàng óng',
              price: 0,
              isDefault: true,
            },
            {
              id: 'mild_salt',
              name: 'Ướp muối ớt ít cay / nướng mỡ hành',
              subtitle: 'Vị đậm đà thanh nhẹ, tôn vị ngọt tự nhiên',
              price: 0,
            },
            {
              id: 'plain_grill',
              name: 'Nướng mộc tự nhiên (Không cay)',
              subtitle: 'Giữ nguyên 100% độ ngọt nguyên bản',
              price: 0,
            },
          ],
        },
        {
          id: 'dip_sauce',
          title: 'Sốt chấm ăn kèm',
          subtitle: 'Chọn sốt chấm hòa quyện hương vị',
          required: false,
          type: 'single',
          badgeText: 'Chọn 1',
          options: [
            {
              id: 'green_chili_salt',
              name: 'Muối ớt xanh Nha Trang',
              subtitle: 'Chua cay mặn ngọt chuẩn chấm nướng & hải sản',
              price: 0,
              isDefault: true,
            },
            {
              id: 'pepper_lemon',
              name: 'Muối tiêu chanh ớt tươi',
              subtitle: 'Chua thanh mặn mà truyền thống',
              price: 0,
            },
            {
              id: 'me_sauce',
              name: 'Nước mắm me cay dẻo',
              subtitle: 'Chua ngọt cay nồng đậm đà',
              price: 0,
            },
          ],
        },
      ];
    }

    // 5. Đồ uống (Nước cam, Nước dâu, Soda, Cacao, Sữa tươi...)
    if (
      lowerCat.includes('uống') ||
      lowerName.includes('trà') ||
      lowerName.includes('nước') ||
      lowerName.includes('soda') ||
      lowerName.includes('sữa tươi')
    ) {
      // Đồ uống đóng lon/chai/bia -> Không có tùy chọn đường đá
      if (
        lowerName.includes('lon') ||
        lowerName.includes('chai') ||
        lowerName.includes('bia') ||
        lowerName.includes('tiger') ||
        lowerName.includes('coca') ||
        lowerName.includes('pepsi')
      ) {
        return [];
      }

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
              subtitle: 'Thanh mát, dịu nhẹ vị tự nhiên',
              price: 0,
            },
            {
              id: 'low_sugar',
              name: '50% Đường • 50% Đá (Ít ngọt)',
              subtitle: 'Giảm ngọt tối đa, thanh dịu',
              price: 0,
            },
            {
              id: 'no_ice',
              name: 'Không đá (Uống lạnh)',
              subtitle: 'Bảo toàn hương vị nguyên chất không lo tan đá',
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
              id: 'add_aloe_vera',
              name: 'Thêm thạch nha đam giòn mát',
              subtitle: 'Nha đam tươi ngọt thanh giòn sần sật',
              price: 10000,
            },
            {
              id: 'add_peach_slices',
              name: 'Thêm đào miếng giòn ngọt (3 miếng)',
              subtitle: 'Đào ngâm vàng ươm giòn tan',
              price: 15000,
            },
            {
              id: 'add_chia_seeds',
              name: 'Thêm hạt chia hữu cơ',
              subtitle: 'Bổ sung chất xơ và thanh mát',
              price: 10000,
            },
          ],
        },
      ];
    }

    // 6. Tráng miệng (Chè, Bánh)
    if (lowerCat.includes('tráng miệng') || lowerName.includes('chè')) {
      if (lowerName.includes('chè')) {
        return [
          {
            id: 'dessert_ice',
            title: 'Cách dùng chè',
            subtitle: 'Tùy chỉnh mức đá & độ ngọt',
            required: true,
            type: 'single',
            badgeText: 'Bắt buộc',
            options: [
              {
                id: 'ice_standard',
                name: 'Ăn kèm đá nhuyễn (Tiêu chuẩn)',
                subtitle: 'Mát lạnh ngọt bùi giải nhiệt',
                price: 0,
                isDefault: true,
              },
              {
                id: 'ice_less',
                name: 'Ít ngọt • Ít đá',
                subtitle: 'Thanh dịu nhẹ nhàng',
                price: 0,
              },
              {
                id: 'no_ice_warm',
                name: 'Ăn mát không đá',
                subtitle: 'Đậm đà hương vị chè truyền thống',
                price: 0,
              },
            ],
          },
        ];
      }
      // Các loại bánh (Mochi, Caramen...) -> Không cần options rườm rà
      return [];
    }

    // 7. Khai vị (Khoai chiên, Khoai lắc...)
    if (lowerName.includes('khoai') && (lowerName.includes('chiên') || lowerName.includes('lắc'))) {
      return [
        {
          id: 'fry_sauce',
          title: 'Sốt chấm ăn kèm',
          subtitle: 'Chọn sốt chấm yêu thích của bạn',
          required: false,
          type: 'single',
          badgeText: 'Chọn 1',
          options: [
            {
              id: 'ketchup_chili',
              name: 'Tương cà & Tương ớt (Tiêu chuẩn)',
              subtitle: 'Vị chua ngọt truyền thống',
              price: 0,
              isDefault: true,
            },
            {
              id: 'mayo_dip',
              name: 'Sốt Mayonnaise béo ngậy',
              subtitle: 'Trứng gà tươi sánh mịn đậm đà',
              price: 0,
            },
            {
              id: 'melted_cheese',
              name: 'Sốt phô mai Cheddar tan chảy',
              subtitle: 'Phô mai béo ngậy thơm nức mũi',
              price: 15000,
            },
          ],
        },
      ];
    }

    // 8. Tất cả các món còn lại (Kim chi, Há cảo, Đĩa xào đơn giản...)
    // -> Trả về mảng rỗng [] để tránh gán bừa sốt hay bánh mì vô lý!
    return [];
  },

  /**
   * Thẻ ghi chú nhanh phù hợp với từng loại món
   */
  getQuickNoteTags(dish: Dish): string[] {
    const lowerName = dish.name.toLowerCase();
    const lowerCat = dish.categoryName.toLowerCase();

    if (lowerName.includes('chay')) {
      return ['Ăn chay thanh tịnh', 'Nước dùng riêng', 'Không ớt', 'Ít dầu mỡ', 'Thêm rau'];
    }

    if (lowerName.includes('kèo') || lowerName.includes('cá')) {
      return ['Không hành lá', 'Ít cay', 'Nước dùng riêng', 'Không ớt', 'Ít chua'];
    }

    if (lowerName.includes('lẩu') || lowerCat.includes('lẩu')) {
      return ['Không hành lá', 'Ít cay', 'Nước dùng riêng', 'Không ớt', 'Thêm nước dùng'];
    }

    if (
      lowerName.includes('bò') ||
      lowerName.includes('steak') ||
      lowerName.includes('wagyu') ||
      lowerName.includes('nướng') ||
      lowerCat.includes('nhậu')
    ) {
      return ['Ít cay', 'Không hành', 'Sốt để riêng', 'Nướng giòn', 'Ít dầu mỡ'];
    }

    if (lowerCat.includes('uống') || lowerName.includes('trà') || lowerName.includes('nước')) {
      return ['Để riêng đá', 'Không đường', 'Ít đá', 'Mang về', 'Uống liền'];
    }

    if (lowerCat.includes('tráng miệng') || lowerName.includes('chè') || lowerName.includes('bánh')) {
      return ['Ăn lạnh', 'Ít ngọt', 'Dùng sau bữa', 'Mang về'];
    }

    if (
      lowerCat.includes('ăn vặt') ||
      lowerName.includes('snack') ||
      lowerName.includes('lays') ||
      lowerName.includes('oishi')
    ) {
      return ['Ăn ngay', 'Mang về', 'Để riêng'];
    }

    return ['Không cay', 'Sốt để riêng', 'Ít dầu mỡ', 'Không hành', 'Làm nóng kỹ'];
  },

  /**
   * Khẩu phần hiển thị đầy đủ
   */
  getDishPortionSubtitle(dish: Dish): string {
    const lowerName = dish.name.toLowerCase();
    const lowerCat = dish.categoryName.toLowerCase();

    if (lowerName.includes('lẩu') || lowerCat.includes('lẩu')) {
      return 'Nồi lẩu tiêu chuẩn • Dành cho 2 - 4 khách';
    }
    if (lowerName.includes('wagyu') || lowerName.includes('bò')) {
      return 'Bò Úc hảo hạng • Định lượng 200g';
    }
    if (lowerName.includes('cá hồi')) {
      return 'Cá hồi tươi Nauy • Định lượng 180g';
    }
    if (lowerCat.includes('uống') || lowerName.includes('trà') || lowerName.includes('nước')) {
      return 'Ly 500ml • Thảo mộc & Trái cây tươi';
    }
    return `${dish.categoryName} • Đặc sản Casa Cozy Bistro`;
  },

  /**
   * Huy hiệu khẩu phần nhỏ gọn bên cạnh giá tiền
   */
  getDishPortionBadge(dish: Dish): string {
    const lowerName = dish.name.toLowerCase();
    const lowerCat = dish.categoryName.toLowerCase();

    if (lowerName.includes('lẩu') || lowerCat.includes('lẩu')) {
      return 'Dành cho 2 - 4 khách';
    }
    if (lowerName.includes('wagyu') || lowerName.includes('bò') || lowerName.includes('steak')) {
      return 'Định lượng 200g';
    }
    if (lowerName.includes('cá hồi')) {
      return 'Định lượng 180g';
    }
    if (lowerCat.includes('uống') || lowerName.includes('trà') || lowerName.includes('nước')) {
      if (lowerName.includes('lon') || lowerName.includes('chai')) return 'Lon 330ml';
      return 'Ly 500ml';
    }
    if (
      lowerCat.includes('ăn vặt') ||
      lowerName.includes('snack') ||
      lowerName.includes('lays') ||
      lowerName.includes('oishi')
    ) {
      return 'Gói tiêu chuẩn';
    }
    if (lowerCat.includes('tráng miệng') || lowerName.includes('chè') || lowerName.includes('bánh')) {
      return 'Phần tráng miệng';
    }
    if (lowerCat.includes('khai vị')) {
      return 'Đĩa khai vị';
    }
    return 'Đĩa tiêu chuẩn';
  },
};
