import React from "react";
import type { Metadata } from "next";
import ReturnsClient from "@/components/ReturnsClient";

export const metadata: Metadata = {
  title: "Artisan Returns & Lifetime Warranty | Wazir Cutlery",
  description: "Read about our 30-day inspection guarantee, lifetime bladecraft warranty, and straightforward return procedures for handcrafted Damascus knives.",
  alternates: {
    canonical: "https://wazircutlery.com/returns",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ReturnsPage() {
  return <ReturnsClient />;
}
