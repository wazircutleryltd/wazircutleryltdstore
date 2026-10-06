import React from "react";
import type { Metadata } from "next";
import CustomersClient from "@/components/admin/CustomersClient";

export const metadata: Metadata = {
  title: "Customers",
  description: "View and manage customer accounts and records for Wazir Cutlery.",
};

export default function CustomersPage() {
  return <CustomersClient />;
}
