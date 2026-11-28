'use strict';

import React, { useState } from 'react';
import { X, Armchair } from 'lucide-react';
import { TableItem, TableStatus, CreateTableInput, UpdateTableInput } from '../../types/table';

interface TableFormModalProps {
  isOpen: boolean;
  table?: TableItem | null;
  onClose: () => void;
  onSubmitCreate: (input: CreateTableInput) => Promise<void>;
  onSubmitUpdate: (id: string, input: UpdateTableInput) => Promise<void>;
}

function TableFormInner({
  table,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: Omit<TableFormModalProps, 'isOpen'>) {
  const isEdit = Boolean(table);

  const [name, setName] = useState(table ? table.name : '');
  const [status, setStatus] = useState<TableStatus>(table ? table.status : 'available');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên bàn.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (isEdit && table) {
        await onSubmitUpdate(table.id, {
          name: name.trim(),
          status,
        });
      } else {
        await onSubmitCreate({
          name: name.trim(),
          area: 'Sảnh Chính Tầng 1',
          seats: 4,
          status,
        });
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác không thành công.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#F5EFE6]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8B2323]">
              <Armchair className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2D241E]">
                {isEdit ? 'Chỉnh Sửa Bàn Ăn' : 'Thêm Bàn Ăn Mới'}
              </h2>
              <p className="text-[11px] text-[#8A8175]">
                {isEdit ? 'Cập nhật tên bàn và trạng thái phục vụ' : 'Khai báo tên bàn và chọn trạng thái'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8A8175] hover:text-[#2D241E] hover:bg-[#FAF7F2] rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            {/* Tên bàn */}
            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                Tên bàn ăn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Bàn 01, Bàn 02..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:border-[#8B2323] transition-all"
                autoFocus
              />
            </div>

            {/* Trạng thái bàn */}
            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                Trạng thái bàn <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TableStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:border-[#8B2323] transition-all"
              >
                <option value="available">Bàn trống (sẵn sàng đón khách)</option>
                <option value="occupied">Đang có khách</option>
                <option value="reserved">Đặt trước</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4.5 bg-[#FAF7F2] border-t border-[#F5EFE6] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#EAE3D6] text-xs font-bold text-[#6E6457] hover:bg-white transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#8B2323] text-white text-xs font-bold hover:bg-[#721C1C] shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo bàn ăn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TableFormModal(props: TableFormModalProps) {
  if (!props.isOpen) return null;
  return <TableFormInner key={props.table?.id || 'new'} {...props} />;
}
