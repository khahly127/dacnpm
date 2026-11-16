'use strict';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TableItem } from '../../types/table';

interface TableDeleteModalProps {
  table: TableItem | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<void>;
}

export function TableDeleteModal({ table, onClose, onConfirmDelete }: TableDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!table) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(table.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-[#2D241E]">
          Xóa bàn {table.name}?
        </h3>
        <p className="text-xs text-[#8A8175] mt-1.5 leading-relaxed">
          Bạn có chắc chắn muốn xóa <span className="font-bold text-[#2D241E]">{table.name}</span> ({table.area})? Mã QR tương ứng sẽ bị vô hiệu hóa.
        </p>

        <div className="flex items-center gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl border border-[#EAE3D6] text-xs font-bold text-[#6E6457] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
