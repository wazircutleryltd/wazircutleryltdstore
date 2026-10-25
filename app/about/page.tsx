import React from "react";
import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "About Wazir Cutlery - Our Heritage and Craftsmanship",
  description: "Learn about Wazir Cutlery, a family-owned business from Wazirabad, the 'City of Cutlery.' Discover our passion for crafting high-quality, handmade knives, swords, and cutlery using traditional techniques and premium materials like Damascus and high-carbon steel. Our heritage is forged in every blade.",
  alternates: {
    canonical: 'https://wazircutlery.com/about',
  },
  openGraph: {
    type: 'website',
    url: 'https://wazircutlery.com/about',
    title: 'About Wazir Cutlery - Our Heritage and Craftsmanship',
    description: 'Learn about our family-owned business, our passion for crafting high-quality knives, and the traditional techniques we use.',
    images: [
      {
        url: 'https://wazircutlery.com/og-about.png',
        width: 1200,
        height: 630,
        alt: 'The Wazir Cutlery Team',
      },
    ],
    siteName: 'Wazir Cutlery',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wazircutlery',
    creator: '@wazircutlery',
    title: 'About Wazir Cutlery - Our Heritage and Craftsmanship',
    description: 'Learn about our family-owned business, our passion for crafting high-quality knives, and the traditional techniques we use.',
    images: ['https://wazircutlery.com/og-about.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Wazir Cutlery',
    description: 'Learn about the heritage of Wazir Cutlery, master artisans of handcrafted knives and swords from Wazirabad. We combine generations of tradition with premium materials to forge exceptional blades.',
    url: 'https://wazircutlery.com/about',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://wazircutlery.com#org',
      name: 'Wazir Cutlery',
      url: 'https://wazircutlery.com',
      logo: 'https://wazircutlery.com/logo.svg',
      founder: [
        {
          '@type': 'Person',
          name: 'Hassan Mughal',
        },
        {
          '@type': 'Person',
          name: 'Qamar',
        },
      ],
      sameAs: [
        'https://www.linkedin.com/company/wazircutlery',
        'https://twitter.com/wazircutlery',
        'https://www.instagram.com/wazircutlery',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  );
}
