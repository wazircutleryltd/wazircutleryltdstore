'use client';
import Image from 'next/image';
import React from "react";
import Link from 'next/link';
import ConditionalLayout from "@/components/ConditionalLayout";
import ProductCard from "@/components/ProductCard";
import { useActiveProducts, useProductsByCategory, useCategoriesWithProductCounts } from "@/lib/hooks";
import { useSearchParams, useRouter } from 'next/navigation';
import Newsletter from "@/components/Newsletter";
import RelatedProducts from "@/components/RelatedProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ProductSkeleton from "@/components/ProductSkeleton";
import { LoadingState, ErrorState, NoDataState } from "@/components/common/StateComponents";

const ProductClient = () => {
    return (
        <ConditionalLayout>
            <ProductContent />
        </ConditionalLayout>
    );
};

const ProductContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categorySlug = searchParams.get('category');
    let categoryId = searchParams.get('categoryId');
    const filterType = searchParams.get('filter');
    const type = searchParams.get('type');
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const pageSize = 15;

    const { data: categories } = useCategoriesWithProductCounts();

    // If we have a category slug but no categoryId, find it from categories
    if (!categoryId && categorySlug && categories) {
        const found = categories.find(c => c.slug === categorySlug);
        if (found) categoryId = found.id;
    }

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [displayedItems, setDisplayedItems] = React.useState(pageSize);
    const buttonRef = React.useRef(null);
    const menuRef = React.useRef(null);

    const { data: allProducts, isLoading: isLoadingAll, error: errorAll } = useActiveProducts();
    const { data: productsByCategory, isLoading: isLoadingCategory, error: errorCategory } = useProductsByCategory(categoryId);

    const isLoading = categoryId ? isLoadingCategory : isLoadingAll;
    const error = categoryId ? errorCategory : errorAll;

    // Find the selected category name
    const selectedCategory = categories && categoryId ? categories.find(cat => cat.id === categoryId) : null;
    const pageTitle = selectedCategory ? selectedCategory.name : 'Categories';

    React.useEffect(() => {
        if (selectedCategory) {
            document.title = selectedCategory.name + ' | Wazir Cutlery';
        } else {
            document.title = 'Categories | Wazir Cutlery';
        }
    }, [selectedCategory]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && buttonRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset displayed items when filter or category changes
    React.useEffect(() => {
        setDisplayedItems(pageSize);
    }, [filterType, categoryId, type]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFilterChange = (type) => {
        const params = new URLSearchParams(searchParams);
        if (type) {
            params.set('filter', type);
        } else {
            params.delete('filter');
        }
        params.set('page', '1'); // Reset to first page when filter changes
        router.push(`/product?${params.toString()}`);
        setIsMenuOpen(false);
    };

    const handleLoadMore = () => {
        setDisplayedItems(prev => prev + pageSize);
    };

    const getCategoryName = (id) => {
        if (!categories || !id) {
            return "All Products";
        }
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : "All Products";
    };

    const getFilterText = (type) => {
        switch (type) {
            case 'featured':
                return 'Featured';
            case 'best-selling':
                return 'Best Selling';
            case 'trending':
                return 'Trending';
            default:
                return 'Filter';
        }
    };

    const categoryName = getCategoryName(categoryId);

    // Filter the products based on the selected filter type or type parameter
    const filterProducts = (products) => {
        if (!Array.isArray(products)) return [];

        const filterBy = filterType || type; // Use either filter or type parameter

        switch (filterBy) {
            case 'featured':
                return products.filter(p => p.is_featured);
            case 'best-selling':
                return products.filter(p => p.is_best_selling);
            case 'trending':
                return products.filter(p => p.is_trending);
            default:
                return products;
        }
    };

    const dataset = categoryId ? productsByCategory : allProducts;
    const filteredDataset = filterProducts(dataset);
    const total = Array.isArray(filteredDataset) ? filteredDataset.length : 0;
    const pageItems = Array.isArray(filteredDataset) ? filteredDataset.slice(0, displayedItems) : [];
    const hasMoreItems = displayedItems < total;

    const { addToCart } = useCart();

    const handleAddToCart = (product, e) => {
        e.preventDefault(); // Prevent navigation to product page
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`, {
            position: "top-right",
            autoClose: 3000,
        });
    };

    return (
        <>
            <div className="min-h-screen relative overflow-hidden">
                <div className="container mx-auto relative z-10 py-20 px-4">
                    <div className="text-center mt-24 mb-24">
                        <h1 className="mb-8 capitalize">{categoryName}</h1>

                        <div className="w-full flex justify-start">
                            <div className="relative">
                                <button ref={buttonRef} className="filter-button bg-[#F9F9F6]" onClick={toggleMenu}>
                                    <div className="flex items-center gap-2">
                                        <Image src="/filter-icon.svg" alt={"Filter Icon"} width={16} height={16} />
                                        <span>{getFilterText(filterType || type)}</span>
                                    </div>
                                    <svg className={`filter-arrow-icon ${isMenuOpen ? 'rotated' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                                <div ref={menuRef} className={`filter-dropdown-menu ${isMenuOpen ? '' : 'hidden'}`}>
                                    <div className="px-4 py-2 text-sm text-gray-500 cursor-default">Filter by</div>
                                    <a onClick={() => handleFilterChange('featured')} className={`filter-dropdown-item ${(filterType === 'featured' || type === 'featured') ? 'active' : ''}`}>Featured</a>
                                    <a onClick={() => handleFilterChange('best-selling')} className={`filter-dropdown-item ${(filterType === 'best-selling' || type === 'best-selling') ? 'active' : ''}`}>Best Selling</a>
                                    <a onClick={() => handleFilterChange('trending')} className={`filter-dropdown-item ${(filterType === 'trending' || type === 'trending') ? 'active' : ''}`}>Trending</a>
                                    <div className="border-t my-2"></div>
                                    <a onClick={() => handleFilterChange(null)} className="filter-dropdown-item text-red-500">Reset Filter</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
                            <ProductSkeleton count={displayedItems} />
                        </div>
                    ) : error ? (
                        <ErrorState />
                    ) : total === 0 ? (
                        <NoDataState />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
                                {pageItems.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {hasMoreItems && (
                                <div className="items-center justify-center flex mb-16">
                                    <button
                                        className="cta-button py-2 rounded-md font-medium"
                                        onClick={handleLoadMore}
                                    >
                                        Load more
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Show RelatedProducts section when type parameter exists */}
                    {type && <RelatedProducts />}
                </div>
            </div>
            <Newsletter />
        </>
    );
}

export default ProductClient;
