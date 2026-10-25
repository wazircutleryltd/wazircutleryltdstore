"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import ConditionalLayout from "@/components/ConditionalLayout";
import Newsletter from "@/components/Newsletter";
import { useCategoriesWithProductCountsQuery } from "@/lib/query-hooks";
import { LoadingState, ErrorState, NoDataState } from "./common/StateComponents";
import { FaLayerGroup, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { ChevronRight } from "lucide-react";

export default function CategoriesClient() {
  const { data: categories, isLoading, error } = useCategoriesWithProductCountsQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
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
    params.set("page", String(next));
    router.push(`/categories?${params.toString()}`);
  };

  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Collections</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AF66]/15 border border-[#D6AF66]/30 text-[#8C6D23] text-xs font-bold uppercase tracking-widest">
              <FaLayerGroup className="h-3.5 w-3.5 text-[#D6AF66]" />
              Artisan Curated Collections
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-[family-name:var(--font-outfit)] tracking-tight">
              Shop by Blade Category
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed font-[family-name:var(--font-cabin)]">
              Explore authentic handcrafted Damascus hunting knives, ceremonial swords, culinary chef cutlery, and collector blades forged with generational expertise in Wazirabad.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="w-full">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] rounded-2xl bg-neutral-200/60 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <ErrorState />
            ) : total === 0 ? (
              <NoDataState message="No categories found" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {pageItems.map((cat: any) => {
                  const fallbackImage = "/hero-section-image.svg";
                  const imageUrl = cat.image_url || fallbackImage;
                  const productCount = cat.product_count ?? cat.products?.[0]?.count ?? null;

                  return (
                    <Link
                      key={cat.id}
                      href={`/product?categoryId=${encodeURIComponent(cat.id)}`}
                      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/80 hover:border-[#D6AF66] shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Category Background Image */}
                      <Image
                        src={imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Gradient Overlay for Contrast & Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

                      {/* Top Badge: Product Count or Authentic Steel */}
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#D6AF66] tracking-wider uppercase font-mono shadow-sm">
                          {productCount !== null ? `${productCount} Pieces` : "Master Forged"}
                        </span>
                      </div>

                      {/* Card Content at Bottom */}
                      <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end space-y-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-[#D6AF66] transition-colors leading-tight capitalize font-[family-name:var(--font-outfit)]">
                          {cat.name}
                        </h2>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                          <span>Explore Collection</span>
                          <FaArrowRight className="h-3 w-3 text-[#D6AF66] group-hover:translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:border-[#D6AF66] hover:text-[#8C6D23] text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <FaChevronLeft className="h-3 w-3" />
                  <span>Previous</span>
                </button>
                <span className="px-4 py-2 text-xs font-bold text-neutral-600 bg-neutral-100 rounded-xl">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:border-[#D6AF66] hover:text-[#8C6D23] text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <span>Next</span>
                  <FaChevronRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Newsletter />
    </ConditionalLayout>
  );
}
