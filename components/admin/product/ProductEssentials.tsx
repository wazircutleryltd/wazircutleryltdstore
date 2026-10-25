"use client";

import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { X } from "lucide-react";
import type { Category } from "@/types";

interface ProductEssentialsProps {
  formData: {
    name: string;
    sku: string;
    categoryId: string;
    shortDescription: string;
    description: string;
    tags: string[];
    [key: string]: any;
  };
  handleInputChange: (field: string, value: any) => void;
  categories?: Category[];
  tagInput: string;
  setTagInput: (val: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  errors: Record<string, string>;
}

export default function ProductEssentials({ 
  formData, 
  handleInputChange, 
  categories, 
  tagInput, 
  setTagInput, 
  addTag, 
  removeTag, 
  errors 
}: ProductEssentialsProps) {
  return (
    <div className="space-y-6">
      {/* Name & SKU Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist">Product Identity *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Damascus Chef Knife"
            className={`h-12 rounded-xl border-gray-100 bg-gray-50/50 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#D6AF66]/20 ${errors.name ? 'border-rose-300' : ''}`}
          />
          {errors.name && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist">Unique SKU *</Label>
          <Input
            value={formData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            placeholder="WC-001"
            className={`h-12 rounded-xl border-gray-100 bg-gray-50/50 shadow-sm transition-all focus:bg-white tabular-nums ${errors.sku ? 'border-rose-300' : ''}`}
          />
          {errors.sku && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.sku}</p>}
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist">Market Category *</Label>
        <select
          value={formData.categoryId}
          onChange={(e) => handleInputChange("categoryId", e.target.value)}
          className={`h-12 w-full px-4 rounded-xl border border-gray-100 bg-gray-50/50 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#D6AF66]/20 outline-none
            ${errors.categoryId ? 'border-rose-300' : ''}`}
        >
          <option value="">Choose a category...</option>
          {categories?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.categoryId}</p>}
      </div>

      {/* Narrative Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist">Brief Summary</Label>
          <Textarea
            value={formData.shortDescription}
            onChange={(e) => handleInputChange("shortDescription", e.target.value)}
            placeholder="Catchy one-liner for search results..."
            rows={2}
            className="rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:bg-white transition-all resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist">Detailed Story *</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the craftsmanship, materials, and heritage..."
            rows={5}
            className={`rounded-xl border-gray-100 bg-gray-50/50 shadow-sm focus:bg-white transition-all ${errors.description ? 'border-rose-300' : ''}`}
          />
          {errors.description && <p className="text-[10px] font-bold text-rose-500 tracking-wide">{errors.description}</p>}
        </div>
      </div>

      {/* Tag Architecture */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist">Search Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Press Enter to add tag"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="h-10 rounded-xl border-gray-100 bg-gray-50/50 flex-1"
          />
        </div>
        {formData.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {formData.tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-white border border-gray-100 text-[#D6AF66] text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-sm hover:border-[#D6AF66]/30 transition-colors">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-rose-500 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
