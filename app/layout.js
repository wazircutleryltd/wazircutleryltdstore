import {Open_Sans, Outfit, Cabin} from "next/font/google";
import Script from "next/script";

import "./globals.css";
import SupabaseClientProvider from "../components/SupabaseClientProvider";
import ClerkProviderWrapper from "../components/ClerkProviderWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import GoogleReCaptchaV3Provider from "../components/GoogleReCaptchaV3Provider";
import ConditionalWhatsAppIcon from "../components/ConditionalWhatsAppIcon";
import { Analytics } from "@vercel/analytics/next";


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

export const metadata = {
  title: {
    default: "Wazir Cutlery - Premium Quality Knives & Cutlery",
    template: "%s | Wazir Cutlery",
  },
  description: "Discover premium quality knives and cutlery from Wazir Cutlery. Handcrafted for chefs and home cooks. Shop now for the best deals.",
  keywords: ["knives", "cutlery", "chef knives", "kitchen knives", "Wazir Cutlery", "handmade knives", "Wazirabad knives", "Pakistan cutlery"],
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

export const viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Wazir Cutlery',
      url: 'https://wazircutlery.com',
      logo: 'https://wazircutlery.com/logo.svg',
      sameAs: [
        'https://www.linkedin.com/company/wazircutlery',
        'https://twitter.com/wazircutlery',
        'https://www.instagram.com/wazircutlery',
        'https://facebook.com/wazircutlery',
        'https://youtube.com/@wazircutlery'
      ],
      description: 'Wazir Cutlery offers premium quality knives and cutlery, handcrafted for chefs and home cooks.',
      founder: [
        {
          '@type': 'Person',
          name: 'Hassan Mughal',
        },
        {
          '@type': 'Person',
          name: 'Qamar Shahzad',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://wazircutlery.com/#local-business',
      'name': 'Wazir Cutlery Works',
      'image': 'https://wazircutlery.com/logo.svg',
      'url': 'https://wazircutlery.com',
      'telephone': '+923080601995',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Near High Class Bakers G.T. Road',
        'addressLocality': 'Wazirabad',
        'addressRegion': 'Punjab',
        'postalCode': '52000',
        'addressCountry': 'PK'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '32.4411',
        'longitude': '74.1200'
      },
      'openingHoursSpecification': {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        'opens': '09:00',
        'closes': '18:00'
      },
      'priceRange': '$$'
    }
  ];

  return (
    <ClerkProviderWrapper>
      <html lang="en">
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
        <body className={`${outfit.variable} ${cabin.variable} ${openSans.variable} antialiased`}>
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
              <CartProvider>
                {children}
                <Analytics />
                <Toaster richColors position="top-right" />
                <ConditionalWhatsAppIcon />
              </CartProvider>
            </SupabaseClientProvider>
          </GoogleReCaptchaV3Provider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}