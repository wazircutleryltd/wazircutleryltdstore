import React from "react";
import type { Metadata } from "next";
import DashboardClient from "@/components/admin/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage Wazir Cutlery's operations from the admin dashboard.",
};

export default function AdminDashboard() {
  return <DashboardClient />;
}
