import React from "react";
import type { Metadata } from "next";
import NewsletterClient from "@/components/admin/NewsletterClient";

export const metadata: Metadata = {
  title: "Newsletter Subscribers",
  description: "View and manage email subscribers for Wazir Cutlery.",
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
