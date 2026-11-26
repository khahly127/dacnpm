interface TableCardProps {
  tableName: string;
  subtitle?: string;
  statusText?: string;
  onChangeTable?: () => void;
}

export function TableCard({
  tableName,
  subtitle = 'Sẵn sàng phục vụ',
  statusText = 'Đã kết nối',
  onChangeTable,
}: TableCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EFE9DF] flex items-center justify-between gap-3 transition-all">
      {/* Cụm thông tin bàn bên trái */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Table Icon Badge */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F5EFE6] flex items-center justify-center flex-shrink-0 text-[#8B2323] shadow-xs">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6.5C4 5.95 4.45 5.5 5 5.5H19C19.55 5.5 20 5.95 20 6.5V7.5C20 8.05 19.55 8.5 19 8.5H5C4.45 8.5 4 8.05 4 7.5V6.5Z" />
            <path d="M5.5 9.5H18.5V11H5.5V9.5Z" opacity="0.85" />
            <path d="M6 11L4.8 18.5H6.8L7.8 11H6Z" />
            <path d="M18 11L19.2 18.5H17.2L16.2 11H18Z" />
          </svg>
        </div>

        {/* Tên bàn & dòng chú thích gọn gàng, hiển thị trọn vẹn */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-lg sm:text-[20px] font-bold text-[#231F20] tracking-tight leading-tight truncate">
            {tableName}
          </h2>
          <span className="text-xs text-[#8A7D70] font-medium mt-0.5 whitespace-nowrap">
            {subtitle}
          </span>
        </div>
      </div>

      {/* Cụm trạng thái kết nối & Nút đổi bàn / quét lại */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold select-none shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{statusText}</span>
        </div>

        {onChangeTable && (
          <button
            type="button"
            onClick={onChangeTable}
            title="Đổi số bàn hoặc quét lại mã QR"
            className="text-[11px] text-[#8E2813] hover:text-[#73200F] font-semibold hover:underline transition-colors flex items-center gap-1 cursor-pointer select-none"
          >
            <span>Đổi bàn</span>
            <span className="text-[12px]">⇄</span>
          </button>
        )}
      </div>
    </div>
  );
}
