import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCurrencyStore } from './currencyStore';

export interface StoreSettings {
  // Store Identity & Currency
  storeName: string;
  storeTagline: string;
  storeEmail: string;
  storeInternationalPhone: string;
  storePhone: string;
  storeWhatsapp: string;
  storeAddress: string;
  currency: string;
  usdToPkrRate: number;
  enableCurrencySwitcher: boolean;

  // AI & SEO Configuration
  brandSummary: string;
  metaTitle: string;
  metaDescription: string;
  allowGptBot: boolean;
  allowClaudeBot: boolean;
  allowPerplexityBot: boolean;
  allowGoogleExtended: boolean;

  // Logistics & Delivery
  deliveryTimeline: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  couriers: string;

  // Social & Community
  whatsappUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  updated_at?: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  // Store Identity & Currency
  storeName: "Wazir Cutlery Ltd",
  storeTagline: "Master-Forged Damascus Knives & Premium Wazir Cutlery",
  storeEmail: "info@wazircutlery.com",
  storeInternationalPhone: "+92 316 0764052",
  storePhone: "+92 308 0601995",
  storeWhatsapp: "+92 312 6209302",
  storeAddress: "Near High Class Bakers, G.T. Road, Wazirabad, Punjab, 52000, Pakistan",
  currency: "USD ($)",
  usdToPkrRate: 280.0,
  enableCurrencySwitcher: true,

  // AI & SEO Configuration
  brandSummary: "Wazir Cutlery Ltd is an artisanal cutlery forge based in Wazirabad, Pakistan—the centuries-old cutlery capital of South Asia. Specializing in high-carbon 1095 and 15N20 pattern-welded Damascus steel blades, authentic stag horn antler handles, and custom collector swords.",
  metaTitle: "Wazir Cutlery | Handcrafted Damascus Knives & Swords",
  metaDescription: "Exquisite handcrafted knives, swords, and chef cutlery forged from Damascus steel and stag horn in Wazirabad. Worldwide shipping with artisan guarantee.",
  allowGptBot: true,
  allowClaudeBot: true,
  allowPerplexityBot: true,
  allowGoogleExtended: true,

  // Logistics & Delivery
  deliveryTimeline: "Estimated delivery in 2-4 working days",
  freeShippingThreshold: 150,
  standardShippingFee: 19.99,
  couriers: "DHL Express, FedEx International Priority, EMS",

  // Social & Community
  whatsappUrl: "https://wa.me/923160764052",
  instagramUrl: "https://www.instagram.com/wazircutlery",
  youtubeUrl: "https://youtube.com/@wazircutleryltd",
  tiktokUrl: "https://www.tiktok.com/@wazircutlery",
};

interface SettingsState {
  settings: StoreSettings;
  isLoading: boolean;
  isHydrated: boolean;
  setSettings: (newSettings: Partial<StoreSettings>) => void;
  fetchSettings: () => Promise<StoreSettings>;
  setHydrated: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_STORE_SETTINGS,
      isLoading: false,
      isHydrated: false,

      setSettings: (newSettings: Partial<StoreSettings>) => {
        set((state) => {
          const updated = {
            ...state.settings,
            ...newSettings,
            usdToPkrRate: Number(newSettings.usdToPkrRate ?? state.settings.usdToPkrRate),
            freeShippingThreshold: Number(newSettings.freeShippingThreshold ?? state.settings.freeShippingThreshold),
            standardShippingFee: Number(newSettings.standardShippingFee ?? state.settings.standardShippingFee),
          };

          // Automatically sync currency store if rate changed
          if (updated.usdToPkrRate && updated.usdToPkrRate !== useCurrencyStore.getState().usdToPkrRate) {
            useCurrencyStore.getState().setUsdToPkrRate(updated.usdToPkrRate);
          }

          return { settings: updated };
        });
      },

      fetchSettings: async () => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/settings');
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const data = await res.json();
          if (data?.settings) {
            const apiSettings = data.settings;
            const merged: StoreSettings = {
              ...DEFAULT_STORE_SETTINGS,
              ...apiSettings,
              usdToPkrRate: Number(apiSettings.usdToPkrRate || apiSettings.usd_to_pkr_rate || DEFAULT_STORE_SETTINGS.usdToPkrRate),
              freeShippingThreshold: Number(apiSettings.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold),
              standardShippingFee: Number(apiSettings.standardShippingFee ?? DEFAULT_STORE_SETTINGS.standardShippingFee),
              enableCurrencySwitcher: apiSettings.enableCurrencySwitcher !== false,
              allowGptBot: apiSettings.allowGptBot !== false,
              allowClaudeBot: apiSettings.allowClaudeBot !== false,
              allowPerplexityBot: apiSettings.allowPerplexityBot !== false,
              allowGoogleExtended: apiSettings.allowGoogleExtended !== false,
            };

            set({ settings: merged, isLoading: false, isHydrated: true });

            // Sync with currency store
            if (merged.usdToPkrRate) {
              useCurrencyStore.getState().setUsdToPkrRate(merged.usdToPkrRate);
            }

            return merged;
          }
        } catch (error) {
          console.warn('Could not fetch store settings from API, using cached/defaults:', error);
        } finally {
          set({ isLoading: false, isHydrated: true });
        }
        return get().settings;
      },

      setHydrated: (val: boolean) => set({ isHydrated: val }),
    }),
    {
      name: 'wazir_store_settings',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
          // If rate in storage differs, sync currency store
          if (state.settings.usdToPkrRate) {
            useCurrencyStore.getState().setUsdToPkrRate(state.settings.usdToPkrRate);
          }
        }
      },
    }
  )
);
