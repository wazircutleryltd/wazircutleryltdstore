import React from "react";
import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { supabase, PRODUCT_CARD_SELECT } from "@/lib/supabase";

// Incremental Static Regeneration (ISR): serve cached HTML in milliseconds, revalidating in background
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Wazir Cutlery - Premium Handcrafted Knives & Swords",
  description: "Discover the legacy of Wazirabad with Wazir Cutlery. We offer exquisite, handcrafted knives, collector swords, and professional chef cutlery, forged from high-carbon and Damascus steel by master artisans. Shop our collection of timeless, high-performance blades.",
  alternates: {
    canonical: 'https://wazircutlery.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://wazircutlery.com/',
    title: 'Wazir Cutlery - Premium Handcrafted Knives & Swords',
    description: 'Exquisite, handcrafted knives, swords, and chef cutlery forged from premium materials. Shop our collection of timeless, high-performance blades.',
    images: [
      {
        url: 'https://wazircutlery.com/og-home.png',
        width: 1200,
        height: 630,
        alt: 'A collection of handcrafted knives from Wazir Cutlery',
      },
    ],
    siteName: 'Wazir Cutlery',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wazircutlery',
    creator: '@wazircutlery',
    title: 'Wazir Cutlery - Premium Handcrafted Knives & Swords',
    description: 'Exquisite, handcrafted knives, swords, and chef cutlery forged from premium materials. Shop our collection of timeless, high-performance blades.',
    images: ['https://wazircutlery.com/og-home.png'],
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

export default async function Home() {
  // Fetch initial home data on server in parallel to eliminate client waterfalls and skeletons
  const [
    { data: categories },
    { data: trending },
    { data: featured },
    { data: swords },
    { data: knives },
    { data: forYou },
  ] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select(PRODUCT_CARD_SELECT)
      .eq('is_active', true)
      .or('is_trending.eq.true,is_top_rated.eq.true')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select(PRODUCT_CARD_SELECT)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select(`${PRODUCT_CARD_SELECT}, categories!inner(slug)`)
      .eq('categories.slug', 'swords')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select(`${PRODUCT_CARD_SELECT}, categories!inner(slug)`)
      .eq('categories.slug', 'knives')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('products')
      .select(PRODUCT_CARD_SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const initialData = {
    categories: (categories || []) as any,
    trending: (trending || []) as any,
    featured: (featured || []) as any,
    swords: (swords || []) as any,
    knives: (knives || []) as any,
    forYou: (forYou || []) as any,
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://wazircutlery.com/',
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where is Wazir Cutlery located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wazir Cutlery is based in Wazirabad, Pakistan, a city world-renowned for its heritage in craftsmanship and cutlery."
        }
      },
      {
        "@type": "Question",
        "name": "What materials are used for Wazir Cutlery knives?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use premium materials including Damascus steel, high-carbon steel, and authentic stag horn for our handcrafted blades and handles."
        }
      },
      {
        "@type": "Question",
        "name": "Does Wazir Cutlery ship worldwide?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we ship our handcrafted knives and collector swords to customers globally, ensuring secure packaging and delivery."
        }
      }
    ]
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Wazir Cutlery Ltd",
    "image": "https://wazircutlery.com/og-home.png",
    "@id": "https://wazircutlery.com",
    "url": "https://wazircutlery.com",
    "telephone": "+923160764052",
    "priceRange": "PKR",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "G.T. Road",
      "addressLocality": "Wazirabad",
      "addressRegion": "Punjab",
      "postalCode": "52000",
      "addressCountry": "PK"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <HomeClient initialData={initialData} />
    </>
  );
}
