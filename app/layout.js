import {Open_Sans, Outfit, Cabin} from "next/font/google";
import "./globals.css";
import SupabaseClientProvider from "../components/SupabaseClientProvider";
import ClerkProviderWrapper from "../components/ClerkProviderWrapper";
import { CartProvider } from "@/contexts/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleReCaptchaV3Provider from "../components/GoogleReCaptchaV3Provider";
import ConditionalWhatsAppIcon from "../components/ConditionalWhatsAppIcon";
import { Analytics } from '@vercel/analytics/next';

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

export const viewport = {
  themeColor: "#111827",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wazir Cutlery',
    url: 'https://wazircutlery.com',
    logo: 'https://wazircutlery.com/logo.svg',
    sameAs: [
      'https://www.linkedin.com/company/wazircutlery',
      'https://twitter.com/wazircutlery',
      'https://www.instagram.com/wazircutlery',
    ],
    description: 'Wazir Cutlery offers premium quality knives and cutlery, handcrafted for chefs and home cooks.',
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
  };

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
        </head>
        <body className={`${outfit.variable} ${cabin.variable} ${openSans.variable} antialiased`}>
          <GoogleReCaptchaV3Provider>
            <SupabaseClientProvider>
              <CartProvider>
                {children}
                <ToastContainer position="top-right" />
                <ConditionalWhatsAppIcon />
              </CartProvider>
            </SupabaseClientProvider>
          </GoogleReCaptchaV3Provider>
          <Analytics />
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}