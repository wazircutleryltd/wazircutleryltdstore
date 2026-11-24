import React from "react";
import type { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { supabase } from '@/lib/supabase';

// Incremental Static Regeneration (ISR): cache product page HTML for 2 minutes
export const revalidate = 120;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return {
      title: 'Product Not Found',
      robots: { index: false, follow: false },
    };
  }

  // 1. Attempt lookup by slug
  let { data: product } = await supabase
    .from('products')
    .select('name, description, short_description, price, stock_quantity, main_image, slug, sku')
    .eq('slug', slug)
    .single();

  // 2. Fallback: if not found by slug, check if slug is actually an SKU (e.g. UH-103)
  if (!product) {
    const { data: bySku } = await supabase
      .from('products')
      .select('name, description, short_description, price, stock_quantity, main_image, slug, sku')
      .ilike('sku', slug)
      .single();
    product = bySku;
  }

  if (product) {
    const description = product.short_description || 
      `Discover the ${product.name}, a masterfully handcrafted blade from Wazir Cutlery. Forged in Wazirabad from premium materials for exceptional performance and durability.`;
    
    return {
      title: `${product.name} | Wazir Cutlery`,
      description: description,
      alternates: {
        canonical: `https://wazircutlery.com/product/${product.slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: product.name,
        description: description,
        type: 'website',
        url: `https://wazircutlery.com/product/${product.slug}`,
        images: [
          {
            url: product.main_image,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
      },
      other: {
        'product:price:amount': String(product.price),
        'product:price:currency': 'PKR',
        'product:availability': product.stock_quantity > 0 ? 'instock' : 'oos',
      },
    };
  }

  return {
    title: "Product Not Found | Wazir Cutlery",
    description: "The product you are looking for is not available. Explore other handcrafted blades from Wazir Cutlery.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Fetch product by slug
  let { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  // 2. If not found by slug, check if the URL parameter is an SKU (fixes Soft 404 for old SKU links like /product/UH-103)
  if (!product) {
    const { data: bySku } = await supabase
      .from('products')
      .select('slug')
      .ilike('sku', slug)
      .single();

    if (bySku?.slug) {
      redirect(`/product/${bySku.slug}`, RedirectType.replace);
    }

    // 3. If neither slug nor SKU exists, trigger standard HTTP 404 (eliminates Soft 404)
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.main_image,
    "description": product.description || product.short_description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "Wazir Cutlery"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://wazircutlery.com/product/${product.slug}`,
      "priceCurrency": "PKR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "originAddress": {
      "@type": "PostalAddress",
      "addressLocality": "Wazirabad",
      "addressRegion": "Punjab",
      "addressCountry": "PK"
    },
    ...(product.rating > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.review_count || 1
      }
    })
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://wazircutlery.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": "https://wazircutlery.com/categories"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://wazircutlery.com/product/${product.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient slug={slug} initialProduct={product as any} />
    </>
  );
}
