import React from "react";
import type { Metadata } from "next";
import TermsClient from "@/components/TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service & Ownership Compliance | Wazir Cutlery",
  description: "Review Wazir Cutlery terms of service, age verification requirements (18+), knife ownership compliance, and custom commission guidelines.",
  alternates: {
    canonical: "https://wazircutlery.com/terms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
