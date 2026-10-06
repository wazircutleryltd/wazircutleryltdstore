'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const RelatedProducts = ({ products = [] }: { products?: any[] }) => {
    const { addToCart } = useCart();

    if (!products || products.length === 0) {
        return null;
    }

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to product page
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`, {
            position: "top-right",
            duration: 3000,
        });
    };

    return (
        <section className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
                <h2 className="font-outfit font-medium text-black text-xl md:text-[28px]">Related Products</h2>
                <div className="flex-1 h-px bg-sub-texts-mute-lable"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-16">
                {products.map((product: any) => (
                    <Link key={product.id} href={`/product/${product.slug || product.sku}`} className="cursor-pointer group">
                        <div className="card-border p-3 md:p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 bg-white rounded-2xl">
                            <div className="relative mb-4">
                                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
                                    {(() => {
                                        const badges = [];
                                        if (product.is_best_selling) badges.push('Best Selling');
                                        if (product.is_featured) badges.push('Featured');
                                        if (product.is_trending || product.is_top_rated) badges.push('Trending');
                                        
                                        return badges.slice(0, 2).map((badge, index) => (
                                            <span key={index} className="best-sale-badge text-xs px-2 py-1">
                                                {badge}
                                            </span>
                                        ));
                                    })()}
                                </div>
                                <div className="aspect-square rounded-lg flex items-center justify-center overflow-hidden">
                                    <Image 
                                        src={product.main_image || '/product.jpg'} 
                                        alt={product.name} 
                                        width={250} 
                                        height={250} 
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                        loading="lazy"
                                        className="w-full h-full object-contain" 
                                    />
                                </div>
                            </div>

                            <h3 className="outfit-font text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3 capitalize line-clamp-2 min-h-[2.5rem] md:min-h-0">
                                {product.name}
                            </h3>

                            <div className="flex items-center mb-3">
                                <div className="flex star-rating">
                                    {'★'.repeat(Math.floor(product.rating || 0))}
                                    {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
                                <span className="outfit-font text-[#D6AF66] font-bold text-base md:text-lg">${product.price}</span>
                                {product.compare_price && (
                                    <span className="outfit-font text-gray-400 line-through text-xs md:text-sm">${product.compare_price}</span>
                                )}
                            </div>

                            <p className="outfit-font text-[10px] md:text-xs text-gray-500 mb-3 md:mb-4 flex-grow line-clamp-2">
                                {product.estimated_delivery || 'Estimate delivery in 2-3 working days'}
                            </p>

                            <div className="flex gap-2 mt-auto">
                                <button 
                                    className="flex-1 bg-[#D6AF66] text-white py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-semibold hover:bg-[#C19A5A] transition-all active:scale-95 shadow-lg shadow-[#D6AF66]/20 cursor-pointer"
                                    onClick={(e) => handleAddToCart(product, e)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RelatedProducts;
