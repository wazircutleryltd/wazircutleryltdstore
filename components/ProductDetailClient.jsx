'use client';
import { useProductBySlug, useActiveProducts, useProductsByCategory } from "@/lib/hooks";
import ProductDetails from "@/components/ProductDetails";
import ConditionalLayout from "@/components/ConditionalLayout";
import RelatedProducts from "@/components/RelatedProducts";
import { LoadingState, ErrorState, NoDataState } from "@/components/common/StateComponents";

export default function ProductDetailClient({ slug }) {
    const { data: product, isLoading, error } = useProductBySlug(slug);
    const { data: relatedProducts, isLoading: isLoadingRelated } = useProductsByCategory(product?.category_id);
    const { data: allProducts, isLoading: isLoadingAll } = useActiveProducts();
    const isLoadingRecommendations = isLoadingRelated || isLoadingAll;

    let displayProducts = [];
    if (product && relatedProducts) {
        const filteredRelated = relatedProducts.filter(r => r.id !== product.id);
        if (filteredRelated.length > 0) {
            displayProducts = filteredRelated.slice(0, 5);
        } else if (allProducts) {
            displayProducts = allProducts.filter(p => p.category_id !== product.category_id).slice(0, 5);
        }
    }

    const showWaitForUpdate = product && !isLoadingRecommendations && displayProducts.length === 0;

    return (
        <ConditionalLayout>
            {!slug ? (
                <ErrorState message="Invalid product slug." />
            ) : isLoading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState message="Could not load product. Please try again." />
            ) : !product ? (
                <NoDataState message="Product not found." />
            ) : (
                <>
                    <ProductDetails product={product} />

                    <div className="container mx-auto px-4 md:px-8 lg:px-24 py-8">
                        {isLoadingRecommendations && (
                            <div className="text-center my-16">
                                <h2 className="font-outfit font-medium text-black text-xl md:text-[28px] mb-4">Loading Recommendations...</h2>
                            </div>
                        )}

                        {!isLoadingRecommendations && displayProducts.length > 0 && (
                            <RelatedProducts products={displayProducts} />
                        )}

                        {showWaitForUpdate && (
                            <div className="my-16">
                                <div className="text-center">
                                    <h2 className="font-outfit font-medium text-black text-xl md:text-[28px] mb-4">More products coming soon!</h2>
                                    <p>Please check back later.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </ConditionalLayout>
    );
}
