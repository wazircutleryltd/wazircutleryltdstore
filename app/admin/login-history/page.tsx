import React from "react";
import type { Metadata } from "next";
import LoginHistoryClient from "@/components/admin/LoginHistoryClient";

export const metadata: Metadata = {
  title: "Login History",
  description: "View administrator login history and security audit logs.",
};

export default function LoginHistoryPage() {
  return <LoginHistoryClient />;
}
