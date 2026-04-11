"use client";

import { useState } from "react";
import { useAllProducts, useAllCategories, useDeleteProduct, useUpdateProduct } from "@/lib/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductModal from "@/components/admin/ProductModal";
import { toast } from "sonner";
import { handleAppError } from "@/lib/error-handler";

// Modular Components
import ProductHeader from "./product/ProductHeader";
import ProductFilters from "./product/ProductFilters";
import ProductTable from "./product/ProductTable";

export default function ProductsClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [reloadToken, setReloadToken] = useState(0);

  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError,
    totalPages,
    totalCount 
  } = useAllProducts(reloadToken, currentPage, pageSize);

  const { data: categories } = useAllCategories();
  const { deleteProduct } = useDeleteProduct();
  const { updateProduct } = useUpdateProduct();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm("Permanently archive this masterpiece from the forge?")) {
      try {
        await deleteProduct(productId);
        setReloadToken((t) => t + 1);
        toast.success('Artifact destroyed successfully');
      } catch (error) {
        handleAppError(error, "Inventory Deletion");
      }
    }
  };

  const toggleActive = async (product) => {
    try {
      await updateProduct(product.id, { is_active: !product.is_active });
      setReloadToken((t) => t + 1);
      toast.success(`Product visibility set to ${!product.is_active ? 'Public' : 'Hidden'}`);
    } catch (error) {
      handleAppError(error, "Visibility Toggle");
    }
  };

  return (
    <div className="space-y-10 pb-12 overflow-hidden">
      <ProductHeader onAddProduct={handleAddProduct} />

      <ProductFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />

      <ProductTable 
        products={products}
        isLoading={productsLoading}
        error={productsError}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        onToggleActive={toggleActive}
        categories={categories}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest font-geist">
            Inventory <span className="text-[#2C2C2C] tabular-nums">{(currentPage - 1) * pageSize + 1}—{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="text-[#2C2C2C] tabular-nums">{totalCount}</span> artifacts
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-10 px-4 rounded-xl border-gray-100 font-bold"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> PREV
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === p 
                    ? "bg-[#D6AF66] text-white shadow-lg shadow-[#D6AF66]/20 scale-110" 
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-10 px-4 rounded-xl border-gray-100 font-bold"
            >
              NEXT <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReloadToken(t => t + 1);
        }}
        product={editingProduct}
      />
    </div>
  );
}
