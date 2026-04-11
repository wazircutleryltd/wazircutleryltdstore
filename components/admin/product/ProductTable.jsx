"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Award, Award as Trophy } from "lucide-react";
import Image from "next/image";
import { LoadingState, ErrorState, NoDataState } from "../../common/StateComponents";

export default function ProductTable({ 
  products, 
  isLoading, 
  error, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  categories 
}) {
  const getCategoryName = (id) => categories?.find(c => c.id === id)?.name || "—";

  if (isLoading) return <LoadingState message="Summoning the artifact collection..." />;
  if (error) return <ErrorState message="Could not connect to the inventory forge." />;
  if (!products || products.length === 0) return (
    <NoDataState 
      message="No masterworks found" 
      description="Refine your filters or expand the collection with new artisan pieces." 
    />
  );

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="border-none">
            <TableHead className="py-6 pl-8 font-black uppercase text-[10px] tracking-widest text-gray-400">Masterwork</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Catalog</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Value</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400">Stock</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-center">Badges</TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="group hover:bg-gray-50/50 transition-colors">
              {/* Product Info */}
              <TableCell className="py-5 pl-8">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                    <Image
                      src={product.main_image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-[#2C2C2C] font-geist leading-tight">{product.name}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter tabular-nums mt-0.5">{product.sku}</div>
                  </div>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {getCategoryName(product.category_id)}
                </span>
              </TableCell>

              {/* Price */}
              <TableCell>
                <div className="font-bold text-[#2C2C2C] tabular-nums">${product.price.toLocaleString()}</div>
              </TableCell>

              {/* Stock */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`font-bold tabular-nums ${product.stock_quantity < 10 ? "text-rose-500" : "text-gray-600"}`}>
                    {product.stock_quantity}
                  </span>
                  {product.stock_quantity < 10 && (
                     <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
              </TableCell>

              {/* Badges */}
              <TableCell>
                <div className="flex justify-center gap-1.5">
                  <BadgeToggle active={product.is_active} icon={product.is_active ? Eye : EyeOff} onClick={() => onToggleActive(product)} color="bg-gray-100 text-gray-500" activeColor="bg-emerald-50 text-emerald-600" />
                  <BadgeIcon active={product.is_featured} icon={Star} color="text-amber-400" />
                  <BadgeIcon active={product.is_trending} icon={TrendingUp} color="text-blue-500" />
                  <BadgeIcon active={product.is_best_selling} icon={Award} color="text-indigo-500" />
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right pr-8">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(product)}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-[#D6AF66] hover:border-[#D6AF66]/30 transition-all active:scale-95"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BadgeToggle({ active, icon: Icon, onClick, color, activeColor }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all active:scale-90 ${active ? activeColor : color}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function BadgeIcon({ active, icon: Icon, color }) {
  if (!active) return <div className="p-1.5 rounded-lg bg-gray-50 text-gray-200"><Icon className="h-3.5 w-3.5 grayscale" /></div>;
  return (
    <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-gray-50 ${color}`}>
      <Icon className="h-3.5 w-3.5 fill-current" />
    </div>
  );
}
