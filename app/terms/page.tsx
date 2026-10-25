import React from "react";
import type { Metadata } from "next";
import TermsClient from "@/components/TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service & Ownership Compliance | Wazir Cutlery",
  description: "Review Wazir Cutlery terms of service, age verification requirements (18+), knife ownership compliance, and custom commission guidelines.",
  alternates: {
    canonical: "https://wazircutlery.com/terms",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
