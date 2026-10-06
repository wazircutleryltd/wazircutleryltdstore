"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Newsletter from "@/components/Newsletter";
import { useCategoriesWithProductCounts } from "../lib/supabase-hooks";
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingState, ErrorState, NoDataState } from "./common/StateComponents";

const CategoriesClient = () => {
    const [, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const { data: categories, isLoading, error } = useCategoriesWithProductCounts();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const pageSize = 12;
    const total = Array.isArray(categories) ? categories.length : 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = Array.isArray(categories) ? categories.slice(start, end) : [];

    const goToPage = (p: number) => {
        const next = Math.min(Math.max(1, p), totalPages);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(next));
        router.push(`/categories?${params.toString()}`);
    };

    return (
        <>
            <div className="min-h-screen relative overflow-hidden p-6 py-12 lg:py-20">
                <div className="container mx-auto">
                    <div className="text-center mt-24 mb-24">
                        <h2 className="mb-8">Categories</h2>
                    </div>
                    <div className="w-full">
                        {isLoading ? (
                            <LoadingState />
                        ) : error ? (
                            <ErrorState />
                        ) : total === 0 ? (
                            <NoDataState message="No categories found" />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                                {pageItems.map((cat: any) => (
                                    <Link key={cat.id} href={`/product?categoryId=${encodeURIComponent(cat.id)}`}>
                                        <div className="category-card h-72 md:h-96 flex items-center justify-center" style={{backgroundImage: `url('${cat.image_url || "/knife-img.jpg"}')`}}>
                                            <div className="category-overlay w-full h-full flex items-center justify-center">
                                                <h3 className="category-title px-4 capitalize">{cat.name}</h3>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page === 1}
                                    className="px-4 py-2 border rounded-xl text-sm font-semibold disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm font-medium">Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border rounded-xl text-sm font-semibold disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Newsletter />
        </>
    );
};

export default CategoriesClient;
