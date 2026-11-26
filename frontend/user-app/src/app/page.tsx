'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableSession } from '@/hooks/useTableSession';
import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';
import { TableCheckInScreen } from '@/components/checkin/TableCheckInScreen';

function HomePageContent() {
  const searchParams = useSearchParams();
  const { setTable } = useTableSession();

  // null: đang đọc trạng thái ban đầu để tránh chớp giật giao diện (hydration)
  // false: hiển thị màn hình Cổng Quét QR & Nhận Diện Bàn
  // true: đã xác nhận số bàn -> hiển thị màn hình Chào mừng (WelcomeScreen)
  const [hasConfirmedTable, setHasConfirmedTable] = useState<boolean | null>(null);

  useEffect(() => {
    const tableParam = searchParams.get('table') || searchParams.get('b') || searchParams.get('ban');
    const forceScan = searchParams.get('scan') === 'true' || searchParams.get('recheckin') === 'true';

    // 1. Nếu trên URL có truyền số bàn (do quét mã QR dẫn trực tiếp hoặc query param)
    if (tableParam) {
      setTable(tableParam);
      setHasConfirmedTable(true);
      return;
    }

    // 2. Nếu có cờ ép buộc quét lại
    if (forceScan) {
      setHasConfirmedTable(false);
      return;
    }

    // 3. Khách truy cập vào trang chủ mà không có mã bàn trên URL
    // Mở Cổng Quét QR & Nhập số bàn lúc đầu, nhưng giữ nguyên màn hình Chào mừng nếu vừa xác nhận thành công
    setHasConfirmedTable((prev) => (prev === true ? true : false));
  }, [searchParams, setTable]);

  const handleTableConfirmed = (tableId: string) => {
    setTable(tableId);
    setHasConfirmedTable(true);
  };

  const handleChangeTable = () => {
    setHasConfirmedTable(false);
  };

  // Tránh hydration mismatch khi Next.js render trên server
  if (hasConfirmedTable === null) {
    return (
      <div className="h-screen w-full bg-[#EAE3D9] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#8E2813] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Nếu chưa có bàn -> Hiển thị Cổng nhận diện bàn & quét QR
  if (!hasConfirmedTable) {
    return <TableCheckInScreen onTableConfirmed={handleTableConfirmed} />;
  }

  // Đã có bàn -> Hiển thị Màn hình Chào mừng & Gọi món
  return <WelcomeScreen onChangeTable={handleChangeTable} />;
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-[#EAE3D9] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#8E2813] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
