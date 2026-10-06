import React from "react";
import type { Metadata } from "next";
import ThankYouClient from "@/components/ThankYouClient";

export const metadata: Metadata = {
  title: "Thank You",
};

export default function ThankYouPage() {
  return <ThankYouClient />;
}
