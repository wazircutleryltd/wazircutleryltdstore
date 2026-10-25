"use client";

import { useState } from "react";
import { 
  useAllProductsQuery, 
  useCategoriesQuery, 
  useDeleteProductMutation, 
  useUpdateProductMutation 
} from "@/lib/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductModal from "@/components/admin/ProductModal";
import { toast } from "sonner";
import { handleAppError } from "@/lib/error-handler";
import type { Product } from "@/types";

// Modular Components
import ProductHeader from "./product/ProductHeader";
import ProductFilters from "./product/ProductFilters";
import ProductTable from "./product/ProductTable";

export default function ProductsClient() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const { 
    data: queryData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useAllProductsQuery(currentPage, pageSize, searchTerm, filterCategory, filterStatus);

  const products = queryData?.products || [];
  const totalPages = queryData?.totalPages || 1;
  const totalCount = queryData?.totalCount || 0;

  const { data: categories } = useCategoriesQuery();
  const deleteProductMutation = useDeleteProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloneProduct = (product: Product) => {
    const baseSku = product.sku ? product.sku.replace(/-COPY\d+$/, "") : "WC";
    const rand = Math.floor(1000 + Math.random() * 9000);
    const clonedProduct: Product = {
      ...product,
      id: "", // clear id so it registers as a new masterpiece
      name: `${product.name} (Copy)`,
      sku: `${baseSku}-COPY${rand}`,
    };
    setEditingProduct(clonedProduct);
    setIsModalOpen(true);
    toast.info(`Cloned template for "${product.name}". Adjust attributes and save.`);
  };

  const handleQuickUpdate = async (id: string, updates: Partial<Product>) => {
    try {
      await updateProductMutation.mutateAsync({
        id,
        updates
      });
      toast.success("Artifact updated instantly");
    } catch (error) {
      handleAppError(error, "Quick Update");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Permanently archive this masterpiece from the forge?")) {
      try {
        await deleteProductMutation.mutateAsync(productId);
        toast.success('Artifact archived successfully');
      } catch (error) {
        handleAppError(error, "Inventory Deletion");
      }
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        updates: { is_active: !product.is_active }
      });
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
        setSearchTerm={(term: string) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        filterStatus={filterStatus}
        setFilterStatus={(status: string) => {
          setFilterStatus(status);
          setCurrentPage(1);
        }}
        filterCategory={filterCategory}
        setFilterCategory={(cat: string) => {
          setFilterCategory(cat);
          setCurrentPage(1);
        }}
        categories={categories}
      />

      <ProductTable 
        products={products}
        isLoading={productsLoading}
        error={productsError}
        onEdit={handleEditProduct}
        onClone={handleCloneProduct}
        onDelete={handleDeleteProduct}
        onToggleActive={toggleActive}
        onQuickUpdate={handleQuickUpdate}
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
              {Array.from({ length: totalPages }, (_, i: number) => i + 1).map((p: number) => (
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
        }}
        product={editingProduct}
      />
    </div>
  );
}
