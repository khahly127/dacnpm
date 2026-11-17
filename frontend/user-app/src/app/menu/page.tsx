'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableSession } from '@/hooks/useTableSession';
import { MenuScreen } from '@/components/menu/MenuScreen';

function MenuQueryHandler() {
  const searchParams = useSearchParams();
  const { setTable } = useTableSession();

  useEffect(() => {
    const tableParam =
      searchParams.get('table') ||
      searchParams.get('b') ||
      searchParams.get('ban');
    if (tableParam) {
      setTable(tableParam);
    }
  }, [searchParams, setTable]);

  return <MenuScreen />;
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-sm font-semibold text-[#8B2323]">
          Đang tải thực đơn...
        </div>
      }
    >
      <MenuQueryHandler />
    </Suspense>
  );
}
