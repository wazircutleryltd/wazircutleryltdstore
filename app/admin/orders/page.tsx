import React from "react";
import type { Metadata } from "next";
import OrdersClient from "@/components/admin/OrdersClient";

export const metadata: Metadata = {
  title: "Orders",
  description: "View, process, and manage customer orders for Wazir Cutlery.",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
