import React, { Suspense } from "react";
import type { Metadata } from "next";
import CategoriesClient from "@/components/CategoriesClient";

export const metadata: Metadata = {
  title: "Shop by Category | Wazir Cutlery",
  description: "Explore the diverse categories of handcrafted blades from Wazir Cutlery. Shop by category to find the perfect handmade knives, collector swords, professional chef cutlery, and more.",
  alternates: {
    canonical: 'https://wazircutlery.com/categories',
  },
  openGraph: {
    title: "Shop by Category | Wazir Cutlery",
    description: "Explore the diverse categories of handcrafted blades from Wazir Cutlery.",
    url: 'https://wazircutlery.com/categories',
    type: 'website',
  }
};

export default function CategoriesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wazircutlery.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": "https://wazircutlery.com/categories"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div className="min-h-screen bg-[#0D0B0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D6AF66] border-t-transparent rounded-full animate-spin"></div></div>}>
        <CategoriesClient />
      </Suspense>
    </>
  );
}
