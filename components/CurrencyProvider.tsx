'use client';

import React, { useEffect } from 'react';
import { useCurrencyStore } from '@/stores/currencyStore';

export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const fetchRate = useCurrencyStore((state) => state.fetchRate);

  useEffect(() => {
    // Refresh exchange rate from admin settings on application boot
    fetchRate();
  }, [fetchRate]);

  return <>{children}</>;
}

