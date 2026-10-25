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
import { FaStar, FaArrowRight, FaHammer } from "react-icons/fa6";

const NewHeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:pt-12 lg:pb-16 bg-gradient-to-b from-[#F5EFE6]/50 via-[#F9F9F6] to-[#F9F9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D6AF66]/15 border border-[#D6AF66]/35 text-[#8C6D23] text-xs font-semibold tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D6AF66] animate-pulse" />
                        <span>Master Forge • Wazirabad, Pakistan</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]">
                        Forged Blades of Power, Strength, and Timeless Legacy
                    </h1>

                    <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
                        Where centuries of traditional Pakistani bladesmithing meet modern metallurgy, shaping knives and swords destined to become heirlooms.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link href="/product">
                            <button className="cta-button">
                                Explore Collection
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="inline-flex items-center justify-center py-2.5 px-6 rounded-lg text-sm font-semibold text-neutral-800 bg-white border border-neutral-300 hover:border-[#D6AF66] hover:text-[#8C6D23] transition-all duration-200 shadow-2xs">
                                Custom Order
                            </button>
                        </Link>
                    </div>

                    {/* Compact Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200/80 max-w-lg">
                        <div>
                            <div className="text-2xl lg:text-3xl font-bold text-neutral-900 font-[family-name:var(--font-outfit)]">280+</div>
                            <div className="text-xs text-neutral-500 font-medium mt-0.5">Pieces Forged</div>
                        </div>
                        <div className="border-l border-neutral-200 pl-4">
                            <div className="text-2xl lg:text-3xl font-bold text-neutral-900 font-[family-name:var(--font-outfit)]">100%</div>
                            <div className="text-xs text-neutral-500 font-medium mt-0.5">Hand Crafted</div>
                        </div>
                        <div className="border-l border-neutral-200 pl-4">
                            <div className="text-2xl lg:text-3xl font-bold text-neutral-900 font-[family-name:var(--font-outfit)] flex items-center">
                                <span>5.0</span>
                                <FaStar className="h-4 w-4 text-amber-500 fill-amber-500 ml-1.5" />
                            </div>
                            <div className="text-xs text-neutral-500 font-medium mt-0.5">Artisan Rating</div>
                        </div>
                    </div>
                </div>

                {/* Right Content - Framed Luxury Blade Display */}
                <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-md aspect-square rounded-2xl bg-white border border-[#D6AF66]/25 shadow-xl p-6 flex items-center justify-center group overflow-hidden">
                        <Image 
                            src="/hero-section-image.svg" 
                            alt="Wazir Cutlery Forged Blades and Chef Knives" 
                            width={440} 
                            height={440} 
                            priority
                            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-3 left-3 right-3 bg-neutral-950/85 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white flex items-center justify-between shadow-lg">
                            <div>
                                <div className="text-xs font-semibold text-[#D6AF66]">Authentic Steel Craft</div>
                                <div className="text-[11px] text-neutral-300">Custom heat-treated Damascus</div>
                            </div>
                            <span className="text-[10px] font-mono uppercase bg-[#D6AF66]/25 text-[#D6AF66] border border-[#D6AF66]/40 px-2 py-0.5 rounded font-semibold">
                                60+ HRC
                            </span>
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
            <section className="py-10 md:py-14 border-y border-neutral-200/70 bg-white/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Available Worldwide On Trusted Marketplaces
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center justify-items-center">
                        {/* Noon */}
                        <div className="flex items-center justify-center w-full h-16 md:h-20 bg-neutral-50/80 border border-neutral-200/70 rounded-xl p-4 transition-all duration-300 hover:border-[#D6AF66] hover:bg-white hover:shadow-sm">
                            <Image src="/noon-logo.svg" width={140} height={40}
                                   alt="Noon" className="max-h-7 w-auto object-contain" />
                        </div>
                        {/* Amazon */}
                        <div className="flex items-center justify-center w-full h-16 md:h-20 bg-neutral-50/80 border border-neutral-200/70 rounded-xl p-4 transition-all duration-300 hover:border-[#D6AF66] hover:bg-white hover:shadow-sm">
                            <Image src="/amazon-logo.svg"  width={140} height={40}
                                   alt="Amazon" className="max-h-7 w-auto object-contain" />
                        </div>
                        {/* Etsy */}
                        <div className="flex items-center justify-center w-full h-16 md:h-20 bg-neutral-50/80 border border-neutral-200/70 rounded-xl p-4 transition-all duration-300 hover:border-[#D6AF66] hover:bg-white hover:shadow-sm">
                            <Image src="/etsy-logo.svg" width={140} height={40}
                                   alt="Etsy" className="max-h-7 w-auto object-contain" />
                        </div>
                        {/* Daraz */}
                        <div className="flex items-center justify-center w-full h-16 md:h-20 bg-neutral-50/80 border border-neutral-200/70 rounded-xl p-4 transition-all duration-300 hover:border-[#D6AF66] hover:bg-white hover:shadow-sm">
                            <Image src="/daraz-logo.svg" width={140} height={40}
                                   alt="Daraz Online Shopping Mall" className="max-h-7 w-auto object-contain" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                            Featured Categories
                        </h2>
                        <p className="text-sm text-neutral-500 mt-1.5 max-w-md mx-auto">
                            Explore handcrafted blades designed for culinary precision, bushcraft survival, and historic display.
                        </p>
                    </div>

                    {categoriesLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-full aspect-[4/5] bg-neutral-200/60 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                            {categories && categories.length > 0 ? categories.slice(0, 5).map((cat: any) => (
                                <div key={cat.id} className="w-full">
                                    <Link href={`/product?categoryId=${cat.id}`} className="group block">
                                        <div className="category-card aspect-[4/5] rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300" style={{backgroundImage: `url('${cat.image_url}')`}}>
                                            <div className="category-overlay w-full h-full flex flex-col justify-end p-4">
                                                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#D6AF66] transition-colors leading-tight capitalize">
                                                    {cat.name}
                                                </h3>
                                                <span className="text-xs text-neutral-300 font-medium mt-1 inline-flex items-center gap-1.5 group-hover:text-[#D6AF66] transition-colors">
                                                    <span>View Collection</span>
                                                    <FaArrowRight className="h-2.5 w-2.5 group-hover:translate-x-1 transition-transform" />
                                                </span>
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

            {/* Bespoke Commission & Artisan Contact Section */}
            <section id="contact" className="py-16 md:py-24 bg-[#F9F9F6] border-t border-neutral-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AF66]/15 border border-[#D6AF66]/35 text-[#8C6D23] text-xs font-semibold tracking-wider uppercase">
                            <FaHammer className="h-3.5 w-3.5 text-[#D6AF66]" />
                            <span>Custom Bladesmithing & Wholesale</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-[family-name:var(--font-outfit)]">
                            Commission a Masterpiece
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-[family-name:var(--font-cabin)]">
                            Collaborate directly with our master bladesmiths in Wazirabad. From bespoke Damascus hunting knives to commercial B2B cutlery supply, our masters shape steel to your exact vision.
                        </p>
                    </div>
                    <ContactForm />
                </div>
            </section>
        </>
    );
}
