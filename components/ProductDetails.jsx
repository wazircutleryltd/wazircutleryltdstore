'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import RelatedProducts from "@/components/RelatedProducts";
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

const ProductDetails = ({ product }) => {
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
            autoClose: 3000,
        });
    };

    const socialLinks = {
        tiktok: 'https://www.tiktok.com/@wazircutlery?_t=ZP-8zmHjcDQuLe&_r=1',
        youtube: 'https://youtube.com/@wazircutleryltd?si=1_jqdKkNlecHfcFz',
        facebook: 'https://www.facebook.com/share/16z6hKB6KL/',
        instagram: 'https://www.instagram.com/wazircutlery?utm_source=qr&igsh=am4yc3Z2ZDV1bTM4'
    };

    const handleShare = (platform) => {
        const url = socialLinks[platform];
        if (url) {
            window.open(url, '_blank');
        }
    };


    return (
<>
        <main className="container mx-auto px-4 md:px-8 lg:px-24 py-8">
            <h1 className="font-outfit font-medium text-variable-collection-main-primary-color text-3xl md:text-4xl lg:text-[64px] text-center mb-8 md:mb-16 capitalize">
                {name}
            </h1>

            <section className="flex flex-col lg:flex-row items-start justify-center gap-6 mb-16">
                <div className="w-full lg:w-[612px] h-80 md:h-96 lg:h-[612px] rounded-3xl border border-solid border-sub-texts-mute-lable product-image flex items-center justify-center">
                    <Image src={activeImage} alt={name} width={612} height={612} className="object-cover w-full h-full rounded-3xl" />
                </div>

                <article className="w-full lg:w-[612px] flex flex-col gap-6">
                    <h2 className="font-outfit font-semibold text-black text-2xl md:text-[34px] leading-normal">
                        {name}
                    </h2>

                    <div className="flex items-center" role="img" aria-label={`${rating || 0} star rating`}>
                        <div className="flex star-rating">
                            {'★'.repeat(Math.floor(rating || 0))}
                            {'☆'.repeat(5 - Math.floor(rating || 0))}
                        </div>
                    </div>

                    <div className="font-outfit font-bold sale-price text-2xl md:text-[34px]">
                        ${price}
                    </div>

                    <p className="font-outfit text-variable-collection-main-primary-color text-lg leading-normal">
                        {short_description || (description ? `${description.substring(0, 120)}...` : '')}
                    </p>

                    <p className="font-outfit text-sub-texts-mute-lable text-sm">
                        {product.delivery_date || 'Estimate delivery in 2-3 working days'}
                    </p>

                    <hr className="border-t border-sub-texts-mute-lable" />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                        <div className="flex items-center justify-center gap-2.5 px-6 py-3 bg-main-background rounded-xl border border-solid border-main-primary-buttons">
                            <select 
                                id="quantity" 
                                className="font-outfit text-main-primary-buttons text-lg bg-transparent border-none outline-none"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>Qty {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            className="flex items-center justify-center gap-2.5 px-8 py-3.5 bg-main-primary-buttons rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-main-primary-buttons focus:ring-offset-2 w-full sm:w-auto cursor-pointer"
                            onClick={handleAddToCart}
                        >
                            <span className="font-outfit text-main-background text-lg">Add To Cart</span>
                        </button>
                    </div>

                    <hr className="border-t border-sub-texts-mute-lable" />

                    <p className="font-outfit text-lg">
                        <span className="text-black">Category: </span>
                        <span className="text-sub-texts-mute-lable capitalize">{category?.name || 'N/A'}</span>
                    </p>

                    <p className="font-outfit text-lg">
                        <span className="text-black">Tag: </span>
                        <span className="text-sub-texts-mute-lable">{tags?.join(', ') || 'N/A'}</span>
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="font-outfit text-black text-lg">Share this product:</span>
                        <div className="flex gap-6">
                            <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:bg-blue-50 cursor-pointer shadow-sm">
                                <Image
                                    src="/facebook-logo.svg"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-contain"
                                    alt="Facebook Logo"
                                />
                            </button>
                            <button onClick={() => handleShare('instagram')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:bg-pink-50 cursor-pointer shadow-sm">
                                <Image
                                    src="/instagram-logo.svg"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-contain"
                                    alt="Instagram Logo"
                                />
                            </button>
                            <button onClick={() => handleShare('youtube')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:bg-red-50 cursor-pointer shadow-sm">
                                <Image
                                    src="/youtube.svg"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-contain"
                                    alt="YouTube Logo"
                                />
                            </button>
                            <button onClick={() => handleShare('tiktok')} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:bg-gray-100 cursor-pointer shadow-sm">
                                <Image
                                    src="/tiktok.svg"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-contain"
                                    alt="Tik Tok Logo"
                                />
                            </button>
                        </div>
                    </div>

                </article>
            </section>

            <nav className="flex items-center gap-4 mb-16 overflow-x-auto" aria-label="Product thumbnails">
                <button className="flex-shrink-0 w-6 h-6 text-gray-400" aria-label="Previous thumbnail">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>

                <div className="flex gap-4">
                    {uniqueImages.map((image, index) => (
                        <button key={index} onClick={() => setActiveImage(image)} className={`flex-shrink-0 w-20 h-20 md:w-[100px] md:h-[100px] rounded-3xl border border-solid ${activeImage === image ? 'border-main-primary-buttons' : 'border-borders'} product-image`} aria-label={`Product thumbnail ${index + 1}`}>
                           <Image src={image || '/spoon-product.jpg'} alt={`${name} thumbnail ${index + 1}`} width={100} height={100} className="object-cover w-full h-full rounded-3xl" />
                        </button>
                    ))}
                </div>

                <button className="flex-shrink-0 w-6 h-6 text-gray-400" aria-label="Next thumbnail">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
            </nav>

            <section className="flex flex-col items-center gap-8 mb-16">
                <h2 className="font-outfit font-medium text-black text-2xl md:text-[34px] text-center">
                    Description
                </h2>

                <p className="font-outfit text-variable-collection-main-primary-color text-lg leading-relaxed text-left">
                    {description}
                </p>
            </section>
        </main>
        <RelatedProducts />
    </>
    );
};

export default ProductDetails;
