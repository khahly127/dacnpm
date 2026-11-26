'use strict';

import React from 'react';

export function TableHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-black text-[#2D241E] tracking-tight">
          Quản Lý Bàn Ăn
        </h1>
        <p className="text-xs text-[#8A8175] mt-1 font-medium max-w-2xl">
          Giám sát sơ đồ không gian, cập nhật trạng thái thực khách và quản lý thời gian phục vụ trực tiếp tại từng bàn ăn.
        </p>
      </div>
    </div>
  );
}
