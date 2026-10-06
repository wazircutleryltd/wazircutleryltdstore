
import Image from 'next/image';
import Link from 'next/link';
import { useRandomProductsQuery } from '@/lib/hooks';
import ProductCard from './ProductCard';
import { ErrorState, NoDataState } from './common/StateComponents';

const ForYouItems = () => {
    const { data: products, isLoading, error } = useRandomProductsQuery(5);

    if (isLoading) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black mb-12">This must have for you 👇</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="card-border p-6 flex flex-col h-full animate-pulse">
                                <div className="aspect-square rounded-lg bg-gray-200 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black mb-12">This must have for you 👇</h2>
                    <ErrorState message="Could not load your personalized collection." minHeight="h-48" />
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className="cabin-font text-4xl font-normal text-black mb-12">This must have for you 👇</h2>
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
        <div className="p-6 lg:p-12">
            <div className="container mx-auto">
                <h2 className="cabin-font text-4xl font-normal text-black mb-12">This must have for you 👇</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center">
                    <Link href="/product">
                        <button className="see-button outfit-font text-white font-medium text-sm px-8 py-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            See more items
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForYouItems;
