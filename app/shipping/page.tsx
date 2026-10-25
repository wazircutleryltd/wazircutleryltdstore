import React from "react";
import type { Metadata } from "next";
import ShippingClient from "@/components/ShippingClient";

export const metadata: Metadata = {
  title: "Worldwide Shipping & Delivery Policy | Wazir Cutlery",
  description: "Learn about Wazir Cutlery worldwide express shipping via DHL and FedEx, 2-4 day delivery timelines, customs clearance, and safe blade packaging.",
  alternates: {
    canonical: "https://wazircutlery.com/shipping",
  },
};

export default function ShippingPage() {
  return <ShippingClient />;
}
