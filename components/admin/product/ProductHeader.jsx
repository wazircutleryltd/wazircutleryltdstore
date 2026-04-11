"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductHeader({ onAddProduct }) {
  return (
    <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 bg-[#D6AF66]/10 rounded-3xl flex items-center justify-center border border-[#D6AF66]/20">
          <Plus className="h-8 w-8 text-[#D6AF66]" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#2C2C2C] font-geist">Gallery Catalog</h2>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] font-geist">
            Inventory & Asset Management
          </p>
        </div>
      </div>
      <Button 
        onClick={onAddProduct}
        className="h-14 px-8 bg-[#2C2C2C] hover:bg-[#1a1a1a] text-white rounded-2xl font-bold outfit-font shadow-xl shadow-gray-200 transition-all active:scale-95 group"
      >
        <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        FORGE NEW PIECE
      </Button>
    </div>
  );
}
