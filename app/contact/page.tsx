import React from "react";
import type { Metadata } from "next";
import ContactClient from "@/components/ContactClient";

export const metadata: Metadata = {
  title: "Contact Wazir Cutlery - We're Here to Help",
  description: "Have questions about Wazir Cutlery's handmade knives, swords, or chef cutlery? Get in touch with our customer support team for inquiries, assistance, or feedback. We're here to help you.",
  alternates: {
    canonical: 'https://wazircutlery.com/contact',
  },
  openGraph: {
    type: 'website',
    url: 'https://wazircutlery.com/contact',
    title: 'Contact Wazir Cutlery - We\'re Here to Help',
    description: 'Get in touch with our customer support team for inquiries, assistance, or feedback on our handmade knives and cutlery.',
    images: [
      {
        url: 'https://wazircutlery.com/og-contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact Wazir Cutlery',
      },
    ],
    siteName: 'Wazir Cutlery',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wazircutlery',
    creator: '@wazircutlery',
    title: 'Contact Wazir Cutlery - We\'re Here to Help',
    description: 'Get in touch with our customer support team for inquiries, assistance, or feedback on our handmade knives and cutlery.',
    images: ['https://wazircutlery.com/og-contact.png'],
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

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Wazir Cutlery',
    description: 'Get in touch with Wazir Cutlery for questions about our products, orders, or any other inquiries.',
    url: 'https://wazircutlery.com/contact',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://wazircutlery.com#org',
      name: 'Wazir Cutlery',
      url: 'https://wazircutlery.com',
      logo: 'https://wazircutlery.com/logo.svg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+923126209302',
        contactType: 'customer service',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactClient />
    </>
  );
}
