'use client';
import Image from "next/image";
import Link from "next/link";
import { useActiveProducts } from "@/lib/hooks";
import { useActiveCategories } from "@/lib/supabase-hooks";
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
                                <Image src="/hero-section-image.svg" alt="Wazir Cutlery Forged Blades and Chef Knives" width={500} height={500} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};


const PromoCardsSection = () => {
    return (
        <div className="p-6 lg:p-12">
            <div className="container mx-auto grid md:grid-cols-2 gap-8">
                <div className="bg-[#F8F3F0] shadow-xl rounded-3xl p-8 flex items-center space-x-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">Deals & Promotions</h3>
                        <p className="text-gray-600">Shop Today&apos;s Deals, Lightning Deals, and limited time discounts</p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 flex items-center justify-center relative">
                            <Image src="/clock.png" alt="clock" width={96} height={96} />
                        </div>
                    </div>
                </div>
                <div className="bg-[#F8F3F0] shadow-xl rounded-3xl p-8 flex items-center space-x-6">
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">Deals & Promotions</h3>
                        <p className="text-gray-600">Shop Today&apos;s Deals, Lightning Deals, and limited time discounts</p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 flex items-center justify-center relative">
                            <Image src="/clock.png" alt="clock" width={96} height={96} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HeroImageSlider = () => {
    const images = [
        '/sale-offer.png',
        '/sale-offer.png',
        '/sale-offer.png',
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = images.length;
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 4000);
        return () => clearInterval(interval);
    }, [totalSlides]);
    const goToSlide = (idx) => setCurrentSlide(idx);
    return (
        <div className="p-6 lg:p-12">
            <div className="container mx-auto">
                <div className="rounded-3xl shadow-xl overflow-hidden relative h-96 md:h-80">
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            className={`slide absolute inset-0 flex items-center justify-between ${idx === currentSlide ? 'active' : ''} ${idx < currentSlide ? 'prev' : ''}`}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                        >
                            <Image src={src} alt="slider" fill className="object-cover" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-6 space-x-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            className={`dot w-2 h-2 rounded-full bg-gray-400${idx === currentSlide ? ' active' : ''}`}
                            onClick={() => goToSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
                <style jsx>{`
                    .slide { opacity: 0.4; transform: translateX(100%); }
                    .slide.active { opacity: 1; transform: translateX(0); }
                    .slide.prev { transform: translateX(-100%); }
                    .dot { transition: all 0.3s ease; }
                    .dot.active { background-color: #F27F0C; }
                `}</style>
            </div>
        </div>
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
    const { data: products, isLoading: productsLoading } = useActiveProducts();
    const { data: categories, isLoading: categoriesLoading } = useActiveCategories();

    return (
        <>
            <NewHeroSection />
            <HeroImageSlider />
            <PromoCardsSection />
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
                            <Image src="daraz-logo.svg" width={256} height={256}
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
                            {categories && categories.length > 0 ? categories.slice(0, 5).map((cat) => (
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

            <section className="bg-[#F27F0C] p-6 py-12 lg:py-20">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16">
                        <div className="order-2 lg:order-1">
                            <h3 className="other-heading font-medium text-heading-lg text-white mb-6">
                                Wazir Cutlery – Forged in Tradition, Sharpened for the Future
                            </h3>
                            <p className="font-body font-normal text-base lg:text-lg text-white leading-relaxed">
                                Wazir Cutlery – Forged in Tradition, Sharpened for the Future
                                Nestled in the heart of Wazirabad, the historic city known as the “City of Cutlery”,
                                Wazir Cutlery has been crafting excellence for over 5 years. Our journey began with a simple mission — to
                                bring Pakistan’s rich cutlery heritage to the global stage through uncompromising quality,
                                timeless design, and passionate craftsmanship.
                            </p>
                            <p className="font-normal text-base lg:text-lg text-white leading-relaxed">
                                At Wazir Cutlery, every blade tells a story. From professional chef knives and elegant dining sets
                                to exquisite collector swords, we fuse traditional forging techniques with modern aesthetics.
                                Our artisans, trained in generations-old craftsmanship, forge each product with precision, strength,
                                and a commitment to beauty.
                            </p>
                            <p className="font-normal text-base lg:text-lg text-white leading-relaxed">
                                What started in a small workshop in Wazirabad is now a name recognized by chefs, collectors,
                                and cutlery connoisseurs across borders. Whether you’re slicing in the kitchen, gifting elegance,
                                or adding to your collection, Wazir Cutlery delivers a cut above the rest.
                            </p>
                            <strong className="text-base lg:text-lg text-white leading-relaxed">Because here, it’s not just metal — it’s mastery in your hands.</strong>
                        </div>

                        <div className="order-1 lg:order-2 h-full">
                            <div className="relative h-full">
                                <Image
                                    src="/about-section-img.jpg"
                                    width={256}
                                    height={256}
                                    alt="Wazir Cutlery Artisan Workshop in Wazirabad"
                                    className="w-full h-full rounded-2xl"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="bg-[#D6AF66] w-28 h-28 rounded-full flex items-center justify-center">
                                        <Image src="/play-icon.svg" width={56} height={56} alt="Play" className="w-8 h-8 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <TestimonialScroller />
            <ForYouItems />
            <Newsletter />
            <ContactForm />
        </>
    );
}
