import React from "react";
import type { Metadata } from "next";
import ProductsClient from "@/components/admin/ProductsClient";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage product inventory, pricing, and details for Wazir Cutlery.",
};

export default function ProductsPage() {
  return <ProductsClient />;
}
