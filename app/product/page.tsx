import React, { Suspense } from "react";
import type { Metadata } from "next";
import ProductClient from "@/components/ProductClient";

export const metadata: Metadata = {
  title: "Shop All Products | Wazir Cutlery",
  description: "Shop the full collection of Wazir Cutlery's masterfully crafted blades. Browse our extensive range of handmade knives, collector swords, and professional chef cutlery.",
  alternates: {
    canonical: 'https://wazircutlery.com/product',
  },
  openGraph: {
    title: "Shop All Products | Wazir Cutlery",
    description: "Shop the full collection of Wazir Cutlery's masterfully crafted blades.",
    url: 'https://wazircutlery.com/product',
    type: 'website',
  }
};

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0B0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#D6AF66] border-t-transparent rounded-full animate-spin"></div></div>}>
      <ProductClient />
    </Suspense>
  );
}
