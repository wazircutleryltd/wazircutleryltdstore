
import Image from 'next/image';
import Link from 'next/link';
import { useRandomProductsQuery } from '@/lib/hooks';
import ProductCard from './ProductCard';
import { ErrorState, NoDataState } from './common/StateComponents';

const ForYouItems = () => {
    const { data: products, isLoading, error } = useRandomProductsQuery(5);

    if (isLoading) {
        return (
            <div className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Curated For You</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white border border-neutral-200 rounded-xl p-4 flex flex-col h-full animate-pulse">
                                <div className="aspect-square rounded-lg bg-neutral-100 mb-3" />
                                <div className="h-4 bg-neutral-100 rounded mb-2" />
                                <div className="h-4 bg-neutral-100 rounded mb-2 w-3/4" />
                                <div className="h-4 bg-neutral-100 rounded mb-3 w-1/2" />
                                <div className="h-9 bg-neutral-100 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Curated For You</h2>
                    <ErrorState message="Could not load your personalized collection." minHeight="h-48" />
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Curated For You</h2>
                    <NoDataState 
                        message="Curating Your Collection" 
                        description="We are picking items just for you. Check back shortly." 
                        minHeight="h-48" 
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 text-center mb-8 font-[family-name:var(--font-outfit)]">Curated For You</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mb-8">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/product">
                        <button className="see-button">
                            Explore Full Catalog &rarr;
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForYouItems;
