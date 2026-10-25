import { useMemo } from 'react';
import { useTrendingProductsQuery } from '@/lib/hooks';
import Link from 'next/link';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { ErrorState, NoDataState } from './common/StateComponents';

const TrendingItems = () => {
    const { data: products, isLoading, error } = useTrendingProductsQuery(5);
    const displayProducts = useMemo(() => {
        if (!products) return [];
        return products.slice(0, 5);
    }, [products]);

    if (isLoading) {
        return (
            <div className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Trending Items</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mb-8">
                        <ProductSkeleton count={5} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Trending Items</h2>
                    <ErrorState message="Could not load trending items." minHeight="h-48" />
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Trending Items</h2>
                    <NoDataState 
                        message="New Trends Loading" 
                        description="Stay tuned as we update our top-trending handcrafted blades." 
                        minHeight="h-48" 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Trending Items</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mb-8">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/product?type=trending">
                        <button className="see-button">
                            See More Trending &rarr;
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TrendingItems;
