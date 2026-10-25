import React from "react";
import type { Metadata } from "next";
import KnifeCareClient from "@/components/KnifeCareClient";

export const metadata: Metadata = {
  title: "Damascus Knife Care & Maintenance Guide | Wazir Cutlery",
  description: "Master guide on how to care for hand-forged Damascus steel knives, prevent high-carbon rust, oil blades, condition stag horn handles, and hone sharpening angles.",
  alternates: {
    canonical: "https://wazircutlery.com/knife-care",
  },
  openGraph: {
    title: "Damascus Knife Care & Maintenance Guide | Wazir Cutlery",
    description: "Learn how to preserve the razor bevel, high-carbon edge, and Damascus patterns of your knife for generations.",
    url: "https://wazircutlery.com/knife-care",
    type: "article",
  },
};

export default function KnifeCarePage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Clean, Oil, and Maintain a Damascus Steel Knife",
    "description": "Step-by-step instructions for preserving high-carbon Damascus steel blades, preventing oxidation, and conditioning genuine stag horn handles.",
    "totalTime": "PT5M",
    "supply": [
      { "@type": "HowToSupply", "name": "Food-grade mineral oil or camellia oil" },
      { "@type": "HowToSupply", "name": "Soft microfiber towel" },
      { "@type": "HowToSupply", "name": "Mild dish soap and warm water" }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Hand-wash immediately after use",
        "text": "Wash the blade by hand with warm water and mild soap using a soft sponge. Never place in a dishwasher."
      },
      {
        "@type": "HowToStep",
        "name": "Towel-dry completely",
        "text": "Immediately dry the steel blade, spine, and stag horn handle with a clean microfiber towel to eliminate all standing moisture."
      },
      {
        "@type": "HowToStep",
        "name": "Apply protective mineral oil",
        "text": "Apply 2-3 drops of food-safe mineral oil or Renaissance wax across both sides of the Damascus blade to form a moisture barrier."
      },
      {
        "@type": "HowToStep",
        "name": "Condition stag horn and wood handles",
        "text": "Rub natural beeswax or mineral oil into the antler handle every few months to prevent drying or cracking."
      },
      {
        "@type": "HowToStep",
        "name": "Store outside leather sheath for long term",
        "text": "For long-term storage exceeding two weeks, store the oiled blade in a dry collector box outside of its leather sheath."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <KnifeCareClient />
    </>
  );
}
