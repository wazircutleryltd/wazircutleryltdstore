import React from "react";
import type { Metadata } from "next";
import ReturnsClient from "@/components/ReturnsClient";

export const metadata: Metadata = {
  title: "Artisan Returns & Lifetime Warranty | Wazir Cutlery",
  description: "Read about our 30-day inspection guarantee, lifetime bladecraft warranty, and straightforward return procedures for handcrafted Damascus knives.",
  alternates: {
    canonical: "https://wazircutlery.com/returns",
  },
};

export default function ReturnsPage() {
  return <ReturnsClient />;
}
