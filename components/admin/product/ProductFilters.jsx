"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter, Layers } from "lucide-react";

export default function ProductFilters({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus, 
  filterCategory, 
  setFilterCategory, 
  categories 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-gray-50/50 p-4 rounded-3xl border border-gray-100 shadow-inner">
      {/* Search Input */}
      <div className="lg:col-span-6 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#D6AF66] transition-colors" />
        <Input
          placeholder="Search by name, SKU or materials..."
          className="pl-12 h-14 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-[#D6AF66]/20 font-medium placeholder:text-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="lg:col-span-3 h-14 bg-white rounded-2xl flex items-center px-4 gap-3 shadow-sm group">
        <Filter className="h-4 w-4 text-gray-400 group-hover:text-[#D6AF66] transition-colors" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-transparent w-full text-sm font-bold text-[#2C2C2C] focus:outline-none cursor-pointer"
        >
          <option value="all text-gray-400">All Display Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Archived Only</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="lg:col-span-3 h-14 bg-white rounded-2xl flex items-center px-4 gap-3 shadow-sm group">
        <Layers className="h-4 w-4 text-gray-400 group-hover:text-[#D6AF66] transition-colors" />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-transparent w-full text-sm font-bold text-[#2C2C2C] focus:outline-none cursor-pointer"
        >
          <option value="all">Every Category</option>
          {categories?.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
