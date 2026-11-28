'use client';

import { use, useEffect } from 'react';
import { useTableSession } from '@/hooks/useTableSession';
import { WelcomeScreen } from '@/components/welcome/WelcomeScreen';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TableQrPage({ params }: PageProps) {
  const { id } = use(params);
  const { setTable } = useTableSession();

  useEffect(() => {
    if (id) {
      setTable(id);
    }
  }, [id, setTable]);

  return <WelcomeScreen />;
}
