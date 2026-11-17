'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableSession } from '@/hooks/useTableSession';
import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';

function WelcomeQueryHandler() {
  const searchParams = useSearchParams();
  const { setTable } = useTableSession();

  useEffect(() => {
    const tableParam = searchParams.get('table') || searchParams.get('b') || searchParams.get('ban');
    if (tableParam) {
      setTable(tableParam);
    }
  }, [searchParams, setTable]);

  return <WelcomeScreen />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<WelcomeScreen />}>
      <WelcomeQueryHandler />
    </Suspense>
  );
}
