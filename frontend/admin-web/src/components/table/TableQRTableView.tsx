'use strict';

import React, { useState } from 'react';
import { TableItem } from '../../types/table';
import { Download, Printer, Copy, Check, QrCode, Star } from 'lucide-react';
import { QRCodeGraphic } from './TableQRCard';

interface TableQRTableViewProps {
  tables: TableItem[];
  onToggleQr: (id: string) => void;
  onDownloadPng: (table: TableItem) => void;
  onPrintSingle: (table: TableItem) => void;
}

export function TableQRTableView({
  tables,
  onToggleQr,
  onDownloadPng,
  onPrintSingle,
}: TableQRTableViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (tables.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8A8175] mx-auto mb-3">
          <QrCode className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#2D241E]">Không tìm thấy mã QR bàn nào</h3>
        <p className="text-xs text-[#8A8175] mt-1">
          Vui lòng thử tìm kiếm với tên bàn hoặc mã bàn khác.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[960px]">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="w-[10%] py-3.5 px-4 whitespace-nowrap">MÃ BÀN</th>
              <th className="w-[20%] py-3.5 px-4 whitespace-nowrap">TÊN BÀN &amp; KHU VỰC</th>
              <th className="w-[12%] py-3.5 px-4 whitespace-nowrap">MÃ QR</th>
              <th className="w-[22%] py-3.5 px-4 whitespace-nowrap">LIÊN KẾT GỌI MÓN</th>
              <th className="w-[14%] py-3.5 px-4 whitespace-nowrap">TRẠNG THÁI QR</th>
              <th className="w-[22%] py-3.5 px-4 text-right whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {tables.map((table) => (
              <tr
                key={table.id}
                className="hover:bg-[#FAF7F2]/70 transition-colors group"
              >
                {/* Mã bàn */}
                <td className="py-3.5 px-4 font-mono font-bold text-[#8B2323]">
                  #{table.code}
                </td>

                {/* Tên bàn & Khu vực */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#2D241E]">
                      {table.name} • {table.seats} Ghế
                    </span>
                    {table.isVip && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#FEF3E7] text-[#D97706] text-[10px] font-black">
                        <Star className="w-3 h-3 fill-current" />
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#8A8175] block mt-0.5">
                    {table.area}
                  </span>
                </td>

                {/* Thumbnail QR */}
                <td className="py-3.5 px-4">
                  <button
                    type="button"
                    onClick={() => onPrintSingle(table)}
                    title="Xem chi tiết mã QR"
                    className="w-10 h-10 rounded-lg border border-[#EAE3D6] bg-white p-0.5 hover:border-[#8B2323] transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
                  >
                    {table.qrImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={table.qrImage}
                        alt={table.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QRCodeGraphic value={table.qrUrl} size={36} />
                    )}
                  </button>
                </td>

                {/* Liên kết gọi món */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#2D241E] truncate max-w-[160px]">
                      {table.qrUrl}
                    </span>
                    <button
                      type="button"
                      title="Sao chép liên kết"
                      onClick={() => handleCopy(table.id, table.qrUrl)}
                      className="p-1 text-[#8A8175] hover:text-[#8B2323] hover:bg-[#FAF7F2] rounded-md transition-all cursor-pointer"
                    >
                      {copiedId === table.id ? (
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] text-[#8A8175] block mt-0.5">
                    Quét để gọi món tại bàn
                  </span>
                </td>

                {/* Trạng thái QR: Toggle switch */}
                <td className="py-3.5 px-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={table.qrEnabled}
                      onClick={() => onToggleQr(table.id)}
                      className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                        table.qrEnabled ? 'bg-[#10B981]' : 'bg-[#D8CFBF]'
                      }`}
                    >
                      <div
                        className={`bg-white w-3.5 h-3.5 rounded-full shadow-xs transform transition-transform ${
                          table.qrEnabled ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span
                      className={`text-[11px] font-bold ${
                        table.qrEnabled ? 'text-[#10B981]' : 'text-[#8A8175]'
                      }`}
                    >
                      {table.qrEnabled ? 'Hoạt động' : 'Tắt'}
                    </span>
                  </label>
                </td>

                {/* Thao tác */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onDownloadPng(table)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#EAE3D6] bg-white text-xs font-semibold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-[#8A8175]" />
                      <span className="hidden sm:inline">Tải PNG</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onPrintSingle(table)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#EAE3D6] bg-white text-xs font-semibold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#8A8175]" />
                      <span className="hidden sm:inline">In lẻ</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
