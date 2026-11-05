'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCurrencyStore, type Currency } from '@/stores/currencyStore';
import { toast } from 'sonner';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export default function CurrencySwitcher({ className = '', variant = 'compact' }: CurrencySwitcherProps) {
  const { currency, setCurrency, usdToPkrRate } = useCurrencyStore();

  const handleSelect = (next: Currency) => {
    if (next === currency) return;
    setCurrency(next);
    toast.success(
      next === 'PKR' 
        ? `Switched to PKR (₨) • Rate: 1 USD = ${usdToPkrRate} PKR` 
        : `Switched to USD ($) • International Currency`,
      { duration: 2500 }
    );
  };

  if (variant === 'full') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between text-xs text-neutral-500 font-medium px-1">
          <span>Select Currency</span>
          <span className="font-mono text-[11px] text-[#8C6D23]">1 USD = {usdToPkrRate} PKR</span>
        </div>
        <div className="grid grid-cols-2 p-1 bg-neutral-200/60 rounded-xl border border-neutral-200">
          <button
            type="button"
            onClick={() => handleSelect('USD')}
            className={`relative py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currency === 'USD' ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {currency === 'USD' && (
              <motion.div
                layoutId="currency-indicator-mobile"
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <span>🇺🇸</span>
              <span>USD ($)</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSelect('PKR')}
            className={`relative py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currency === 'PKR' ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {currency === 'PKR' && (
              <motion.div
                layoutId="currency-indicator-mobile"
                className="absolute inset-0 bg-white rounded-lg shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <span>🇵🇰</span>
              <span>PKR (Rs)</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center p-1 bg-white/90 border border-neutral-200/90 rounded-xl shadow-2xs backdrop-blur-xs ${className}`}>
      <button
        type="button"
        onClick={() => handleSelect('USD')}
        className={`relative px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          currency === 'USD' ? 'text-neutral-950 font-extrabold' : 'text-neutral-500 hover:text-neutral-800'
        }`}
        title="View prices in US Dollars"
        aria-label="Set currency to USD"
      >
        {currency === 'USD' && (
          <motion.div
            layoutId="currency-indicator-desktop"
            className="absolute inset-0 bg-[#D6AF66]/20 border border-[#D6AF66]/50 rounded-lg shadow-2xs"
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          <span className="text-[11px]">USD</span>
          <span className="text-[10px] text-neutral-400 font-mono">$</span>
        </span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect('PKR')}
        className={`relative px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          currency === 'PKR' ? 'text-neutral-950 font-extrabold' : 'text-neutral-500 hover:text-neutral-800'
        }`}
        title={`View prices in Pakistani Rupees (1 USD = ${usdToPkrRate} PKR)`}
        aria-label="Set currency to PKR"
      >
        {currency === 'PKR' && (
          <motion.div
            layoutId="currency-indicator-desktop"
            className="absolute inset-0 bg-[#D6AF66]/20 border border-[#D6AF66]/50 rounded-lg shadow-2xs"
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1">
          <span className="text-[11px]">PKR</span>
          <span className="text-[10px] text-neutral-400 font-mono">₨</span>
        </span>
      </button>
    </div>
  );
}

