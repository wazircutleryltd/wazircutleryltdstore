'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product, showAddToCart = true }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`${product.name} added to cart!`, {
            position: "top-right",
            autoClose: 3000,
        });
    };

    return (
        <div className="card-border p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <Link href={`/product/${product.slug}`} className="cursor-pointer flex-grow">
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
                            className="w-full h-full object-contain" 
                        />
                    </div>
                </div>

                <h3 className="outfit-font product-title mb-3 capitalize">{product.name}</h3>

                <div className="flex items-center mb-3">
                    <div className="flex star-rating">
                        {'★'.repeat(Math.floor(product.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="outfit-font sale-price">${product.price}</span>
                    {product.compare_price && (
                        <span className="outfit-font normal-price">${product.compare_price}</span>
                    )}
                </div>

                <p className="outfit-font delivery-text mb-4 flex-grow">
                    {product.delivery_date || 'Estimate delivery in 2-3 working days'}
                </p>
            </Link>

            {showAddToCart && (
                <button 
                    className="cta-button-new w-full py-2 rounded-md font-medium mt-2 cursor-pointer"
                    onClick={handleAddToCart}
                >
                    Add To Cart
                </button>
            )}
        </div>
    );
};

export default ProductCard;
