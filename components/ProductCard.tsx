'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product | any;
    showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: ProductCardProps) => {
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`, {
            description: `$${Number(product.price).toFixed(2)} — In Stock & Ready to Ship`,
            action: {
                label: "View Cart",
                onClick: () => router.push('/cart'),
            },
            duration: 3500,
        });
    };

    const rating = Math.floor(product.rating || 5);

    // Prioritize a single luxury badge to prevent cluttering or obscuring blade photos
    const primaryBadge = product.is_best_selling
        ? { text: "Best Selling", variant: "gold" as const }
        : product.is_featured
        ? { text: "Featured", variant: "damascus" as const }
        : (product.is_trending || product.is_top_rated)
        ? { text: "Masterwork", variant: "gold" as const }
        : null;

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group relative bg-white border border-[#D6AF66]/25 rounded-xl p-3.5 sm:p-4 flex flex-col h-full shadow-xs hover:shadow-lg hover:border-[#D6AF66]/60 transition-all duration-300"
        >
            <Link href={`/product/${product.slug}`} className="cursor-pointer flex-grow flex flex-col">
                <div className="relative mb-3 aspect-square rounded-lg bg-neutral-50/80 overflow-hidden flex items-center justify-center p-2.5">
                    {/* Single Clean Luxury Badge */}
                    {primaryBadge && (
                        <div className="absolute top-2 left-2 z-10">
                            <Badge variant={primaryBadge.variant} className="text-[10px] tracking-wider uppercase font-bold py-0.5 px-2 shadow-xs">
                                {primaryBadge.text}
                            </Badge>
                        </div>
                    )}

                    {/* Product Image with Hover Zoom */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image 
                            src={product.main_image || '/product.jpg'} 
                            alt={product.name} 
                            width={280} 
                            height={280} 
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                            loading="lazy"
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                        />
                    </div>

                    {/* Subtle Quick View Overlay Indicator */}
                    <div className="absolute inset-0 bg-neutral-950/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/95 text-neutral-900 text-[11px] font-semibold shadow-md backdrop-blur-sm">
                            <Eye className="w-3 h-3 text-[#8C6D23]" />
                            <span>View Specs</span>
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[#8C6D23] transition-colors mb-1.5 capitalize line-clamp-2 font-[family-name:var(--font-outfit)] leading-snug">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`} 
                            />
                        ))}
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono ml-0.5">
                        ({(product.rating || 5.0).toFixed(1)})
                    </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-2 mt-auto">
                    <span className="text-base sm:text-lg font-bold text-neutral-900 font-[family-name:var(--font-outfit)]">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                        <span className="text-[11px] text-neutral-400 line-through font-mono">
                            ${Number(product.compare_price).toFixed(2)}
                        </span>
                    )}
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-1 mb-3 font-[family-name:var(--font-cabin)]">
                    {product.delivery_date || 'Estimated delivery in 2-4 working days'}
                </p>
            </Link>

            {showAddToCart && (
                <motion.button 
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2 px-3 rounded-lg font-semibold text-xs cursor-pointer transition-all duration-200 flex items-center justify-center space-x-1.5 bg-neutral-900 hover:bg-[#D6AF66] text-white hover:text-neutral-900 shadow-xs hover:shadow-md"
                    onClick={handleAddToCart}
                >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add To Cart</span>
                </motion.button>
            )}
        </motion.div>
    );
};

export default ProductCard;

