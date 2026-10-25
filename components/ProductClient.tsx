'use client';
import Image from 'next/image';
import React from "react";
import ConditionalLayout from "@/components/ConditionalLayout";
import ProductCard from "@/components/ProductCard";
import { 
    useActiveProductsQuery, 
    useProductsByCategoryQuery, 
    useCategoriesWithProductCountsQuery 
} from "@/lib/query-hooks";
import { useSearchParams, useRouter } from 'next/navigation';
import Newsletter from "@/components/Newsletter";
import RelatedProducts from "@/components/RelatedProducts";
import ProductSkeleton from "@/components/ProductSkeleton";
import { ErrorState, NoDataState } from "@/components/common/StateComponents";
import type { Product, Category } from "@/types";

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
    const pageSize = 15;

    const { data: categories } = useCategoriesWithProductCountsQuery();

    // If we have a category slug but no categoryId, find it from categories
    if (!categoryId && categorySlug && categories) {
        const found = (categories as Category[]).find((c: Category) => c.slug === categorySlug);
        if (found) categoryId = found.id;
    }

    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const [displayedItems, setDisplayedItems] = React.useState<number>(pageSize);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const menuRef = React.useRef<HTMLDivElement>(null);

    const { data: allProducts, isLoading: isLoadingAll, error: errorAll } = useActiveProductsQuery();
    const { data: productsByCategory, isLoading: isLoadingCategory, error: errorCategory } = useProductsByCategoryQuery(categoryId || '');

    const isLoading = categoryId ? isLoadingCategory : isLoadingAll;
    const error = categoryId ? errorCategory : errorAll;

    // Find the selected category name
    const selectedCategory = categories && categoryId ? (categories as Category[]).find((cat: Category) => cat.id === categoryId) : null;
    const pageTitle = selectedCategory ? selectedCategory.name : 'Categories';

    React.useEffect(() => {
        if (selectedCategory) {
            document.title = selectedCategory.name + ' | Wazir Cutlery';
        } else {
            document.title = 'Categories | Wazir Cutlery';
        }
    }, [selectedCategory]);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)) {
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

    const handleFilterChange = (filterVal: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filterVal) {
            params.set('filter', filterVal);
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

    const getCategoryName = (id: string | null): string => {
        if (!categories || !id) {
            return "All Products";
        }
        const category = (categories as Category[]).find((cat: Category) => cat.id === id);
        return category ? category.name : "All Products";
    };

    const getFilterText = (filterVal?: string | null): string => {
        switch (filterVal) {
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
    const filterProducts = (prods?: Product[] | null): Product[] => {
        if (!Array.isArray(prods)) return [];

        const filterBy = filterType || type;

        switch (filterBy) {
            case 'featured':
                return prods.filter((p: Product) => p.is_featured);
            case 'best-selling':
                return prods.filter((p: Product) => p.is_best_selling);
            case 'trending':
                return prods.filter((p: Product) => p.is_trending || p.is_top_rated);
            default:
                return prods;
        }
    };

    const dataset = categoryId ? productsByCategory : allProducts;
    const filteredDataset = filterProducts(dataset as Product[]);
    const total = Array.isArray(filteredDataset) ? filteredDataset.length : 0;
    const pageItems = Array.isArray(filteredDataset) ? filteredDataset.slice(0, displayedItems) : [];
    const hasMoreItems = displayedItems < total;

    return (
        <>
            <div className="min-h-screen relative overflow-hidden pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-4">
                        <a href="/" className="hover:text-neutral-900 transition-colors">Home</a>
                        <span>/</span>
                        <span className="text-neutral-900 font-medium capitalize">{categoryName}</span>
                    </div>

                    {/* Catalog Header & Filter Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-8 border-b border-neutral-200/80">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 capitalize font-[family-name:var(--font-outfit)]">
                                {categoryName}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-1">
                                Showing {total} handcrafted {total === 1 ? 'piece' : 'pieces'}
                            </p>
                        </div>

                        {/* Filter Bar */}
                        <div className="relative self-start sm:self-auto">
                            <button 
                                ref={buttonRef} 
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 hover:border-[#D6AF66] transition-all shadow-2xs cursor-pointer" 
                                onClick={toggleMenu}
                            >
                                <Image src="/filter-icon.svg" alt="Filter Icon" width={14} height={14} />
                                <span>{getFilterText(filterType || type)}</span>
                                <svg 
                                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2"
                                >
                                    <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <div 
                                ref={menuRef} 
                                className={`absolute right-0 left-auto mt-2 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg z-30 py-1.5 transition-all ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                            >
                                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400">Filter by</div>
                                <button 
                                    onClick={() => handleFilterChange('featured')} 
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 font-medium cursor-pointer ${(filterType === 'featured' || type === 'featured') ? 'text-[#8C6D23] font-semibold bg-amber-50/50' : 'text-neutral-700'}`}
                                >
                                    Featured
                                </button>
                                <button 
                                    onClick={() => handleFilterChange('best-selling')} 
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 font-medium cursor-pointer ${(filterType === 'best-selling' || type === 'best-selling') ? 'text-[#8C6D23] font-semibold bg-amber-50/50' : 'text-neutral-700'}`}
                                >
                                    Best Selling
                                </button>
                                <button 
                                    onClick={() => handleFilterChange('trending')} 
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 font-medium cursor-pointer ${(filterType === 'trending' || type === 'trending') ? 'text-[#8C6D23] font-semibold bg-amber-50/50' : 'text-neutral-700'}`}
                                >
                                    Trending
                                </button>
                                <div className="border-t border-neutral-100 my-1" />
                                <button 
                                    onClick={() => handleFilterChange(null)} 
                                    className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mb-12">
                            <ProductSkeleton count={displayedItems} />
                        </div>
                    ) : error ? (
                        <ErrorState />
                    ) : total === 0 ? (
                        <NoDataState />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mb-12">
                                {pageItems.map((p: Product) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {hasMoreItems && (
                                <div className="items-center justify-center flex mb-12">
                                    <button
                                        className="see-button"
                                        onClick={handleLoadMore}
                                    >
                                        Load More Blades ({displayedItems} of {total})
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
};

export default ProductClient;
