'use strict';

import React from 'react';
import { X, Printer, QrCode } from 'lucide-react';
import { TableItem } from '../../types/table';
import { QRCodeGraphic } from './TableQRCard';

interface TablePrintAllModalProps {
  isOpen: boolean;
  tables: TableItem[];
  onClose: () => void;
}

export function TablePrintAllModal({ isOpen, tables, onClose }: TablePrintAllModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5EFE6] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8B2323]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2D241E]">
                Xem trước bản in trọn bộ ấn phẩm mã QR ({tables.length} bàn)
              </h2>
              <p className="text-[11px] text-[#8A8175]">
                Định dạng thẻ để bàn chuẩn A6/A7 - Nhà hàng Casa Cozy Bistro
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#8B2323] text-white text-xs font-bold rounded-xl hover:bg-[#721C1C] shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#8A8175] hover:text-[#2D241E] hover:bg-[#FAF7F2] rounded-xl transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF7F2] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div
                key={table.id}
                className="bg-white rounded-2xl border-2 border-[#EAE3D6] p-5 text-center shadow-xs flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#8B2323] text-white flex items-center justify-center text-[10px] font-black shadow-xs mb-1.5">
                  CC
                </div>
                <h4 className="text-xs font-black text-[#8B2323] tracking-widest uppercase">
                  CASA COZY BISTRO
                </h4>
                <div className="w-full border-t border-[#F0EAE1] pt-2 mt-2 mb-3">
                  <span className="text-base font-black text-[#2D241E] block">
                    {table.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[#8A8175] font-medium">
                    {table.area} • {table.seats} Ghế
                  </span>
                </div>

                <div className="p-2 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6] mb-2.5">
                  {table.qrImage ? (
                    <div className="relative w-[110px] h-[110px] flex items-center justify-center mx-auto">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={table.qrImage}
                        alt={table.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute w-6 h-6 rounded-full bg-[#8B2323] text-white flex items-center justify-center text-[8px] font-black border-2 border-white shadow-xs">
                        CC
                      </div>
                    </div>
                  ) : (
                    <QRCodeGraphic value={table.qrUrl} size={110} />
                  )}
                </div>

                <p className="text-[11px] font-bold text-[#8B2323] tracking-tight">
                  https://{table.qrUrl}
                </p>
                <p className="text-[9px] text-[#8A8175] mt-0.5">
                  Quét mã để xem thực đơn &amp; gọi món
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
