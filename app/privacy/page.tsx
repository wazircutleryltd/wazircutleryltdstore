import React from "react";
import type { Metadata } from "next";
import PrivacyClient from "@/components/PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | Wazir Cutlery",
  description: "Learn how Wazir Cutlery protects patron data, ensures transactional privacy, and respects international GDPR and CCPA data rights.",
  alternates: {
    canonical: "https://wazircutlery.com/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
