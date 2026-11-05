"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Globe, 
  Mail, 
  Shield, 
  Bell, 
  Sparkles, 
  Truck, 
  Share2, 
  RotateCcw, 
  Building2, 
  Check, 
  Bot,
  Phone,
  Coins,
  RefreshCw,
  ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useSettingsStore, DEFAULT_STORE_SETTINGS, type StoreSettings } from "@/stores/settingsStore";

const DEFAULT_SETTINGS = DEFAULT_STORE_SETTINGS;

export default function SettingsClient() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingLiveRate, setIsFetchingLiveRate] = useState(false);

  useEffect(() => {
    // 1. First sync with local store
    const local = useSettingsStore.getState().settings;
    if (local) {
      setSettings((prev) => ({ ...prev, ...local }));
    }

    // 2. Fetch authoritative database settings from /api/settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          const fetched = data.settings;
          const merged: StoreSettings = {
            ...DEFAULT_SETTINGS,
            ...fetched,
            usdToPkrRate: Number(fetched.usdToPkrRate || fetched.usd_to_pkr_rate || DEFAULT_SETTINGS.usdToPkrRate),
            freeShippingThreshold: Number(fetched.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold),
            standardShippingFee: Number(fetched.standardShippingFee ?? DEFAULT_SETTINGS.standardShippingFee),
            enableCurrencySwitcher: fetched.enableCurrencySwitcher !== false,
            allowGptBot: fetched.allowGptBot !== false,
            allowClaudeBot: fetched.allowClaudeBot !== false,
            allowPerplexityBot: fetched.allowPerplexityBot !== false,
            allowGoogleExtended: fetched.allowGoogleExtended !== false,
          };
          setSettings(merged);
          useSettingsStore.getState().setSettings(merged);
          useCurrencyStore.getState().setUsdToPkrRate(merged.usdToPkrRate);
        }
      })
      .catch((err) => console.warn('Could not load api settings:', err));
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFetchLiveRate = async () => {
    setIsFetchingLiveRate(true);
    try {
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      if (!res.ok) throw new Error("Forex service unavailable");
      const data = await res.json();
      const livePkr = Number(data?.rates?.PKR);

      if (livePkr && livePkr > 0) {
        const roundedRate = parseFloat(livePkr.toFixed(2));
        handleChange("usdToPkrRate", roundedRate);
        toast.success(`Live interbank rate fetched: 1 USD = ${roundedRate} PKR. Adjust if needed and click Save.`);
      } else {
        toast.warning("Could not determine PKR rate from forex provider.");
      }
    } catch (err: any) {
      console.warn("Live rate fetch failed:", err);
      toast.error("Could not reach live forex service. You can set the rate manually.");
    } finally {
      setIsFetchingLiveRate(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: StoreSettings = {
        ...settings,
        usdToPkrRate: Number(settings.usdToPkrRate) || 280.0,
        freeShippingThreshold: Number(settings.freeShippingThreshold) || 150,
        standardShippingFee: Number(settings.standardShippingFee) || 19.99,
      };

      // 1. Persist entire settings payload to database via /api/settings
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const savedSettings: StoreSettings = data?.settings || payload;

      // 2. Update reactive zustand stores
      useSettingsStore.getState().setSettings(savedSettings);
      useCurrencyStore.getState().setUsdToPkrRate(savedSettings.usdToPkrRate);

      // 3. Persist to localStorage for offline resilience
      localStorage.setItem("wazir_store_settings", JSON.stringify(savedSettings));
      setSettings(savedSettings);

      setTimeout(() => {
        setIsSaving(false);
        toast.success("Storefront, Logistics, SEO & Currency Settings Saved Successfully");
      }, 300);
    } catch (e) {
      console.error("Save settings error:", e);
      setIsSaving(false);
      toast.error("Failed to save settings to server.");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all settings to forge factory defaults?")) {
      setIsSaving(true);
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_SETTINGS),
        });
        setSettings(DEFAULT_SETTINGS);
        useSettingsStore.getState().setSettings(DEFAULT_SETTINGS);
        useCurrencyStore.getState().setUsdToPkrRate(DEFAULT_SETTINGS.usdToPkrRate);
        localStorage.removeItem("wazir_store_settings");
        toast.info("Settings reset to forge defaults.");
      } catch (err) {
        console.error("Reset error:", err);
        toast.error("Failed to reset settings.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 font-geist tracking-tight">
            Storefront & AI Forge Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure global store identity, AI engine discoverability, logistics rules, and direct contact channels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-900"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Revert
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 px-6 rounded-xl bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 font-bold text-xs shadow-lg shadow-[#D6AF66]/20 transition-all active:scale-95"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-12 bg-neutral-200/50 p-1 rounded-xl">
          <TabsTrigger value="identity" className="text-xs font-bold font-geist flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Store Identity
          </TabsTrigger>
          <TabsTrigger value="ai-seo" className="text-xs font-bold font-geist flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#D6AF66]" /> AI & GEO SEO
          </TabsTrigger>
          <TabsTrigger value="logistics" className="text-xs font-bold font-geist flex items-center gap-2">
            <Truck className="h-4 w-4" /> Logistics & Orders
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs font-bold font-geist flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Social & Contacts
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Store Identity */}
        <TabsContent value="identity" className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-geist">General Forge Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Official Brand / Store Name</Label>
                <Input
                  value={settings.storeName}
                  onChange={(e) => handleChange("storeName", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Operating Base Currency</Label>
                <Input
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-bold"
                  placeholder="USD ($)"
                />
              </div>
            </div>

            {/* Currency & USD to PKR Conversion Engine */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-neutral-50 via-white to-amber-50/30 rounded-2xl border border-[#D6AF66]/35 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/70">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#D6AF66]/15 rounded-xl text-[#9E7B35]">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 font-geist flex items-center gap-2">
                      Multi-Currency & Conversion Engine
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#D6AF66]/20 text-[#8C6D23] font-bold">
                        Live Storefront Sync
                      </span>
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Base catalog prices are in USD ($). Pakistani patrons can view, cart, and place COD orders in PKR (Rs.) using this conversion rate.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFetchLiveRate}
                  disabled={isFetchingLiveRate}
                  className="h-9 px-3.5 rounded-xl border-[#D6AF66]/40 hover:bg-[#D6AF66]/10 text-xs font-bold text-neutral-800 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-[#9E7B35] ${isFetchingLiveRate ? "animate-spin" : ""}`} />
                  {isFetchingLiveRate ? "Fetching..." : "Fetch Live Market Rate"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                    <span>USD to PKR Conversion Rate</span>
                    <span className="text-[11px] font-mono text-[#9E7B35] font-semibold">
                      1 USD = {Number(settings.usdToPkrRate || 280).toFixed(2)} PKR
                    </span>
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ArrowRightLeft className="h-4 w-4 text-neutral-400" />
                    </div>
                    <Input
                      type="number"
                      step="0.5"
                      min="1"
                      value={settings.usdToPkrRate ?? 280}
                      onChange={(e) => handleChange("usdToPkrRate", parseFloat(e.target.value) || 0)}
                      className="pl-9 h-11 rounded-xl bg-white border-neutral-300 font-mono text-sm font-bold text-neutral-900 focus:border-[#D6AF66]"
                      placeholder="e.g. 280"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Change this anytime. All storefront products, cart items, and order calculations will immediately recompute.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-neutral-800">
                    Storefront Currency Switcher
                  </Label>
                  <div className="flex items-center justify-between h-11 px-4 bg-white rounded-xl border border-neutral-200">
                    <span className="text-xs font-medium text-neutral-700">
                      Enable USD ($) / PKR (Rs.) Navbar Toggle
                    </span>
                    <Switch
                      checked={settings.enableCurrencySwitcher !== false}
                      onCheckedChange={(checked) => handleChange("enableCurrencySwitcher", checked)}
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Allows visitors on desktop and mobile to seamlessly switch their view between USD and PKR.
                  </p>
                </div>
              </div>

              {/* Live Conversion Preview Card */}
              <div className="bg-white/90 rounded-xl p-4 border border-neutral-200/80">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5 font-geist">
                  Live Price Conversion Preview
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                    <div className="text-xs text-neutral-500">Utility Knife ($50.00)</div>
                    <div className="text-sm font-bold text-neutral-900 mt-1 font-mono">
                      Rs. {Math.round(50 * (Number(settings.usdToPkrRate) || 280)).toLocaleString("en-PK")}
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                    <div className="text-xs text-neutral-500">Damascus Chef Knife ($120.00)</div>
                    <div className="text-sm font-bold text-[#8C6D23] mt-1 font-mono">
                      Rs. {Math.round(120 * (Number(settings.usdToPkrRate) || 280)).toLocaleString("en-PK")}
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/60">
                    <div className="text-xs text-neutral-500">Collector Broadsword ($280.00)</div>
                    <div className="text-sm font-bold text-neutral-900 mt-1 font-mono">
                      Rs. {Math.round(280 * (Number(settings.usdToPkrRate) || 280)).toLocaleString("en-PK")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-neutral-700">Artisan Tagline</Label>
              <Input
                value={settings.storeTagline}
                onChange={(e) => handleChange("storeTagline", e.target.value)}
                className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-neutral-700">Historic Forge Physical Location</Label>
              <Textarea
                rows={2}
                value={settings.storeAddress}
                onChange={(e) => handleChange("storeAddress", e.target.value)}
                className="rounded-xl bg-neutral-50/50 border-neutral-200 text-sm"
              />
            </div>

            <div className="p-4 bg-neutral-50/80 rounded-2xl border border-[#D6AF66]/30 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#D6AF66]" />
                  International Client Relations Manager (Tayyab Mughal)
                </Label>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D6AF66]/15 text-[#9E7B35]">
                  Primary International WhatsApp
                </span>
              </div>
              <Input
                value={settings.storeInternationalPhone || "+92 316 0764052"}
                onChange={(e) => handleChange("storeInternationalPhone", e.target.value)}
                className="h-11 rounded-xl bg-white border-neutral-200 font-mono text-xs font-medium"
                placeholder="+92 316 0764052"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Support Email</Label>
                <Input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleChange("storeEmail", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Primary Phone (Hassan)</Label>
                <Input
                  value={settings.storePhone}
                  onChange={(e) => handleChange("storePhone", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Secondary WhatsApp (Qamar)</Label>
                <Input
                  value={settings.storeWhatsapp}
                  onChange={(e) => handleChange("storeWhatsapp", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: AI & GEO SEO */}
        <TabsContent value="ai-seo" className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D6AF66]/15 rounded-xl text-[#D6AF66]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-geist">
                  Generative Engine Optimization (GEO) & LLM Search
                </h3>
                <p className="text-xs text-neutral-400">
                  Control how AI systems (ChatGPT, Perplexity, Claude, Gemini) comprehend and cite Wazir Cutlery.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-neutral-700">
                Core Knowledge Corpus (Injected into llms.txt & AI Search engines)
              </Label>
              <Textarea
                rows={4}
                value={settings.brandSummary}
                onChange={(e) => handleChange("brandSummary", e.target.value)}
                className="rounded-xl bg-neutral-50/50 border-neutral-200 text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Global Title Template</Label>
                <Input
                  value={settings.metaTitle}
                  onChange={(e) => handleChange("metaTitle", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Default Meta Description</Label>
                <Input
                  value={settings.metaDescription}
                  onChange={(e) => handleChange("metaDescription", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 text-sm"
                />
              </div>
            </div>

            {/* AI Bot Permissions Switch Grid */}
            <div className="pt-2 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                AI Discovery & Crawler Permissions (robots.txt & sitemap.xml)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div>
                    <Label className="text-xs font-bold text-neutral-900">OpenAI GPTBot & Search</Label>
                    <p className="text-[10px] text-neutral-400">ChatGPT answer citations & browse</p>
                  </div>
                  <Switch
                    checked={settings.allowGptBot}
                    onCheckedChange={(c) => handleChange("allowGptBot", c)}
                    className="data-[state=checked]:bg-[#D6AF66]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div>
                    <Label className="text-xs font-bold text-neutral-900">Anthropic ClaudeBot</Label>
                    <p className="text-[10px] text-neutral-400">Claude generative answer indexing</p>
                  </div>
                  <Switch
                    checked={settings.allowClaudeBot}
                    onCheckedChange={(c) => handleChange("allowClaudeBot", c)}
                    className="data-[state=checked]:bg-[#D6AF66]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div>
                    <Label className="text-xs font-bold text-neutral-900">Perplexity AI Bot</Label>
                    <p className="text-[10px] text-neutral-400">Perplexity answer engine citations</p>
                  </div>
                  <Switch
                    checked={settings.allowPerplexityBot}
                    onCheckedChange={(c) => handleChange("allowPerplexityBot", c)}
                    className="data-[state=checked]:bg-[#D6AF66]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div>
                    <Label className="text-xs font-bold text-neutral-900">Google Extended / Gemini</Label>
                    <p className="text-[10px] text-neutral-400">Google AI Overviews & Gemini snapshots</p>
                  </div>
                  <Switch
                    checked={settings.allowGoogleExtended}
                    onCheckedChange={(c) => handleChange("allowGoogleExtended", c)}
                    className="data-[state=checked]:bg-[#D6AF66]"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Logistics & Orders */}
        <TabsContent value="logistics" className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-geist">Shipping & Fulfillment Rules</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Free International Shipping Minimum ($ USD)</Label>
                <Input
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => handleChange("freeShippingThreshold", parseFloat(e.target.value) || 0)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 tabular-nums font-bold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Flat Rate Shipping Fee ($ USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.standardShippingFee}
                  onChange={(e) => handleChange("standardShippingFee", parseFloat(e.target.value) || 0)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 tabular-nums font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-neutral-700">Default Delivery Timeline Promise</Label>
              <Input
                value={settings.deliveryTimeline}
                onChange={(e) => handleChange("deliveryTimeline", e.target.value)}
                className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-neutral-700">Integrated International Couriers</Label>
              <Input
                value={settings.couriers}
                onChange={(e) => handleChange("couriers", e.target.value)}
                className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab 4: Social & Contacts */}
        <TabsContent value="social" className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-neutral-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 font-geist">Social Handles & Direct Channels</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Official WhatsApp Hotline URL</Label>
                <Input
                  value={settings.whatsappUrl}
                  onChange={(e) => handleChange("whatsappUrl", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">Instagram Profile URL</Label>
                <Input
                  value={settings.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">YouTube Channel URL</Label>
                <Input
                  value={settings.youtubeUrl}
                  onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-neutral-700">TikTok Profile URL</Label>
                <Input
                  value={settings.tiktokUrl}
                  onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
