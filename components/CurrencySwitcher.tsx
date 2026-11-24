'use client';

import React from 'react';

interface CurrencySwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export default function CurrencySwitcher({ className = '' }: CurrencySwitcherProps) {
  // Store operates natively and exclusively in PKR
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 border border-neutral-200/90 rounded-xl text-xs font-bold text-neutral-800 ${className}`}>
      <span>🇵🇰</span>
      <span className="font-mono text-[11px] text-[#8C6D23]">PKR (Rs.)</span>
    </div>
  );
}
