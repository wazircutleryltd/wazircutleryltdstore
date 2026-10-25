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
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  // Store Identity
  storeName: "Wazir Cutlery Ltd",
  storeTagline: "Master-Forged Damascus Knives & Authentic Stag Horn Cutlery",
  storeEmail: "info@wazircutlery.com",
  storePhone: "+92 308 0601995",
  storeWhatsapp: "+92 312 6209302",
  storeAddress: "Near High Class Bakers, G.T. Road, Wazirabad, Punjab, 52000, Pakistan",
  currency: "USD ($)",
  
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
  whatsappUrl: "https://wa.me/+923080601995",
  instagramUrl: "https://www.instagram.com/wazircutlery",
  youtubeUrl: "https://youtube.com/@wazircutleryltd",
  tiktokUrl: "https://www.tiktok.com/@wazircutlery"
};

export default function SettingsClient() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wazir_store_settings");
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.warn("Could not load stored settings:", e);
    }
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("wazir_store_settings", JSON.stringify(settings));
      setTimeout(() => {
        setIsSaving(false);
        toast.success("Store & AI SEO Settings Saved Successfully");
      }, 400);
    } catch (e) {
      setIsSaving(false);
      toast.error("Failed to save settings to storage.");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all settings to forge factory defaults?")) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.removeItem("wazir_store_settings");
      toast.info("Settings reset to defaults.");
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
                <Label className="text-xs font-bold text-neutral-700">Operating Currency</Label>
                <Input
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="h-11 rounded-xl bg-neutral-50/50 border-neutral-200 font-bold"
                />
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
