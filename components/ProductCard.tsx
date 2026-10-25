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

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="group relative bg-white border border-[#D6AF66]/20 rounded-2xl p-5 flex flex-col h-full shadow-sm hover:shadow-xl hover:border-[#D6AF66]/50 transition-all duration-300"
        >
            <Link href={`/product/${product.slug}`} className="cursor-pointer flex-grow flex flex-col">
                <div className="relative mb-4 aspect-square rounded-xl bg-neutral-50/70 overflow-hidden flex items-center justify-center p-3">
                    {/* Luxury Badges */}
                    <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
                        {product.is_best_selling && (
                            <Badge variant="gold" className="text-[10px] uppercase font-bold py-0.5 px-2">
                                Best Selling
                            </Badge>
                        )}
                        {product.is_featured && (
                            <Badge variant="damascus" className="text-[10px] uppercase font-bold py-0.5 px-2">
                                Featured Piece
                            </Badge>
                        )}
                        {(product.is_trending || product.is_top_rated) && !product.is_best_selling && (
                            <Badge variant="gold" className="text-[10px] uppercase font-bold py-0.5 px-2">
                                Masterwork
                            </Badge>
                        )}
                    </div>

                    {/* Product Image with Hover Zoom */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image 
                            src={product.main_image || '/product.jpg'} 
                            alt={product.name} 
                            width={280} 
                            height={280} 
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                            loading="lazy"
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108" 
                        />
                    </div>

                    {/* Subtle Quick View Overlay Indicator */}
                    <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/95 text-neutral-900 text-xs font-semibold shadow-lg backdrop-blur-sm">
                            <Eye className="w-3.5 h-3.5 text-[#8C6D23]" />
                            <span>View Specs</span>
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-neutral-900 group-hover:text-[#8C6D23] transition-colors mb-2 capitalize line-clamp-2 font-[family-name:var(--font-outfit)] leading-snug">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2.5">
                    <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} 
                            />
                        ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-mono ml-1">
                        ({(product.rating || 5.0).toFixed(1)})
                    </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-3 mt-auto">
                    <span className="text-xl font-bold text-neutral-900 font-[family-name:var(--font-outfit)]">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                        <span className="text-xs text-neutral-400 line-through font-mono">
                            ${Number(product.compare_price).toFixed(2)}
                        </span>
                    )}
                </div>

                <p className="text-xs text-neutral-500 line-clamp-1 mb-4 font-[family-name:var(--font-cabin)]">
                    {product.delivery_date || 'Estimated delivery in 2-4 working days'}
                </p>
            </Link>

            {showAddToCart && (
                <motion.button 
                    whileTap={{ scale: 0.96 }}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-[#D6AF66] to-[#F27F0C] hover:opacity-95 text-white shadow-sm hover:shadow-md"
                    onClick={handleAddToCart}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Cart</span>
                </motion.button>
            )}
        </motion.div>
    );
};

export default ProductCard;

