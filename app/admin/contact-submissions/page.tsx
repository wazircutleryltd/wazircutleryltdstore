import React from "react";
import type { Metadata } from "next";
import ContactSubmissionsClient from "@/components/admin/ContactSubmissionsClient";

export const metadata: Metadata = {
  title: "Contact Inquiries",
  description: "View and manage contact form submissions for Wazir Cutlery.",
};

export default function ContactSubmissionsPage() {
  return <ContactSubmissionsClient />;
}
