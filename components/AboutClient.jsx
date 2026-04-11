'use client';
import Image from 'next/image';
import React from "react";
import ConditionalLayout from "@/components/ConditionalLayout";
import ContactForm from "@/components/ContactForm";
import TestimonialScroller from "@/components/TestimonialScroller";

const AboutClient = () => {
    return (
        <ConditionalLayout>
            <AboutContent />
        </ConditionalLayout>
    );
};

const AboutContent = () => {
    return (
        <div className="bg-white overflow-x-hidden">
            {/* About Us Section */}
            <section className="mx-auto container px-4 flex flex-col items-center justify-center gap-8 lg:gap-16 py-8 lg:py-16 animate-fade-in">
                <header className="text-center">
                    <h1 className="font-outfit font-medium text-4xl lg:text-6xl  leading-tight">
                        About Us
                    </h1>
                </header>

                <div className="flex flex-col items-center justify-center gap-4 w-full">
                    <h2 className="font-cabin font-medium text-2xl lg:text-4xl xl:text-5xl  text-center leading-tight px-4">
                        Wazir Cutlery – Forged in Tradition, Sharpened for the Future
                    </h2>

                    <div className="text-center font-outfit  w-full px-4">
                        <p className="text-lg lg:text-xl mb-4 leading-relaxed">
                            Nestled in the heart of Wazirabad, the historic city known as the &quot;City of Cutlery&quot;, Wazir Cutlery has been crafting excellence for over 5 years. Our journey began with a simple mission — to bring Pakistan&apos;s rich cutlery heritage to the global stage through uncompromising quality, timeless design, and passionate craftsmanship.
                        </p>

                        <p className="text-lg lg:text-xl mb-4 leading-relaxed">
                            At Wazir Cutlery, every blade tells a story. From professional chef knives, and elegant dining sets to exquisite collector swords, we fuse traditional forging techniques with modern aesthetics. Our artisans, trained in generations-old craftsmanship, forge each product with precision, strength, and a commitment to beauty.
                        </p>

                        <p className="text-lg lg:text-xl mb-6 leading-relaxed">
                            What started in a small workshop in Wazirabad is now a name recognized by chefs, collectors, and cutlery connoisseurs across borders. Whether you&apos;re slicing in the kitchen, gifting elegance, or adding to your collection, Wazir Cutlery delivers a cut above the rest.
                        </p>

                        <p className="font-semibold text-lg lg:text-xl">
                            Because here, it&apos;s not just metal — it&apos;s mastery in your hands.
                        </p>
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <section className="py-12 lg:py-20 px-4 lg:px-8 container mx-auto">
                {/* Cards Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
                    {/* Header Text */}
                    <div className="mb-16">
                        <div className="text-main-primary-buttons text-lg font-semibold mb-2">Wazir Cutlery</div>
                        <h2 className="text-4xl lg:text-5xl font-normal leading-tight max-w-2xl">
                            Looking for Powerful <strong className="text-[#F27F0C] text-3xl lg:text-4xl leading-tight">Blades and Unmatched
                                Craftsmanship?</strong> It&apos;s Time to Choose Wazir Cutlery.
                        </h2>
                    </div>
                    {/* Our Mission Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center justify-center lg:col-span-1 lg:order-1 hover-lift">
                        <h2 className="text-main-primary-buttons text-[34px] font-semibold leading-[48px] mb-6">Our Mission</h2>
                        <p className=" text-center text-lg font-normal leading-normal">
                            To craft blades and tools that combine strength, precision, and artistry, empowering warriors,
                            collectors, and adventurers with unmatched quality and timeless designs.
                        </p>
                    </div>

                    {/* Our Vision Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center justify-center lg:col-span-1 lg:order-2 hover-lift">
                        <h2 className="text-main-primary-buttons text-[34px] font-semibold leading-[48px] mb-6">Our Vision</h2>
                        <p className="text-center text-lg font-normal leading-normal">
                            To become the world&apos;s most trusted name in premium cutlery and battle gear, where tradition meets
                            innovation, and every blade tells a story of power and legacy.
                        </p>
                    </div>

                    {/* Our Purpose Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center justify-center lg:col-span-1 lg:order-3 hover-lift">
                        <h2 className="text-main-primary-buttons text-[34px] font-semibold leading-[48px] mb-6">Our Purpose</h2>
                        <p className="text-center text-lg font-normal leading-normal">
                            To preserve the ancient craft of blade-making, while delivering modern, durable, and inspiring
                            weapons that serve as both functional tools and symbols of honor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Detail Section */}
            <section className="mx-auto container px-4 flex flex-col lg:flex-row gap-6 py-8 lg:py-16 animate-fade-up">
                <div className="flex flex-col gap-6 w-full lg:w-1/2">
                    <div className="flex flex-col gap-4">
                        <h2 className="font-cabin font-medium text-3xl lg:text-4xl leading-tight">
                            Crafted by Hand. Forged by Fire.
                        </h2>
                        <p className="font-outfit font-normal  text-lg leading-relaxed">
                            Our cutlery is the result of time-honored techniques, artisan attention, and select materials. Each blade passes through 12+ stages — from forging, grinding, and polishing to precise finishing by hand.
                            <br /><br />
                            We use only high-carbon steel, Damascus layers, and handle materials like rosewood, ebony, and buffalo horn. Every product reflects our commitment to strength, balance, and beauty.
                        </p>

                        <h3 className="font-medium text-2xl mt-4">
                            Trusted Across Borders
                        </h3>

                        <p className="font-outfit font-normal text-lg leading-relaxed">
                            Over 10,000 blades shipped globally. Customers in {" "}
                            <strong className="font-bold">UAE</strong>, {" "}
                            <strong className="font-bold">USA</strong>, {" "}
                            <strong className="font-bold">UK</strong>, {" "}
                            <strong className="font-bold">KSA</strong>. {" "}
                            Used by top chefs, collectors, and gifting brands worldwide.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 h-64 lg:h-96 relative rounded-3xl overflow-hidden">
                    <Image
                        src="/forging-work.jpg"
                        alt="Artisan Forging High Carbon Steel Blade at Wazir Cutlery Workshop"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-3xl"
                        priority
                    />
                </div>
            </section>

            {/* Testimonials Section */}
            <TestimonialScroller />

            <ContactForm />

            <style jsx global>{`
                .hover-lift {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }
                
                .btn-primary:hover {
                    background-color: rgba(242, 127, 12, 0.9);
                    transform: translateY(-2px);
                    transition: all 0.3s ease;
                }
                
                .animate-fade-in {
                    animation: fade-in 1s ease forwards;
                }
                
                .animate-fade-up {
                    animation: fade-up 1s ease forwards;
                }
                
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: none;
                    }
                }
                
                @keyframes fade-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: none;
                    }
                }
                
                .shadow-custom {
                    box-shadow: 0 0 34px rgba(0, 0, 0, 0.06);
                }
            `}</style>
        </div>
    );
};

export default AboutClient;
