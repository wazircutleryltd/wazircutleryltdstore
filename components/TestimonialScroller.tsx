'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const testimonialsData = [
    {
        name: 'Ali',
        image: '/ali.svg',
        quote: "Wazir cutlery's blades combine strength, precision, and beautiful craftsmanship. Every piece tells a story of quality and tradition.",
    },
    {
        name: 'M Rafy',
        image: '/m-rafy.svg',
        quote: "Outstanding quality and exceptional service. These blades are not just tools, they're works of art that perform flawlessly.",
    },
    {
        name: 'Zain',
        image: '/zain.svg',
        quote: "The craftsmanship is incredible. Each blade feels perfectly balanced and the attention to detail is remarkable. Highly recommended!",
    },
];

// Duplicate for infinite scroll
const extendedTestimonials = [...testimonialsData, ...testimonialsData];

interface TestimonialItem {
    name: string;
    image: string;
    quote: string;
}

interface TestimonialCardProps {
    testimonial: TestimonialItem;
    isFeatured: boolean;
}

const TestimonialCard = ({ testimonial, isFeatured }: TestimonialCardProps) => {
    const articleClass = `flex items-start gap-4 lg:gap-6 p-4 lg:p-6 bg-white rounded-lg border border-gray-200 hover-lift transition-all duration-500 ease-in-out ${isFeatured ? 'mr-16 lg:mr-20' : 'ml-12 lg:ml-20'}`;
    const barClass = `w-3 rounded-lg flex-shrink-0 self-stretch transition-colors duration-500 ease-in-out ${isFeatured ? 'bg-[#F27F0C]' : 'bg-gray-200'}`;

    return (
        <article className={articleClass}>
            <div className={barClass}></div>
            <div className="w-16 h-16 lg:w-20 lg:h-20 relative flex-shrink-0">
                <Image src={testimonial.image} alt={testimonial.name} fill className="rounded-full object-cover" priority />
            </div>
            <div className="flex flex-col gap-2 flex-grow relative">
                <div className="absolute right-0 -top-1">
                    <Image src="/quotes.svg" alt="5 star rating" width={90} height={16} style={{ width: '90px', height: '16px' }} />
                </div>
                <h3 className="font-outfit font-bold text-xl lg:text-2xl mt-4">{testimonial.name}</h3>
                <blockquote className="font-outfit font-normal text-gray-600 text-sm lg:text-base">
                    &quot;{testimonial.quote}&quot;
                </blockquote>
            </div>
        </article>
    );
};

const TestimonialScroller = () => {
    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const [featuredIndex, setFeaturedIndex] = useState(1); // Start with the second item featured

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const targetEl = entry.target as HTMLElement;
                        const index = parseInt(targetEl.dataset.index || '0', 10);
                        setFeaturedIndex(index % testimonialsData.length);
                    }
                });
            },
            {
                root: scroller,
                rootMargin: '-50% 0px -50% 0px', // Trigger when element is in the vertical center
                threshold: 0,
            }
        );

        const items = scroller.querySelectorAll('.testimonial-item-wrapper');
        items.forEach((item: Element) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section className="mx-auto container px-4 flex flex-col lg:flex-row items-center justify-center gap-6 py-8 lg:py-16 animate-fade-up">
                <div className="flex flex-col gap-6 w-full items-center justify-center lg:w-2/5">
                    <div className="flex flex-col gap-4">
                        <h2 className="font-cabin font-medium text-2xl lg:text-3xl  leading-normal">
                            What Our Warriors & Collectors Say About Us
                        </h2>
                        <p className="font-outfit font-normal  text-lg leading-relaxed">
                            Trusted by warriors, collectors, and adventurers worldwide — hear their real experiences with our blades, tools, and timeless craftsmanship.
                        </p>
                    </div>
                    <button className="inline-flex h-12 lg:h-14 items-center justify-center gap-2 px-6 lg:px-8 py-3 bg-[#F27F0C] text-white rounded-xl font-outfit text-lg btn-primary self-start hover:bg-orange-500 transition-all duration-300">
                        Join Now
                    </button>
                </div>

                <div ref={scrollerRef} className="w-full lg:w-3/5 space-y-4 testimonial-scroller">
                    <div className="testimonial-scroller-inner">
                        {extendedTestimonials.map((testimonial, index) => (
                            <div key={index} className="testimonial-item-wrapper" data-index={index}>
                                <TestimonialCard
                                    testimonial={testimonial}
                                    isFeatured={featuredIndex === (index % testimonialsData.length)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <style jsx global>{`
                .testimonial-scroller {
                    height: 500px; /* Adjust to fit approx 3 cards */
                    overflow: hidden;
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                }
                .testimonial-scroller-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem; /* space-y-4 */
                    animation: scroll-up 15s linear infinite;
                }
                @keyframes scroll-up {
                    from {
                        transform: translateY(0);
                    }
                    to {
                        transform: translateY(-50%);
                    }
                }
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
            `}</style>
        </>
    );
};

export default TestimonialScroller;
