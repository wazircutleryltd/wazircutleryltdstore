
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFeaturedProductsQuery } from '@/lib/hooks';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { ErrorState, NoDataState } from './common/StateComponents';

const FeaturedItems = () => {
    const { data: products, isLoading, error } = useFeaturedProductsQuery(5);
    const displayProducts = useMemo(() => {
        if (!products) return [];
        return products.slice(0, 5);
    }, [products]);

    if (isLoading) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Featured Items</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
                        <ProductSkeleton count={5} />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Featured Items</h2>
                    <ErrorState message="Could not load featured products." minHeight="h-48" />
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Featured Items</h2>
                    <NoDataState 
                        message="Coming Soon" 
                        description="Our new featured collection is being forged." 
                        minHeight="h-48" 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-12">
            <div className="container mx-auto">
                <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Featured Items</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/product?type=featured">
                        <button className="see-button outfit-font text-white font-medium text-sm px-8 py-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            See more items
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedItems;
