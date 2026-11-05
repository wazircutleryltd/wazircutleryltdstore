'use client';

import React, { useEffect } from 'react';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useSettingsStore } from '@/stores/settingsStore';

export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const fetchRate = useCurrencyStore((state) => state.fetchRate);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useEffect(() => {
    // Refresh exchange rate and global store settings from database on application boot
    fetchRate();
    fetchSettings();
  }, [fetchRate, fetchSettings]);

  return <>{children}</>;
}

