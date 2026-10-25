"use client";

import { useState, useEffect } from "react";
import { 
  useCategoriesQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation 
} from "../../lib/hooks";
import { Button } from "../ui/button";
import { 
  X, 
  Save, 
  RotateCcw, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  DollarSign, 
  Package, 
  Scale, 
  MoveRight, 
  Calendar, 
  Power, 
  Star, 
  TrendingUp, 
  Award, 
  RefreshCw,
  Plus
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/types";

import ProductMediaManager from "./product/ProductMediaManager";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

const BLADE_STEELS = [
  "1095 & 15N20 Damascus",
  "D2 Tool Steel",
  "1095 High Carbon",
  "VG-10 Core Damascus",
  "440C Stainless Steel"
];

const HANDLE_MATERIALS = [
  "Genuine Stag Horn",
  "Stabilized Rosewood",
  "Walnut Burl",
  "Damascus Guard & Horn",
  "Black Canvas Micarta"
];

const HARDNESS_PRESETS = [
  "58-60 HRC",
  "60-62 HRC",
  "56-58 HRC"
];

const TAG_SUGGESTIONS = [
  "Damascus",
  "Hand Forged",
  "Chef Knife",
  "Stag Horn",
  "Hunting Knife",
  "Bushcraft",
  "Full Tang",
  "Leather Sheath"
];

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<string>("identity");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    comparePrice: 0,
    categoryId: "",
    sku: "",
    stockQuantity: 10,
    weight: "",
    productSize: "",
    delivery_date: "Estimated delivery in 2-4 working days",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isBestSelling: false,
    tags: [] as string[]
  });
  
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = useCategoriesQuery();
  const createProductMutation = useCreateProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const generateSku = (name: string): string => {
    const prefix = name ? name.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 6) : "WAZIR";
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix || "WAZIR"}-${rand}`;
  };

  const resetForm = () => {
    setFormData({
      name: "", 
      description: "", 
      shortDescription: "",
      price: 0, 
      comparePrice: 0, 
      categoryId: "",
      sku: generateSku(""), 
      stockQuantity: 10, 
      weight: "",
      productSize: "", 
      delivery_date: "Estimated delivery in 2-4 working days",
      isActive: true, 
      isFeatured: false,
      isTrending: false, 
      isBestSelling: false,
      tags: []
    });
    setMainImagePreview("");
    setAdditionalImages([]);
    setErrors({});
    setActiveTab("identity");
  };

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.short_description || "",
        price: product.price || 0,
        comparePrice: product.compare_price || 0,
        categoryId: product.category_id || "",
        sku: product.sku || generateSku(product.name || ""),
        stockQuantity: product.stock_quantity ?? 10,
        weight: String(product.weight || ""),
        productSize: product.product_size || "",
        delivery_date: product.delivery_date || "Estimated delivery in 2-4 working days",
        isActive: product.is_active !== undefined ? Boolean(product.is_active) : true,
        isFeatured: Boolean(product.is_featured),
        isTrending: Boolean(product.is_trending || product.is_top_rated),
        isBestSelling: Boolean(product.is_best_selling),
        tags: product.tags || []
      });
      setMainImagePreview(product.main_image || "");
      setAdditionalImages(product.images || []);
    } else if (!product && isOpen) {
      resetForm();
    }
    setErrors({});
    setActiveTab("identity");
  }, [product, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && (!product || !product.id) && !prev.sku) {
        updated.sku = generateSku(value);
      }
      return updated;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const addTag = (textToAdd?: string) => {
    const tag = (textToAdd ?? tagInput).trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      if (!textToAdd) setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const appendToDescription = (text: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description ? `${prev.description}\n\n${text}` : text
    }));
    toast.success(`Appended "${text}" to Masterpiece Story`);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Product identity required";
    if (!formData.sku.trim()) e.sku = "SKU required";
    if (!formData.categoryId) e.categoryId = "Market category required";
    if (Number(formData.price) <= 0) e.price = "Valid price > 0 required";
    if (!mainImagePreview) e.mainImage = "Main cover image required";
    if (!formData.description.trim()) e.description = "Detailed story required";

    setErrors(e);

    // Auto-focus the tab containing errors
    if (e.name || e.sku || e.categoryId || e.price) {
      setActiveTab("identity");
    } else if (e.mainImage) {
      setActiveTab("media");
    } else if (e.description) {
      setActiveTab("specs");
    }

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please complete the required fields highlighted in red.");
      return;
    }
    setIsLoading(true);

    try {
      const payload: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        short_description: formData.shortDescription?.trim() || null,
        price: parseFloat(String(formData.price)) || 0,
        compare_price: formData.comparePrice ? parseFloat(String(formData.comparePrice)) : null,
        category_id: formData.categoryId || null,
        sku: formData.sku.trim(),
        stock_quantity: parseInt(String(formData.stockQuantity), 10) || 0,
        weight: formData.weight?.trim() || null,
        product_size: formData.productSize?.trim() || null,
        delivery_date: formData.delivery_date?.trim() || "Estimated delivery in 2-4 working days",
        is_active: Boolean(formData.isActive),
        is_featured: Boolean(formData.isFeatured),
        is_trending: Boolean(formData.isTrending),
        is_top_rated: Boolean(formData.isTrending),
        is_best_selling: Boolean(formData.isBestSelling),
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        main_image: mainImagePreview,
        images: additionalImages || [],
      };

      if (product && product.id) {
        await updateProductMutation.mutateAsync({ id: product.id, updates: payload });
        toast.success("Inventory Refined Successfully");
      } else {
        await createProductMutation.mutateAsync(payload);
        toast.success("New Masterwork Forged & Added to Catalog");
      }
      onClose();
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast.error(error?.message || "The forge failed to save changes.");
    } finally {
      setIsLoading(false);
    }
  };

  const isCloning = Boolean(product && !product.id);
  const isEditing = Boolean(product && product.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0C0D0E]/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="bg-white rounded-[2rem] shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col relative z-50 overflow-hidden border border-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#D6AF66] p-3 rounded-2xl shadow-lg shadow-[#D6AF66]/20">
                  <Save className="h-5 w-5 text-neutral-950 font-bold" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-geist tracking-tight">
                    {isEditing ? "Edit Artisan Piece" : isCloning ? "Clone Piece: Fast Duplicate" : "Create New Masterpiece"}
                  </h2>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    {isEditing ? "Modify Existing Inventory" : isCloning ? "Pre-filled from artisan template" : "Wazir Cutlery Catalog Expansion"}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-neutral-100 rounded-xl transition-all active:scale-95 text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Radix Tabs Controller */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
              {/* Tab Navigation Pill Bar */}
              <div className="px-8 pt-4 pb-3 border-b border-neutral-100 bg-[#FAFAF8]">
                <TabsList className="grid grid-cols-3 w-full max-w-xl h-11 bg-neutral-200/50 p-1 rounded-xl">
                  <TabsTrigger value="identity" className="flex items-center justify-center gap-2 text-xs font-bold font-geist">
                    <FileText className="h-4 w-4" />
                    <span>Identity & Pricing</span>
                    {(errors.name || errors.sku || errors.categoryId || errors.price) && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center justify-center gap-2 text-xs font-bold font-geist">
                    <ImageIcon className="h-4 w-4" />
                    <span>Media & Gallery</span>
                    {errors.mainImage && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="specs" className="flex items-center justify-center gap-2 text-xs font-bold font-geist">
                    <Sparkles className="h-4 w-4" />
                    <span>Cutlery Specs & Story</span>
                    {errors.description && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Scrollable Form Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 min-h-0">
                <form id="product-form" onSubmit={handleSubmit}>
                  {/* TAB 1: IDENTITY & PRICING */}
                  <TabsContent value="identity" className="mt-0 space-y-6 focus-visible:ring-0">
                    {/* Identity & SKU */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                      <div className="md:col-span-8 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                          Masterpiece Identity / Name *
                        </Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="e.g., Damascus Chef Knife with Stag Horn"
                          className={`h-12 rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#D6AF66]/20 font-medium ${errors.name ? "border-rose-400 ring-rose-300/20" : ""}`}
                        />
                        {errors.name && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.name}</p>}
                      </div>

                      <div className="md:col-span-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                            Unique SKU *
                          </Label>
                          <button
                            type="button"
                            onClick={() => handleInputChange("sku", generateSku(formData.name))}
                            className="text-[10px] font-bold text-[#D6AF66] hover:text-[#B89249] flex items-center gap-1"
                            title="Generate unique SKU"
                          >
                            <RefreshCw className="h-3 w-3" /> Auto
                          </button>
                        </div>
                        <Input
                          value={formData.sku}
                          onChange={(e) => handleInputChange("sku", e.target.value)}
                          placeholder="WC-904A"
                          className={`h-12 rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm transition-all focus:bg-white tabular-nums font-mono ${errors.sku ? "border-rose-400 ring-rose-300/20" : ""}`}
                        />
                        {errors.sku && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.sku}</p>}
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                        Market Category *
                      </Label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => handleInputChange("categoryId", e.target.value)}
                        className={`h-12 w-full px-4 rounded-xl border border-neutral-200 bg-neutral-50/50 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#D6AF66]/20 outline-none font-medium
                          ${errors.categoryId ? "border-rose-400 ring-rose-300/20" : ""}`}
                      >
                        <option value="">Select an artisan collection category...</option>
                        {categories?.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {errors.categoryId && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.categoryId}</p>}
                    </div>

                    {/* Pricing & Commercial Values */}
                    <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-geist">Commercial Values</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-neutral-700">List Price (USD) *</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.price || ""}
                              onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                              placeholder="185.00"
                              className={`pl-10 h-11 rounded-xl bg-white border-neutral-200 shadow-sm transition-all focus:ring-2 focus:ring-[#D6AF66]/20 tabular-nums font-bold ${errors.price ? "border-rose-400 ring-rose-300/20" : ""}`}
                            />
                          </div>
                          {errors.price && <p className="text-[10px] font-bold text-rose-500">{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs font-bold text-neutral-700">Comparison (MSRP Strike-through)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                              type="number"
                              step="0.01"
                              value={formData.comparePrice || ""}
                              onChange={(e) => handleInputChange("comparePrice", parseFloat(e.target.value) || 0)}
                              placeholder="240.00"
                              className="pl-10 h-11 rounded-xl bg-white border-neutral-200 shadow-sm transition-all tabular-nums text-neutral-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stock & Delivery Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist flex items-center gap-2">
                          <Package className="h-3.5 w-3.5" /> Units In Stock *
                        </Label>
                        <Input
                          type="number"
                          value={formData.stockQuantity}
                          onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value, 10) || 0)}
                          className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm tabular-nums font-bold"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" /> Delivery Estimate
                        </Label>
                        <Input
                          value={formData.delivery_date}
                          onChange={(e) => handleInputChange("delivery_date", e.target.value)}
                          placeholder="e.g., Estimated delivery in 2-4 working days"
                          className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Strategic Positioning Switches */}
                    <div className="bg-neutral-50 rounded-2xl border border-neutral-100 p-5 space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-geist">Strategic Positioning & Visibility</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                              <Power className="h-4 w-4" />
                            </div>
                            <div>
                              <Label htmlFor="sw-active" className="text-xs font-bold text-neutral-900 cursor-pointer">Market Visibility</Label>
                              <p className="text-[10px] text-neutral-400">Live for public viewing</p>
                            </div>
                          </div>
                          <Switch
                            id="sw-active"
                            checked={Boolean(formData.isActive)}
                            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                              <Star className="h-4 w-4" />
                            </div>
                            <div>
                              <Label htmlFor="sw-featured" className="text-xs font-bold text-neutral-900 cursor-pointer">Elevated Spotlight</Label>
                              <p className="text-[10px] text-neutral-400">Featured artisan showcase</p>
                            </div>
                          </div>
                          <Switch
                            id="sw-featured"
                            checked={Boolean(formData.isFeatured)}
                            onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                              <TrendingUp className="h-4 w-4" />
                            </div>
                            <div>
                              <Label htmlFor="sw-trending" className="text-xs font-bold text-neutral-900 cursor-pointer">Trending Velocity</Label>
                              <p className="text-[10px] text-neutral-400">Show popular badge</p>
                            </div>
                          </div>
                          <Switch
                            id="sw-trending"
                            checked={Boolean(formData.isTrending)}
                            onCheckedChange={(checked) => handleInputChange("isTrending", checked)}
                            className="data-[state=checked]:bg-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-neutral-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
                              <Award className="h-4 w-4" />
                            </div>
                            <div>
                              <Label htmlFor="sw-best" className="text-xs font-bold text-neutral-900 cursor-pointer">Hall of Fame</Label>
                              <p className="text-[10px] text-neutral-400">Top-performer badge</p>
                            </div>
                          </div>
                          <Switch
                            id="sw-best"
                            checked={Boolean(formData.isBestSelling)}
                            onCheckedChange={(checked) => handleInputChange("isBestSelling", checked)}
                            className="data-[state=checked]:bg-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: MEDIA & GALLERY */}
                  <TabsContent value="media" className="mt-0 space-y-6 focus-visible:ring-0">
                    <ProductMediaManager 
                      mainImagePreview={mainImagePreview}
                      additionalImages={additionalImages}
                      onMainImageChange={setMainImagePreview}
                      onAdditionalImagesChange={setAdditionalImages}
                      errors={errors}
                    />
                  </TabsContent>

                  {/* TAB 3: CUTLERY SPECS & STORY */}
                  <TabsContent value="specs" className="mt-0 space-y-6 focus-visible:ring-0">
                    {/* Metallurgy & Handle Presets */}
                    <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-geist">
                          Cutlery Presets (Click to Append to Story)
                        </h4>
                        <span className="text-[10px] text-neutral-400">One-click insertion</span>
                      </div>

                      {/* Blade Steel Presets */}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-bold text-neutral-500">Blade Steel Metallurgy:</Label>
                        <div className="flex flex-wrap gap-2">
                          {BLADE_STEELS.map((steel) => (
                            <button
                              key={steel}
                              type="button"
                              onClick={() => {
                                appendToDescription(`**Blade Steel:** ${steel}`);
                                addTag(steel);
                              }}
                              className="px-3 py-1 bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg hover:border-[#D6AF66] hover:text-[#D6AF66] transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
                            >
                              <Plus className="h-3 w-3 text-neutral-400" /> {steel}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Handle Presets */}
                      <div className="space-y-1.5 pt-2">
                        <Label className="text-[11px] font-bold text-neutral-500">Handle Material:</Label>
                        <div className="flex flex-wrap gap-2">
                          {HANDLE_MATERIALS.map((handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                appendToDescription(`**Handle:** ${handle}`);
                                addTag(handle);
                              }}
                              className="px-3 py-1 bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg hover:border-[#D6AF66] hover:text-[#D6AF66] transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
                            >
                              <Plus className="h-3 w-3 text-neutral-400" /> {handle}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hardness Presets */}
                      <div className="space-y-1.5 pt-2">
                        <Label className="text-[11px] font-bold text-neutral-500">Rockwell Hardness:</Label>
                        <div className="flex flex-wrap gap-2">
                          {HARDNESS_PRESETS.map((hrc) => (
                            <button
                              key={hrc}
                              type="button"
                              onClick={() => {
                                appendToDescription(`**Hardness:** ${hrc}`);
                              }}
                              className="px-3 py-1 bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold rounded-lg hover:border-[#D6AF66] hover:text-[#D6AF66] transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
                            >
                              <Plus className="h-3 w-3 text-neutral-400" /> {hrc}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Weight & Physical Size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist flex items-center gap-2">
                          <Scale className="h-3.5 w-3.5" /> Net Weight
                        </Label>
                        <Input
                          value={formData.weight}
                          onChange={(e) => handleInputChange("weight", e.target.value)}
                          placeholder="e.g., 450g / 1.0 lb"
                          className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist flex items-center gap-2">
                          <MoveRight className="h-3.5 w-3.5" /> Physical Size / Dimensions
                        </Label>
                        <Input
                          value={formData.productSize}
                          onChange={(e) => handleInputChange("productSize", e.target.value)}
                          placeholder="e.g., 12.5 inches overall (7.5 inch blade)"
                          className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Storytelling & Narrative */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                          Brief Summary (One-Liner)
                        </Label>
                        <Textarea
                          value={formData.shortDescription}
                          onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                          placeholder="Hand-forged Damascus blade tailored for precision slicing and timeless outdoor prestige..."
                          rows={2}
                          className="rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm focus:bg-white transition-all resize-none text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                          Detailed Masterpiece Story *
                        </Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Detail the forge technique, heat treatment, handle fit, and sheath craftsmanship..."
                          rows={6}
                          className={`rounded-xl border-neutral-200 bg-neutral-50/50 shadow-sm focus:bg-white transition-all text-sm ${errors.description ? "border-rose-400 ring-rose-300/20" : ""}`}
                        />
                        {errors.description && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.description}</p>}
                      </div>
                    </div>

                    {/* Tags & Quick Recommendations */}
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                        Search & Filter Tags
                      </Label>
                      
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Type a tag and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          className="h-11 rounded-xl border-neutral-200 bg-neutral-50/50 flex-1 text-sm"
                        />
                        <Button 
                          type="button" 
                          onClick={() => addTag()} 
                          variant="outline"
                          className="h-11 px-4 rounded-xl border-neutral-200 font-bold text-xs"
                        >
                          Add Tag
                        </Button>
                      </div>

                      {/* Quick Tag Recommendations */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Popular Quick Tags:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {TAG_SUGGESTIONS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => addTag(tag)}
                              disabled={formData.tags.includes(tag)}
                              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
                                formData.tags.includes(tag)
                                  ? "bg-neutral-100 border-neutral-200 text-neutral-400 opacity-60 cursor-default"
                                  : "bg-white border-neutral-200 text-neutral-600 hover:border-[#D6AF66] hover:text-[#D6AF66] shadow-2xs"
                              }`}
                            >
                              + {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Tag Chips */}
                      {formData.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="px-3 py-1 bg-[#D6AF66]/10 border border-[#D6AF66]/30 text-neutral-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                            >
                              {tag}
                              <button 
                                type="button" 
                                onClick={() => removeTag(tag)} 
                                className="text-neutral-400 hover:text-rose-500 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </form>
              </div>
            </Tabs>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-neutral-100 bg-neutral-50/90 backdrop-blur-md flex items-center justify-between sticky bottom-0 z-10">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={resetForm} 
                className="text-neutral-400 font-bold text-xs hover:text-neutral-800"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> REVERT
              </Button>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  onClick={onClose} 
                  variant="outline" 
                  className="h-11 px-6 rounded-xl font-bold text-xs border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                >
                  CANCEL
                </Button>
                <Button 
                  type="submit" 
                  form="product-form"
                  disabled={isLoading}
                  className="h-11 px-8 rounded-xl font-bold text-xs bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 shadow-lg shadow-[#D6AF66]/20 active:scale-95 transition-all"
                >
                  {isLoading 
                    ? "SAVING..." 
                    : isEditing 
                      ? "UPDATE MASTERPIECE" 
                      : isCloning 
                        ? "FORGE CLONED PIECE" 
                        : "FINALIZE CREATION"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
