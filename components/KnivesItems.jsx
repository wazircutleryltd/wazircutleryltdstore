
import Image from 'next/image';
import Link from 'next/link';
import { useProductsByCategorySlug } from '../lib/supabase-hooks';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { ErrorState, NoDataState } from './common/StateComponents';

const KnivesItems = () => {
    const { data: products, isLoading, error } = useProductsByCategorySlug('knives', 5);

    if (isLoading) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Knives</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
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
                    <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Knives</h2>
                    <ErrorState message="Could not load knives collection." minHeight="h-48" />
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Knives</h2>
                    <NoDataState 
                        message="Knives Catalog Updating" 
                        description="Check back soon for our latest handcrafted knife collection." 
                        minHeight="h-48" 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-12">
            <div className="container mx-auto">
                <h2 className="cabin-font text-4xl font-normal text-black text-center mb-12">Knives</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                    {[...products].sort(() => 0.5 - Math.random()).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/product?category=knives">
                        <button className="see-button outfit-font text-white font-medium text-sm px-8 py-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            See more items
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default KnivesItems;
