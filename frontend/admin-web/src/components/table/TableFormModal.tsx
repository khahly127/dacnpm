'use strict';

import React, { useState } from 'react';
import { X, Armchair } from 'lucide-react';
import { TableItem, TableArea, TableStatus, CreateTableInput, UpdateTableInput } from '../../types/table';

interface TableFormModalProps {
  isOpen: boolean;
  table?: TableItem | null;
  onClose: () => void;
  onSubmitCreate: (input: CreateTableInput) => Promise<void>;
  onSubmitUpdate: (id: string, input: UpdateTableInput) => Promise<void>;
}

const AREAS: TableArea[] = ['Sảnh Chính Tầng 1', 'Khu Ban Công', 'Phòng VIP Lầu 2'];

function TableFormInner({
  table,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}: Omit<TableFormModalProps, 'isOpen'>) {
  const isEdit = Boolean(table);

  const [name, setName] = useState(table ? table.name : '');
  const [area, setArea] = useState<TableArea>(table ? table.area : 'Sảnh Chính Tầng 1');
  const [seats, setSeats] = useState<number>(table ? table.seats : 4);
  const [isVip, setIsVip] = useState<boolean>(Boolean(table?.isVip));
  const [status, setStatus] = useState<TableStatus>(table ? table.status : 'available');
  const [note, setNote] = useState(table?.reservedInfo?.note || '');
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
          area,
          seats,
          isVip,
          status,
          note,
        });
      } else {
        await onSubmitCreate({
          name: name.trim(),
          area,
          seats,
          isVip,
          status,
          note,
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
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                {isEdit ? 'Cập nhật vị trí, số ghế và khu vực phục vụ' : 'Khai báo mã bàn và tạo mã QR tự động'}
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
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                placeholder="Ví dụ: Bàn 25, Bàn VIP 03..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:border-[#8B2323] transition-all"
              />
            </div>

            {/* Khu vực & Số ghế */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                  Khu vực phục vụ <span className="text-red-500">*</span>
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as TableArea)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:border-[#8B2323] transition-all"
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                  Số lượng ghế ngồi
                </label>
                <select
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:border-[#8B2323] transition-all"
                >
                  <option value={2}>2 Ghế tiêu chuẩn</option>
                  <option value={4}>4 Ghế tiêu chuẩn</option>
                  <option value={6}>6 Ghế</option>
                  <option value={8}>8 Ghế</option>
                  <option value={10}>10 Ghế phòng lớn</option>
                  <option value={12}>12 Ghế đại tiệc</option>
                </select>
              </div>
            </div>

            {/* Loại bàn & Trạng thái */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                  Phân loại bàn
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#2D241E] cursor-pointer">
                    <input
                      type="radio"
                      name="vipStatus"
                      checked={!isVip}
                      onChange={() => setIsVip(false)}
                      className="accent-[#8B2323]"
                    />
                    <span>Tiêu chuẩn</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#D97706] cursor-pointer">
                    <input
                      type="radio"
                      name="vipStatus"
                      checked={isVip}
                      onChange={() => setIsVip(true)}
                      className="accent-[#8B2323]"
                    />
                    <span>Bàn VIP ★</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                  Trạng thái ban đầu
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

            {/* Ghi chú */}
            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1.5">
                Ghi chú hoặc mô tả vị trí (tùy chọn)
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Gần cửa sổ ngắm vườn, có trang bị ổ cắm điện..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] focus:outline-none focus:border-[#8B2323] transition-all resize-none"
              />
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
