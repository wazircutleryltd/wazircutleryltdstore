"use client";

import { useMemo, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Eye, EyeOff, Star, TrendingUp, Award, ArrowUpDown, ArrowUp, ArrowDown, Copy } from "lucide-react";
import { LoadingState, ErrorState, NoDataState } from "../../common/StateComponents";
import type { Product, Category } from "@/types";

interface ProductTableProps {
  products?: Product[];
  isLoading?: boolean;
  error?: any;
  onEdit: (product: Product) => void;
  onClone?: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleActive: (product: Product) => void;
  onQuickUpdate?: (id: string, updates: Partial<Product>) => Promise<void>;
  categories?: Category[];
}

export default function ProductTable({ 
  products, 
  isLoading, 
  error, 
  onEdit, 
  onClone,
  onDelete, 
  onToggleActive, 
  onQuickUpdate,
  categories 
}: ProductTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingCell, setEditingCell] = useState<{ id: string; field: "price" | "stock"; value: string } | null>(null);

  const getCategoryName = useCallback(
    (id?: string | null) => categories?.find(c => c.id === id)?.name || "—",
    [categories]
  );

  const commitCellEdit = useCallback(async () => {
    if (!editingCell || !onQuickUpdate) {
      setEditingCell(null);
      return;
    }
    const { id, field, value } = editingCell;
    setEditingCell(null);

    if (field === "price") {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        await onQuickUpdate(id, { price: num });
      }
    } else if (field === "stock") {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 0) {
        await onQuickUpdate(id, { stock_quantity: num });
      }
    }
  }, [editingCell, onQuickUpdate]);

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      id: "masterwork",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
        >
          Masterwork
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
      ),
      accessorFn: (row) => row.name,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105 bg-gray-50 flex items-center justify-center flex-shrink-0">
              <img
                src={product.main_image || '/product.jpg'}
                alt={product.name || 'Product'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/product.jpg';
                }}
              />
            </div>
            <div>
              <div className="font-bold text-[#2C2C2C] font-geist leading-tight">{product.name}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter tabular-nums mt-0.5">{product.sku}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: "catalog",
      header: () => <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Catalog</span>,
      accessorFn: (row) => getCategoryName(row.category_id),
      cell: ({ getValue }) => (
        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {String(getValue() ?? "")}
        </span>
      ),
    },
    {
      id: "price",
      accessorKey: "price",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
        >
          Value
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
      ),
      cell: ({ row }) => {
        const product = row.original;
        const isEditing = editingCell?.id === product.id && editingCell.field === "price";
        if (isEditing) {
          return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <span className="text-xs font-bold text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                autoFocus
                value={editingCell.value}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitCellEdit();
                  if (e.key === "Escape") setEditingCell(null);
                }}
                onBlur={commitCellEdit}
                className="w-24 h-8 px-2 text-sm font-bold bg-white border border-[#D6AF66] rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-[#D6AF66]/20 tabular-nums"
              />
            </div>
          );
        }
        return (
          <div 
            onClick={() => onQuickUpdate && setEditingCell({ id: product.id, field: "price", value: String(product.price || 0) })}
            className={`font-bold text-[#2C2C2C] tabular-nums flex items-center gap-1.5 group/price ${onQuickUpdate ? "cursor-pointer hover:text-[#D6AF66] transition-colors" : ""}`}
            title={onQuickUpdate ? "Click to quick edit price" : undefined}
          >
            <span>${(Number(product.price) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            {onQuickUpdate && <span className="text-[10px] text-gray-300 opacity-0 group-hover/price:opacity-100 transition-opacity">✎</span>}
          </div>
        );
      },
    },
    {
      id: "stock",
      accessorKey: "stock_quantity",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
        >
          Stock
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
      ),
      cell: ({ row }) => {
        const product = row.original;
        const stock = Number(product.stock_quantity) || 0;
        const isEditing = editingCell?.id === product.id && editingCell.field === "stock";
        if (isEditing) {
          return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <input
                type="number"
                autoFocus
                value={editingCell.value}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitCellEdit();
                  if (e.key === "Escape") setEditingCell(null);
                }}
                onBlur={commitCellEdit}
                className="w-20 h-8 px-2 text-sm font-bold bg-white border border-[#D6AF66] rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-[#D6AF66]/20 tabular-nums"
              />
            </div>
          );
        }
        return (
          <div 
            onClick={() => onQuickUpdate && setEditingCell({ id: product.id, field: "stock", value: String(stock) })}
            className={`flex items-center gap-2 group/stock ${onQuickUpdate ? "cursor-pointer hover:text-[#D6AF66] transition-colors" : ""}`}
            title={onQuickUpdate ? "Click to quick edit stock" : undefined}
          >
            <span className={`font-bold tabular-nums ${stock < 10 ? "text-rose-500" : "text-gray-600"}`}>
              {stock}
            </span>
            {stock < 10 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
            {onQuickUpdate && <span className="text-[10px] text-gray-300 opacity-0 group-hover/stock:opacity-100 transition-opacity">✎</span>}
          </div>
        );
      },
    },
    {
      id: "badges",
      header: () => <div className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-center">Badges</div>,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex justify-center gap-1.5">
            <BadgeToggle 
              active={p.is_active} 
              icon={p.is_active ? Eye : EyeOff} 
              onClick={() => onToggleActive(p)} 
              color="bg-gray-100 text-gray-500" 
              activeColor="bg-emerald-50 text-emerald-600" 
            />
            <BadgeIcon active={p.is_featured} icon={Star} color="text-amber-400" />
            <BadgeIcon active={p.is_trending || p.is_top_rated} icon={TrendingUp} color="text-blue-500" />
            <BadgeIcon active={p.is_best_selling} icon={Award} color="text-indigo-500" />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-right pr-8">Actions</div>,
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex justify-end gap-2 pr-8">
            {onClone && (
              <button 
                onClick={() => onClone(p)}
                className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-[#D6AF66] hover:border-[#D6AF66]/30 transition-all active:scale-95"
                title="Clone / Duplicate Piece"
              >
                <Copy className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => onEdit(p)}
              className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-[#D6AF66] hover:border-[#D6AF66]/30 transition-all active:scale-95"
              title="Edit Artisan Piece"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(p.id)}
              className="p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
              title="Archive Masterwork"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ], [onEdit, onClone, onDelete, onToggleActive, onQuickUpdate, getCategoryName, editingCell, commitCellEdit]);

  const data = useMemo(() => products || [], [products]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="py-6 pl-8">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="group hover:bg-gray-50/50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-5 pl-8">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BadgeToggle({ 
  active, 
  icon: Icon, 
  onClick, 
  color, 
  activeColor 
}: { 
  active: boolean; 
  icon: any; 
  onClick?: () => void; 
  color: string; 
  activeColor: string; 
}) {
  return (
    <button 
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-all active:scale-90 ${active ? activeColor : color}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function BadgeIcon({ 
  active, 
  icon: Icon, 
  color 
}: { 
  active: boolean; 
  icon: any; 
  color: string; 
}) {
  if (!active) return <div className="p-1.5 rounded-lg bg-gray-50 text-gray-200"><Icon className="h-3.5 w-3.5 grayscale" /></div>;
  return (
    <div className={`p-1.5 rounded-lg bg-white shadow-sm border border-gray-50 ${color}`}>
      <Icon className="h-3.5 w-3.5 fill-current" />
    </div>
  );
}
