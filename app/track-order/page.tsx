import React from "react";
import type { Metadata } from "next";
import TrackOrderClient from "@/components/TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order | Wazir Cutlery",
  description: "Check the live forging, packaging, and international express transit progress of your handcrafted Wazir Cutlery piece.",
  alternates: {
    canonical: "https://wazircutlery.com/track-order",
  },
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
