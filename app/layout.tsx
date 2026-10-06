import React from "react";
import type { Metadata, Viewport } from "next";
import { Open_Sans, Outfit, Cabin } from "next/font/google";
import "./globals.css";
import SupabaseClientProvider from "../components/SupabaseClientProvider";
import ClerkProviderWrapper from "../components/ClerkProviderWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleReCaptchaV3Provider from "../components/GoogleReCaptchaV3Provider";
import ConditionalWhatsAppIcon from "../components/ConditionalWhatsAppIcon";
import QueryProvider from "../components/QueryProvider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Wazir Cutlery - Premium Quality Knives & Cutlery",
    template: "%s | Wazir Cutlery",
  },
  description: "Discover premium quality knives and cutlery from Wazir Cutlery. Handcrafted for chefs and home cooks. Shop now for the best deals.",
  keywords: ["knives", "cutlery", "chef knives", "kitchen knives", "Wazir Cutlery", "handmade knives"],
  alternates: {
    canonical: 'https://wazircutlery.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://wazircutlery.com/',
    title: 'Wazir Cutlery - Premium Quality Knives & Cutlery',
    description: 'Discover premium quality knives and cutlery from Wazir Cutlery. Handcrafted for chefs and home cooks. Shop now for the best deals.',
    images: [
      {
        url: 'https://wazircutlery.com/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'Wazir Cutlery Products',
      },
    ],
    siteName: 'Wazir Cutlery',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wazircutlery',
    creator: '@wazircutlery',
    title: 'Wazir Cutlery - Premium Quality Knives & Cutlery',
    description: 'Discover premium quality knives and cutlery from Wazir Cutlery. Handcrafted for chefs and home cooks.',
    images: ['https://wazircutlery.com/og-cover.png'],
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
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://wazircutlery.com/#organization',
    name: 'Wazir Cutlery',
    url: 'https://wazircutlery.com',
    logo: 'https://wazircutlery.com/logo.svg',
    image: 'https://wazircutlery.com/og-cover.png',
    description: 'Wazir Cutlery offers premium quality knives and cutlery, handcrafted for chefs and home cooks. Forged in Wazirabad, the city of cutlery.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near High Class Bakers G.T. Road',
      addressLocality: 'Wazirabad',
      addressRegion: 'Punjab',
      postalCode: '52000',
      addressCountry: 'PK'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+923126209302',
      contactType: 'customer service',
      areaServed: 'Worldwide',
      availableLanguage: ['English', 'Urdu']
    },
    founder: [
      {
        '@type': 'Person',
        name: 'Hassan Mughal',
        jobTitle: 'Founder',
        sameAs: 'https://wa.me/+923080601995'
      },
      {
        '@type': 'Person',
        name: 'Qamar Shahzad',
        jobTitle: 'Founder',
        sameAs: 'https://wa.me/+923126209302'
      },
    ],
    sameAs: [
      'https://www.facebook.com/share/16z6hKB6KL/',
      'https://www.instagram.com/wazircutlery',
      'https://youtube.com/@wazircutleryltd',
      'https://www.tiktok.com/@wazircutlery'
    ],
  };

  return (
    <ClerkProviderWrapper>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />
          <meta name="msapplication-TileColor" content="#111827" />
          {/* Google Tag Manager */}
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRQ6PK5T');`,
            }}
          />
          {/* End Google Tag Manager */}
        </head>
        <body className={`${outfit.variable} ${cabin.variable} ${openSans.variable} antialiased`} suppressHydrationWarning>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TRQ6PK5T"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <GoogleReCaptchaV3Provider>
            <SupabaseClientProvider>
              <QueryProvider>
                <CartProvider>
                  {children}
                  <ToastContainer position="top-right" />
                  <ConditionalWhatsAppIcon />
                </CartProvider>
              </QueryProvider>
            </SupabaseClientProvider>
          </GoogleReCaptchaV3Provider>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
