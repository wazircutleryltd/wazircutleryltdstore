'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ProductDetails = ({ product }: { product: any }) => {
    const { name, short_description, description, price, main_image, images, category, tags, delivery_date, rating } = product;
    const { addToCart } = useCart();

    const [activeImage, setActiveImage] = useState(main_image);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setActiveImage(main_image);
    }, [main_image]);

    const allImages = [main_image, ...(images || [])].filter(Boolean);
    const uniqueImages = Array.from(new Set(allImages));

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success(`${name} added to cart!`, {
            position: "top-right",
            duration: 3000,
        });
    };

    const socialLinks: Record<string, string> = {
        tiktok: 'https://www.tiktok.com/@wazircutlery?_t=ZP-8zmHjcDQuLe&_r=1',
        youtube: 'https://youtube.com/@wazircutleryltd?si=1_jqdKkNlecHfcFz',
        facebook: 'https://www.facebook.com/share/16z6hKB6KL/',
        instagram: 'https://www.instagram.com/wazircutlery?utm_source=qr&igsh=am4yc3Z2ZDV1bTM4'
    };

    const handleShare = (platform: string) => {
        const url = socialLinks[platform];
        if (url) {
            window.open(url, '_blank');
        }
    };


    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-xs text-neutral-500 mb-6">
                <a href="/" className="hover:text-neutral-900 transition-colors">Home</a>
                <span>/</span>
                <a href="/product" className="hover:text-neutral-900 transition-colors">Shop</a>
                <span>/</span>
                <span className="text-neutral-900 font-medium capitalize truncate max-w-[280px] sm:max-w-md">{name}</span>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
                {/* Left Column: Gallery & Thumbnails */}
                <div className="lg:col-span-6 flex flex-col gap-4">
                    <div className="w-full aspect-square rounded-2xl bg-white border border-[#D6AF66]/25 shadow-sm p-4 flex items-center justify-center overflow-hidden relative group">
                        <Image 
                            src={activeImage} 
                            alt={name} 
                            width={580} 
                            height={580} 
                            priority 
                            sizes="(max-width: 1024px) 100vw, 580px"
                            className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105" 
                        />
                    </div>

                    {/* Integrated Gallery Thumbnails */}
                    {uniqueImages.length > 1 && (
                        <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none" aria-label="Product thumbnails">
                            {uniqueImages.map((image, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setActiveImage(image)} 
                                    className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border-2 p-1.5 transition-all duration-200 cursor-pointer ${activeImage === image ? 'border-[#D6AF66] shadow-sm' : 'border-neutral-200 hover:border-neutral-300 opacity-70 hover:opacity-100'}`}
                                    aria-label={`Product thumbnail ${index + 1}`}
                                >
                                    <Image 
                                        src={image || '/product.jpg'} 
                                        alt={`${name} thumbnail ${index + 1}`} 
                                        width={80} 
                                        height={80} 
                                        className="object-contain w-full h-full" 
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Product Info & Actions */}
                <article className="lg:col-span-6 flex flex-col">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#D6AF66]/15 border border-[#D6AF66]/35 text-[#8C6D23] text-xs font-semibold tracking-wider uppercase self-start mb-3">
                        <span>Wazirabad Master Forge</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight capitalize font-[family-name:var(--font-outfit)] mb-3">
                        {name}
                    </h1>

                    {/* Ratings & Stock */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center text-amber-500" role="img" aria-label={`${rating || 5} star rating`}>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={i < Math.floor(rating || 5) ? "text-amber-400" : "text-neutral-300"}>★</span>
                            ))}
                            <span className="text-xs text-neutral-500 font-mono ml-1.5">
                                ({(rating || 5.0).toFixed(1)})
                            </span>
                        </div>
                        <span className="text-neutral-300">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            In Stock & Ready to Ship
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-3xl font-bold text-neutral-900 font-[family-name:var(--font-outfit)]">
                            ${price}
                        </span>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed mb-6 font-[family-name:var(--font-cabin)]">
                        {short_description || (description ? `${description.substring(0, 160)}...` : '')}
                    </p>

                    <div className="border-t border-neutral-200/80 pt-6 mb-6">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between border border-neutral-300 rounded-xl px-3 py-2 bg-white sm:w-32">
                                <span className="text-xs text-neutral-500 font-medium">Qty:</span>
                                <select 
                                    id="quantity" 
                                    className="text-sm font-semibold text-neutral-900 bg-transparent border-none outline-none cursor-pointer"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                >
                                    {[1, 2, 3, 4, 5, 10].map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Add to Cart Button */}
                            <button 
                                className="flex-1 py-3 px-6 bg-neutral-900 hover:bg-[#D6AF66] text-white hover:text-neutral-900 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                                onClick={handleAddToCart}
                            >
                                <span>Add To Cart</span>
                                <span>•</span>
                                <span>${(Number(price) * quantity).toFixed(2)}</span>
                            </button>
                        </div>

                        <p className="text-xs text-neutral-500 font-medium">
                            🚚 {product.delivery_date || 'Estimate delivery in 2-4 working days via tracked courier.'}
                        </p>
                    </div>

                    {/* Trust Signals */}
                    <div className="grid grid-cols-2 gap-3 py-4 px-4 bg-neutral-50/80 rounded-xl border border-neutral-200/60 mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">🛡️</span>
                            <span className="text-xs font-semibold text-neutral-800">100% Hand-Forged Steel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">✨</span>
                            <span className="text-xs font-semibold text-neutral-800">Master Crafter Verified</span>
                        </div>
                    </div>

                    {/* Meta Details */}
                    <div className="space-y-1.5 text-xs text-neutral-500 border-t border-neutral-200/80 pt-4 mb-6">
                        <p>
                            <span className="font-semibold text-neutral-800">Category: </span>
                            <span className="capitalize">{category?.name || 'Handcrafted Cutlery'}</span>
                        </p>
                        {tags && tags.length > 0 && (
                            <p>
                                <span className="font-semibold text-neutral-800">Tags: </span>
                                <span>{tags.join(', ')}</span>
                            </p>
                        )}
                    </div>

                    {/* Share Buttons */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-neutral-700">Share this piece:</span>
                        <div className="flex gap-2">
                            <button onClick={() => handleShare('facebook')} className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center transition-all hover:bg-neutral-100 cursor-pointer shadow-2xs" aria-label="Share on Facebook">
                                <Image src="/facebook-logo.svg" width={16} height={16} className="w-4 h-4 object-contain" alt="Facebook" />
                            </button>
                            <button onClick={() => handleShare('instagram')} className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center transition-all hover:bg-neutral-100 cursor-pointer shadow-2xs" aria-label="Share on Instagram">
                                <Image src="/instagram-logo.svg" width={16} height={16} className="w-4 h-4 object-contain" alt="Instagram" />
                            </button>
                            <button onClick={() => handleShare('youtube')} className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center transition-all hover:bg-neutral-100 cursor-pointer shadow-2xs" aria-label="Share on YouTube">
                                <Image src="/youtube.svg" width={16} height={16} className="w-4 h-4 object-contain" alt="YouTube" />
                            </button>
                            <button onClick={() => handleShare('tiktok')} className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center transition-all hover:bg-neutral-100 cursor-pointer shadow-2xs" aria-label="Share on TikTok">
                                <Image src="/tiktok.svg" width={16} height={16} className="w-4 h-4 object-contain" alt="TikTok" />
                            </button>
                        </div>
                    </div>
                </article>
            </section>

            {/* Artisan Description & Specifications */}
            {description && (
                <section className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 mb-12 shadow-2xs">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-4 font-[family-name:var(--font-outfit)]">
                        Artisan Description & Craft Notes
                    </h2>
                    <div className="text-neutral-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-[family-name:var(--font-cabin)]">
                        {description}
                    </div>
                </section>
            )}
        </main>
    );
};

export default ProductDetails;
