"use client";

import { useState, useEffect } from "react";
import { useAllCategories, useCreateProduct, useUpdateProduct } from "../../lib/hooks";
import { Button } from "../ui/button";
import { X, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Modular Form Sections
import ProductMediaManager from "./product/ProductMediaManager";
import ProductEssentials from "./product/ProductEssentials";
import ProductInventoryPricing from "./product/ProductInventoryPricing";
import ProductSettings from "./product/ProductSettings";

export default function ProductModal({ isOpen, onClose, product }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: 0,
    comparePrice: 0,
    categoryId: "",
    sku: "",
    stockQuantity: 0,
    weight: "",
    productSize: "",
    delivery_date: "",
    isActive: true,
    isFeatured: false,
    isTrending: false,
    isBestSelling: false,
    tags: []
  });
  
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: categories } = useAllCategories();
  const { createProduct } = useCreateProduct();
  const { updateProduct } = useUpdateProduct();

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.short_description || "",
        price: product.price || 0,
        comparePrice: product.compare_price || 0,
        categoryId: product.category_id || "",
        sku: product.sku || "",
        stockQuantity: product.stock_quantity || 0,
        weight: product.weight || "",
        productSize: product.product_size || "",
        delivery_date: product.delivery_date || "",
        isActive: Boolean(product.is_active),
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
  }, [product, isOpen]);

  const resetForm = () => {
    setFormData({
      name: "", description: "", shortDescription: "",
      price: 0, comparePrice: 0, categoryId: "",
      sku: "", stockQuantity: 0, weight: "",
      productSize: "", delivery_date: "",
      isActive: true, isFeatured: false,
      isTrending: false, isBestSelling: false,
      tags: []
    });
    setMainImagePreview("");
    setAdditionalImages([]);
  };

  const generateSku = (name) => {
    return name.toUpperCase().replace(/[^A-Z0-9]/g, "").substring(0, 8) + 
           Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && !product) {
        updated.sku = generateSku(value);
      }
      return updated;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const validateForm = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name required";
    if (!formData.description.trim()) e.description = "Description required";
    if (!formData.categoryId) e.categoryId = "Category required";
    if (formData.price <= 0) e.price = "Price > 0 required";
    if (!formData.sku.trim()) e.sku = "SKU required";
    if (!mainImagePreview) e.mainImage = "Main image required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        main_image: mainImagePreview,
        images: additionalImages,
        short_description: formData.shortDescription,
        is_trending: formData.isTrending,
        is_top_rated: formData.isTrending,
      };

      if (product) {
        await updateProduct(product.id, payload);
        toast.success('Inventory Refined Successfully');
      } else {
        await createProduct(payload);
        toast.success('Collection Expanded Successfully');
      }
      onClose();
    } catch (error) {
      toast.error('The forge failed to save changes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white rounded-[2rem] shadow-2xl max-w-6xl w-full max-h-[92vh] flex flex-col relative z-50 overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="bg-[#D6AF66] p-3 rounded-2xl shadow-lg shadow-[#D6AF66]/20">
                  <Save className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2C2C2C] font-geist tracking-tight">
                    {product ? "Edit Artisan Piece" : "Create New Masterpiece"}
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{product ? "Modify Inventory" : "Catalog Expansion"}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-2xl transition-all active:scale-95">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-10">
              <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Media & Strategy */}
                <div className="lg:col-span-5 space-y-8">
                   <ProductMediaManager 
                    mainImagePreview={mainImagePreview}
                    additionalImages={additionalImages}
                    onMainImageChange={setMainImagePreview}
                    onAdditionalImagesChange={setAdditionalImages}
                    errors={errors}
                   />
                   <ProductSettings 
                    formData={formData}
                    handleInputChange={handleInputChange}
                   />
                </div>

                {/* Right Column: Essentials & Inventory */}
                <div className="lg:col-span-7 space-y-10">
                   <ProductEssentials 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    categories={categories}
                    tagInput={tagInput}
                    setTagInput={setTagInput}
                    addTag={addTag}
                    removeTag={(tag) => setFormData(p => ({...p, tags: p.tags.filter(t => t !== tag)}))}
                    errors={errors}
                   />
                   <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                   <ProductInventoryPricing 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                   />
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/80 backdrop-blur-md flex items-center justify-between">
               <Button type="button" variant="ghost" onClick={resetForm} className="text-gray-400 font-bold outfit-font hover:text-[#2C2C2C]">
                 <RotateCcw className="h-4 w-4 mr-2" /> REVERT CHANGES
               </Button>
               <div className="flex gap-4">
                 <Button type="button" onClick={onClose} variant="outline" className="h-12 px-8 rounded-2xl font-bold outfit-font border-gray-200">
                   CANCEL
                 </Button>
                 <Button 
                    type="submit" 
                    form="product-form"
                    disabled={isLoading}
                    className="h-12 px-10 rounded-2xl font-bold outfit-font bg-[#D6AF66] hover:bg-[#C19A5A] text-white shadow-xl shadow-[#D6AF66]/20 active:scale-95 transition-all"
                 >
                   {isLoading ? "FORGING..." : (product ? "UPDATE MASTERPIECE" : "FINALIZE CREATION")}
                 </Button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
