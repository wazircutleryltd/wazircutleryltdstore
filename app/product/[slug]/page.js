import ProductDetailClient from "@/components/ProductDetailClient";
import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }) {
  const { slug } = params;
  if (!slug) {
    return {
        title: 'Product',
        description: "Explore high-quality, handcrafted knives and swords from Wazir Cutlery."
    };
  }

  const { data: product } = await supabase
    .from('products')
    .select('name, description, short_description, price, stock_quantity, main_image')
    .eq('slug', slug)
    .single();

  if (product) {
    const description = product.short_description || 
      `Discover the ${product.name}, a masterfully handcrafted blade from Wazir Cutlery. Forged in Wazirabad from premium materials for exceptional performance and durability.`;
    
    return {
      title: `${product.name} | Wazir Cutlery`,
      description: description,
      alternates: {
        canonical: `https://wazircutlery.com/product/${slug}`,
      },
      openGraph: {
        title: product.name,
        description: description,
        type: 'website',
        url: `https://wazircutlery.com/product/${slug}`,
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
        'product:price:amount': product.price,
        'product:price:currency': 'USD',
        'product:availability': product.stock_quantity > 0 ? 'instock' : 'oos',
      },
    };
  }

  return {
    title: "Product Not Found | Wazir Cutlery",
    description: "The product you are looking for is not available. Explore other handcrafted blades from Wazir Cutlery.",
  };
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  
  // Fetch product for JSON-LD
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    return <ProductDetailClient slug={slug} />;
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
      "priceCurrency": "USD",
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
      <ProductDetailClient slug={slug} />
    </>
  );
}
