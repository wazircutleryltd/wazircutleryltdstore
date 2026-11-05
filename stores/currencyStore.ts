import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Currency = 'USD' | 'PKR';

export interface CurrencyState {
  currency: Currency;
  usdToPkrRate: number;
  isLoading: boolean;
  lastFetched: number | null;
  setCurrency: (currency: Currency) => void;
  setUsdToPkrRate: (rate: number) => void;
  fetchRate: (force?: boolean) => Promise<number>;
  convertPrice: (amountInUSD: number | string | undefined | null) => number;
  formatPrice: (
    amountInUSD: number | string | undefined | null,
    options?: { showCode?: boolean }
  ) => string;
  getSymbol: () => string;
}

const DEFAULT_USD_TO_PKR_RATE = 280.0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: 'USD',
      usdToPkrRate: DEFAULT_USD_TO_PKR_RATE,
      isLoading: false,
      lastFetched: null,

      setCurrency: (currency: Currency) => {
        set({ currency });
      },

      setUsdToPkrRate: (usdToPkrRate: number) => {
        if (usdToPkrRate > 0) {
          set({ usdToPkrRate, lastFetched: Date.now() });
        }
      },

      fetchRate: async (force = false) => {
        const { lastFetched, usdToPkrRate, isLoading } = get();
        const now = Date.now();

        // Avoid concurrent or redundant calls if recently fetched
        if (!force && lastFetched && now - lastFetched < CACHE_TTL_MS) {
          return usdToPkrRate;
        }

        if (isLoading) return usdToPkrRate;

        try {
          set({ isLoading: true });
          const res = await fetch('/api/settings');
          if (res.ok) {
            const data = await res.json();
            const rate = Number(data?.settings?.usd_to_pkr_rate);
            if (rate && rate > 0) {
              set({ usdToPkrRate: rate, lastFetched: now, isLoading: false });
              return rate;
            }
          }
        } catch (err) {
          console.warn('Could not fetch active exchange rate, retaining current rate:', err);
        } finally {
          set({ isLoading: false });
        }

        return get().usdToPkrRate;
      },

      convertPrice: (amountInUSD) => {
        const val = parseFloat(String(amountInUSD || 0)) || 0;
        const { currency, usdToPkrRate } = get();

        if (currency === 'PKR') {
          // Round to integer for clean rupee pricing
          return Math.round(val * usdToPkrRate);
        }

        return parseFloat(val.toFixed(2));
      },

      formatPrice: (amountInUSD, options) => {
        const val = parseFloat(String(amountInUSD || 0)) || 0;
        const { currency, usdToPkrRate } = get();

        if (currency === 'PKR') {
          const pkrVal = Math.round(val * usdToPkrRate);
          const formatted = pkrVal.toLocaleString('en-PK');
          if (options?.showCode) {
            return `PKR ${formatted}`;
          }
          return `Rs. ${formatted}`;
        }

        const usdFormatted = val.toFixed(2);
        if (options?.showCode) {
          return `$${usdFormatted} USD`;
        }
        return `$${usdFormatted}`;
      },

      getSymbol: () => {
        return get().currency === 'PKR' ? 'Rs.' : '$';
      },
    }),
    {
      name: 'wazir_currency_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currency: state.currency,
        usdToPkrRate: state.usdToPkrRate,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
