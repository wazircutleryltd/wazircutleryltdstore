"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/lib/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, FolderOpen, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import CategoryModal from "./CategoryModal";
import { LoadingState, ErrorState, NoDataState } from "../common/StateComponents";
import type { Category } from "@/types";

export default function CategoriesClient() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: categories = [], isLoading: categoriesLoading, error } = useCategoriesQuery();
  const deleteMutation = useDeleteCategoryMutation();

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteMutation.mutateAsync(categoryId);
        toast.success("Category deleted successfully!");
      } catch (err) {
        console.error("Error deleting category:", err);
        toast.error("Failed to delete category. Please try again.");
      }
    }
  }, [deleteMutation]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const filteredData = useMemo(() => {
    return (categories || []).filter((category: Category) => {
      const matchesSearch =
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && category.is_active) ||
        (filterStatus === "inactive" && !category.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, filterStatus]);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
          >
            Category
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
          const cat = row.original;
          return (
            <div className="flex items-center gap-3">
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-100">
                  <FolderOpen className="h-5 w-5 text-gray-400" />
                </div>
              )}
              <div>
                <div className="font-bold text-[#2C2C2C]">{cat.name}</div>
                <div className="text-[10px] font-mono text-gray-400 mt-0.5">{cat.slug}</div>
              </div>
            </div>
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        header: () => (
          <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">
            Description
          </span>
        ),
        cell: ({ getValue }) => (
          <div className="max-w-xs truncate text-sm text-gray-600">
            {String(getValue() || "—")}
          </div>
        ),
      },
      {
        id: "status",
        accessorKey: "is_active",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ getValue }) => {
          const isActive = Boolean(getValue());
          return (
            <Badge
              className={`rounded-lg px-2.5 py-0.5 font-semibold text-[11px] ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              {isActive ? (
                <>
                  <Eye className="mr-1 h-3 w-3 inline" />
                  Active
                </>
              ) : (
                <>
                  <EyeOff className="mr-1 h-3 w-3 inline" />
                  Inactive
                </>
              )}
            </Badge>
          );
        },
      },
      {
        id: "sort_order",
        accessorKey: "sort_order",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest text-gray-400 hover:text-[#2C2C2C] transition-colors"
          >
            Sort Order
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3 w-3 text-[#D6AF66]" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3 w-3 text-[#D6AF66]" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-40" />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-mono text-sm font-bold text-gray-700">
            {Number(getValue() ?? 0)}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => (
          <span className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-right block pr-4">
            Actions
          </span>
        ),
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div className="flex justify-end gap-2 pr-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-gray-200 hover:text-[#D6AF66] hover:border-[#D6AF66]/40 transition-colors"
                onClick={() => handleEditCategory(category)}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-gray-200 text-rose-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
                onClick={() => handleDeleteCategory(category.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [deleteMutation.isPending, handleDeleteCategory]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#2C2C2C] mb-1 font-geist">
            Categories
          </h2>
          <p className="text-sm text-gray-500">
            Manage your product catalog structure and department hierarchies.
          </p>
        </div>
        <Button
          className="bg-[#D6AF66] hover:bg-[#C49F5A] text-white font-bold rounded-xl shadow-sm transition-transform active:scale-95"
          onClick={handleAddCategory}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50/50 pb-4">
          <CardTitle className="text-[#2C2C2C] text-lg font-bold font-geist">
            Category Search & Filter
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Quickly filter through departments and collections
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search categories by name or description..."
                className="pl-10 rounded-xl border-gray-200 focus-visible:ring-[#D6AF66]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#D6AF66] focus:border-[#D6AF66] bg-white text-sm font-semibold text-[#2C2C2C] outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-5 pl-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {categoriesLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <LoadingState message="Summoning categories forge..." minHeight="h-48" />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <ErrorState message="Could not load categories catalog." minHeight="h-48" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <NoDataState
                    message="No categories found"
                    description="Refine your search or create a new department."
                    minHeight="h-48"
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 pl-6">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={editingCategory}
      />
    </div>
  );
}
