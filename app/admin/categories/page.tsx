import React from "react";
import type { Metadata } from "next";
import CategoriesClient from "@/components/admin/CategoriesClient";

export const metadata: Metadata = {
  title: "Categories",
  description: "Manage product categories for Wazir Cutlery.",
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
