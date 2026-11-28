'use strict';

import React from 'react';
import { Download, Printer, MoreVertical, Star } from 'lucide-react';
import { TableItem } from '../../types/table';

interface TableQRCardProps {
  table: TableItem;
  onToggleQr: (id: string) => void;
  onDownloadPng: (table: TableItem) => void;
  onPrintSingle: (table: TableItem) => void;
}

export function QRCodeGraphic({
  value = 'casacozy.vn',
  size = 140,
}: {
  value?: string;
  size?: number;
}) {
  // Deterministic pattern generator based on table value
  const seed = value.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  // Generate 21x21 modules matrix with standard QR markers
  const matrixSize = 21;
  const isCornerMarker = (r: number, c: number) => {
    // Top-left
    if (r < 7 && c < 7) {
      if (r === 0 || r === 6 || c === 0 || c === 6) return true;
      if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    // Top-right
    if (r < 7 && c >= matrixSize - 7) {
      const col = c - (matrixSize - 7);
      if (r === 0 || r === 6 || col === 0 || col === 6) return true;
      if (r >= 2 && r <= 4 && col >= 2 && col <= 4) return true;
      return false;
    }
    // Bottom-left
    if (r >= matrixSize - 7 && c < 7) {
      const row = r - (matrixSize - 7);
      if (row === 0 || row === 6 || c === 0 || c === 6) return true;
      if (row >= 2 && row <= 4 && c >= 2 && c <= 4) return true;
      return false;
    }
    return null;
  };

  const isCenterLogo = (r: number, c: number) => {
    const center = Math.floor(matrixSize / 2);
    return Math.abs(r - center) <= 2 && Math.abs(c - center) <= 2;
  };

  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isCenterLogo(r, c)) continue;

      const marker = isCornerMarker(r, c);
      if (marker !== null) {
        if (marker) cells.push({ r, c });
      } else {
        // pseudo random module
        const pseudoRandom = Math.sin(seed * (r + 1) * 31 + (c + 1) * 17) * 10000;
        if (pseudoRandom - Math.floor(pseudoRandom) > 0.45) {
          cells.push({ r, c });
        }
      }
    }
  }

  const cellSize = size / matrixSize;

  return (
    <div
      className="relative flex items-center justify-center mx-auto"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
      >
        <rect width={size} height={size} fill="#FFFFFF" rx={8} />
        {cells.map((cell, idx) => (
          <rect
            key={idx}
            x={cell.c * cellSize}
            y={cell.r * cellSize}
            width={cellSize * 0.96}
            height={cellSize * 0.96}
            rx={cellSize * 0.25}
            fill="#2D241E"
          />
        ))}
      </svg>

      {/* Casa Cozy Center Logo Badge */}
      <div className="absolute w-7 h-7 rounded-full bg-[#8B2323] text-white flex items-center justify-center text-[9px] font-black border-2 border-white shadow-xs">
        CC
      </div>
    </div>
  );
}

export function TableQRCard({
  table,
  onToggleQr,
  onDownloadPng,
  onPrintSingle,
}: TableQRCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs ${
        table.isVip
          ? 'border-[#E6D4B9] bg-gradient-to-b from-[#FFFDF9] to-white'
          : 'border-[#EAE3D6]'
      }`}
    >
      <div>
        {/* Header: Table Name + Toggle Switch & Dots */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {table.isVip && <Star className="w-3.5 h-3.5 text-[#D97706] fill-current" />}
            <h3 className="text-xs font-bold text-[#2D241E]">
              {table.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle switch with 'Bật' label */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <span
                className={`text-[10px] font-bold ${
                  table.qrEnabled ? 'text-[#10B981]' : 'text-[#8A8175]'
                }`}
              >
                {table.qrEnabled ? 'Bật' : 'Tắt'}
              </span>
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
            </label>

            <button
              type="button"
              className="p-1 text-[#8A8175] hover:text-[#2D241E] rounded-md transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center QR Display Area */}
        <div className="my-3 p-3.5 rounded-xl bg-white border border-[#F0EAE1] flex flex-col items-center justify-center text-center shadow-2xs">
          <div className={table.qrEnabled ? 'opacity-100' : 'opacity-40 grayscale'}>
            {table.qrImage ? (
              <div className="relative w-[130px] h-[130px] flex items-center justify-center mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={table.qrImage}
                  alt={table.name}
                  className="w-full h-full object-contain rounded-lg"
                />
                <div className="absolute w-7 h-7 rounded-full bg-[#8B2323] text-white flex items-center justify-center text-[9px] font-black border-2 border-white shadow-xs">
                  CC
                </div>
              </div>
            ) : (
              <QRCodeGraphic value={table.qrUrl} size={130} />
            )}
          </div>

          <span className="text-xs font-bold text-[#2D241E] mt-2 tracking-tight">
            {table.qrUrl}
          </span>
        </div>
      </div>

      {/* Footer buttons: Tải PNG & In lẻ */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#F5EFE6]">
        <button
          type="button"
          onClick={() => onDownloadPng(table)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border border-[#EAE3D6] bg-white text-xs font-semibold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#8A8175]" />
          <span>Tải PNG</span>
        </button>

        <button
          type="button"
          onClick={() => onPrintSingle(table)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
            table.isVip
              ? 'bg-[#8B2323] text-white border-[#8B2323] hover:bg-[#721C1C]'
              : 'border-[#EAE3D6] bg-white text-[#5C5449] hover:bg-[#FAF7F2]'
          }`}
        >
          <Printer className={`w-3.5 h-3.5 ${table.isVip ? 'text-white' : 'text-[#8A8175]'}`} />
          <span>In lẻ</span>
        </button>
      </div>
    </div>
  );
}
