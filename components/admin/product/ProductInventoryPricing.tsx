"use client";

import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { DollarSign, Package, Scale, MoveRight, Calendar } from "lucide-react";

interface ProductInventoryPricingProps {
  formData: {
    price: number | string;
    comparePrice?: number | string;
    stockQuantity: number | string;
    weight?: string;
    productSize?: string;
    delivery_date?: string;
    [key: string]: any;
  };
  handleInputChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function ProductInventoryPricing({ 
  formData, 
  handleInputChange, 
  errors 
}: ProductInventoryPricingProps) {
  return (
    <div className="space-y-8">
      {/* Financials Grid */}
      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4 shadow-inner">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-geist">Commercial Values</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-600">List Price *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                className={`pl-9 h-11 rounded-xl bg-white border-gray-100 shadow-sm transition-all focus:ring-2 focus:ring-emerald-500/20 tabular-nums ${errors.price ? 'border-rose-300 ring-rose-300/20' : ''}`}
              />
            </div>
            {errors.price && <p className="text-[10px] font-bold text-rose-500">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-600">Comparison (MSRP)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) => handleInputChange("comparePrice", parseFloat(e.target.value) || 0)}
                className="pl-9 h-11 rounded-xl bg-white border-gray-100 shadow-sm transition-all grayscale opacity-60 focus:grayscale-0 focus:opacity-100 tabular-nums"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logistics & Meta Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist flex items-center gap-2">
            <Package className="h-3.5 w-3.5" /> Stock Availability *
          </Label>
          <Input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => handleInputChange("stockQuantity", parseInt(e.target.value) || 0)}
            className={`h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-sm tabular-nums ${errors.stockQuantity ? 'border-rose-300' : ''}`}
          />
          {errors.stockQuantity && <p className="text-[10px] font-bold text-rose-500">{errors.stockQuantity}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist flex items-center gap-2">
            <Scale className="h-3.5 w-3.5" /> Net Weight
          </Label>
          <Input
            value={formData.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="e.g., 450g / 1.2kg"
            className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist flex items-center gap-2">
            <MoveRight className="h-3.5 w-3.5" /> Physical Size
          </Label>
          <Input
            value={formData.productSize}
            onChange={(e) => handleInputChange("productSize", e.target.value)}
            placeholder="e.g., 18.5 inches overall"
            className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 font-geist flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> Est. Global Logistics
          </Label>
          <Input
            value={formData.delivery_date}
            onChange={(e) => handleInputChange("delivery_date", e.target.value)}
            placeholder="e.g., 5-7 Business Days"
            className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
