import React from "react";
import type { Metadata } from "next";
import FaqClient from "@/components/FaqClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Wazir Cutlery",
  description: "Find comprehensive answers regarding authentic Wazirabad Damascus steel, stag horn antler handles, worldwide customs clearance, shipping timelines, and knife care.",
  alternates: {
    canonical: "https://wazircutlery.com/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Wazir Cutlery",
    description: "Learn about authentic Damascus pattern welding, stag horn sourcing, global knife shipping, and custom forge commissions.",
    url: "https://wazircutlery.com/faq",
    type: "website",
  },
};

export default function FaqPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes Wazirabad Damascus steel world-renowned?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wazirabad is the centuries-old cutlery capital of South Asia. Wazir Cutlery hand-forges pattern-welded Damascus by forge-welding alternating layers of 1095 high-carbon and 15N20 nickel steel, folded 256 to 512 times for strength and distinct rippled aesthetics."
        }
      },
      {
        "@type": "Question",
        "name": "Are your stag horn handles genuine and ethically sourced?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, 100% authentic naturally shed deer antler (stag horn) sourced responsibly after the annual shedding season with zero harm to wildlife."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Rockwell hardness (HRC) of Wazir Cutlery blades?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our blades are vacuum heat-treated and oil-quenched to 58-60 HRC, balancing razor-sharp edge retention with resilience against chipping."
        }
      },
      {
        "@type": "Question",
        "name": "Do you ship knives and swords internationally?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we ship worldwide to over 80 countries including the USA, UK, Canada, and EU via DHL Express and FedEx International Priority with full tracking."
        }
      },
      {
        "@type": "Question",
        "name": "How should I clean and store my Damascus knife to prevent rust?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hand-wash with warm water, dry immediately with a clean towel, and coat lightly with food-grade mineral oil or Renaissance wax. Never place high-carbon knives in a dishwasher."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient />
    </>
  );
}
