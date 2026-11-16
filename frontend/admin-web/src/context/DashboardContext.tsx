'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useDashboard } from '@/hooks/useDashboard';

type DashboardContextType = ReturnType<typeof useDashboard>;

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const dashboardState = useDashboard();

  return (
    <DashboardContext.Provider value={dashboardState}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
