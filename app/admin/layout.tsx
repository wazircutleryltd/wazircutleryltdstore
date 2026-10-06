import React from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminRouteProtection from "../../components/AdminRouteProtection";
import { AdminAuthProvider } from "@/components/AdminAuthProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard - Wazir Cutlery",
    template: "%s | Wazir Cutlery Admin",
  },
  description: "Admin panel for Wazir Cutlery",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminRouteProtection>
        <div className={`flex h-screen bg-gray-100 ${outfit.variable} font-sans`}>
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
              {children}
            </main>
          </div>
        </div>
      </AdminRouteProtection>
    </AdminAuthProvider>
  );
}
