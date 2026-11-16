'use strict';

import React, { useState } from 'react';
import { X, Download, Printer, Copy, Check, QrCode } from 'lucide-react';
import { TableItem } from '../../types/table';
import { QRCodeGraphic } from './TableQRCard';

interface TableQRModalProps {
  table: TableItem | null;
  onClose: () => void;
  onDownloadPng: (table: TableItem) => void;
}

export function TableQRModal({ table, onClose, onDownloadPng }: TableQRModalProps) {
  const [copied, setCopied] = useState(false);

  if (!table) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://${table.qrUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5EFE6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8B2323]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#2D241E]">Thẻ Đặt Bàn &amp; Mã QR</h2>
              <p className="text-[11px] text-[#8A8175]">{table.name} • {table.area}</p>
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

        {/* Standee Preview Card */}
        <div className="p-6 bg-[#FAF7F2] flex justify-center">
          <div className="w-72 bg-white rounded-2xl border-2 border-[#EAE3D6] p-6 text-center shadow-md flex flex-col items-center">
            {/* Logo bistro badge */}
            <div className="w-10 h-10 rounded-full bg-[#8B2323] text-white flex items-center justify-center text-xs font-black shadow-xs mb-2">
              CC
            </div>
            <h3 className="text-sm font-black text-[#8B2323] tracking-widest uppercase">
              CASA COZY
            </h3>
            <p className="text-[9px] font-bold text-[#8A8175] tracking-widest uppercase mb-4">
              BISTRO MANAGEMENT
            </p>

            <div className="w-full border-t border-[#F0EAE1] pt-3 mb-4">
              <span className="text-lg font-black text-[#2D241E] tracking-tight block">
                {table.name.toUpperCase()}
              </span>
              <span className="text-[11px] text-[#8A8175] font-medium">
                {table.area} • {table.seats} Ghế
              </span>
            </div>

            {/* QR Graphic */}
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE3D6] mb-3 shadow-inner">
              {table.qrImage ? (
                <div className="relative w-[150px] h-[150px] flex items-center justify-center mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={table.qrImage}
                    alt={table.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute w-8 h-8 rounded-full bg-[#8B2323] text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-xs">
                    CC
                  </div>
                </div>
              ) : (
                <QRCodeGraphic value={table.qrUrl} size={150} />
              )}
            </div>

            <p className="text-xs font-bold text-[#8B2323] tracking-tight mb-1">
              https://{table.qrUrl}
            </p>
            <p className="text-[10px] text-[#8A8175] max-w-[200px] leading-tight">
              Quét mã QR bằng Camera điện thoại để xem thực đơn &amp; gọi món trực tiếp
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-white border-t border-[#F5EFE6] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#EAE3D6] text-xs font-bold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#10B981]" />
                <span className="text-[#10B981]">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#8A8175]" />
                <span>Sao chép link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDownloadPng(table)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#EAE3D6] text-xs font-bold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#8A8175]" />
            <span>Tải ấn phẩm</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#8B2323] text-white text-xs font-bold hover:bg-[#721C1C] shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>In thẻ bàn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
