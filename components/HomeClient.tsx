'use client';
import Image from "next/image";
import Link from "next/link";
import { useActiveCategoriesQuery } from "@/lib/hooks";
import TestimonialScroller from "@/components/TestimonialScroller";
import ContactForm from "@/components/ContactForm";
import ConditionalLayout from "@/components/ConditionalLayout";
import React, { useState, useEffect } from "react";
import TrendingItems from "@/components/TrendingItems";
import SwordsItems from "@/components/SwordItems";
import KnivesItems from "@/components/KnivesItems";
import FeaturedItems from "@/components/FeaturedItems";
import ForYouItems from "@/components/ForYouItems";
import Newsletter from "@/components/Newsletter";
import ArtisanCraftReel from "@/components/ArtisanCraftReel";

const NewHeroSection = () => {
  return (
    <section className="relative overflow-hidden">
        <div className="p-6 lg:p-12">
            <div className="container mx-auto px-8 py-8 relative z-10 shadow-xl bg-[#F2F3F5] rounded-3xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
                            Forged Blades of Power, Strength, and Timeless Legacy
                        </h1>

                        <p className="text-lg leading-relaxed max-w-lg">
                            Where ancient artistry meets modern mastery, shaping legends that endure.
                        </p>

                        <Link href={"/categories"}>
                            <button
                                className="cta-button px-8 py-4 rounded-lg transition-colors duration-300 text-lg">
                                Explore Collection
                            </button>
                        </Link>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8">
                            <div className="text-center lg:text-left">
                                <div className="text-3xl lg:text-4xl font-bold">283</div>
                                <div className="text-sm mt-1">Total Customers</div>
                            </div>
                            <div className="text-center lg:text-left border-l border-gray-300 pl-8">
                                <div className="text-3xl lg:text-4xl font-bold">270</div>
                                <div className="text-sm mt-1">Happy Customers</div>
                            </div>
                            <div className="text-center lg:text-left border-l border-gray-300 pl-8">
                                <div className="text-3xl lg:text-4xl font-bold">239</div>
                                <div className="text-sm mt-1">Total Reviews</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Image with overlays */}
                    <div className="relative">
                        <div className="relative">
                            <div className="p-8 relative overflow-hidden">
                                <Image 
                                    src="/hero-section-image.svg" 
                                    alt="Wazir Cutlery Forged Blades and Chef Knives" 
                                    width={500} 
                                    height={500} 
                                    priority
                                    style={{ width: 'auto', height: 'auto' }}
                                    className="max-w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};



export default function HomeClient() {
    return (
        <ConditionalLayout>
            <HomeContent />
        </ConditionalLayout>
    );
}

function HomeContent() {
    const { data: categories, isLoading: categoriesLoading } = useActiveCategoriesQuery();

    return (
        <>
            <NewHeroSection />
            {/* Store Availability Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className=" text-primary text-center text-3xl lg:text-4xl font-bold mb-16">
                        Available on
                    </h2>

                    <p className="font-body font-normal text-base text-center lg:text-lg mb-16 leading-relaxed">
                        Easily discover and access our products across trusted
                        global platforms, ensuring convenience, reliability, and
                        a seamless shopping experience wherever you are.
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 items-center justify-items-center">
                        {/* Noon */}
                        <div className="flex items-center justify-center w-full h-24 md:h-28 bg-[#F8F3F0] border border-[#E0E0E0] rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <Image src="/noon-logo.svg" width={256} height={256}
                                   alt="Noon" className="max-w-full max-h-full object-contain" />
                        </div>
                        {/* Amazon */}
                        <div className="flex items-center justify-center w-full h-24 md:h-28 bg-[#F8F3F0] border border-[#E0E0E0] rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <Image src="/amazon-logo.svg"  width={256} height={256}
                                   alt="Amazon" className="max-w-full max-h-full object-contain" />
                        </div>
                        {/* Etsy */}
                        <div className="flex items-center justify-center w-full h-24 md:h-28 bg-[#F8F3F0] border border-[#E0E0E0] rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <Image src="/etsy-logo.svg" width={256} height={256}
                                   alt="Etsy" className="max-w-full max-h-full object-contain" />
                        </div>
                        {/* Daraz */}
                        <div className="flex items-center justify-center w-full h-24 md:h-28 bg-[#F8F3F0] border border-[#E0E0E0] rounded-2xl shadow-md p-6 md:p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <Image src="/daraz-logo.svg" width={256} height={256}
                                   alt="Daraz Online Shopping Mall" className="max-w-full max-h-full object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="p-6 lg:p-12">
                <div className="container mx-auto">
                    <h2 className=" text-primary text-center text-3xl lg:text-4xl font-bold mb-16">
                        Categories
                    </h2>
                    {categoriesLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full category-card-item animate-pulse">
                                    <div className="category-card h-[300px] bg-gray-200 rounded-lg"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-4">
                            {categories && categories.length > 0 ? categories.slice(0, 5).map((cat: any) => (
                                <div key={cat.id} className="w-full category-card-item">
                                    <Link href={`/product?categoryId=${cat.id}`} className="cursor-pointer">
                                        <div className="category-card h-[300px]" style={{backgroundImage: `url('${cat.image_url}')`}}>
                                            <div className="category-overlay w-full h-full flex items-center justify-center p-6">
                                                <h3 className=" text-2xl lg:text-3xl font-bold text-white leading-tight text-center capitalize">{cat.name}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )) : (
                                <div className="col-span-full text-center text-gray-500 py-8">
                                    No categories available at the moment.
                                </div>
                            )}
                        </div>
                    )}
                    {/* Explore Collection Button */}
                    <div className="text-center mt-12">
                        <Link href="/categories">
                            <button className="bg-highlight text-white px-10 py-4 rounded-lg font-medium text-lg hover:opacity-90 transition-opacity shadow-lg cursor-pointer">
                                Explore Collection
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            <TrendingItems />
            <SwordsItems />
            <KnivesItems />
            <FeaturedItems />

            {/* Artisanal Damascus Bladesmithing Video Showcase */}
            <ArtisanCraftReel />

            <TestimonialScroller />
            <ForYouItems />
            <Newsletter />
            <ContactForm />
        </>
    );
}
