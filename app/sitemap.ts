import type { MetadataRoute } from 'next';
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Automatically regenerate sitemap every hour so newly added products are indexed in real time

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://wazircutlery.com";

  // Core static and knowledge authority routes
  const staticPaths: { path: string; priority: number; changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/product", priority: 0.9, changeFrequency: "daily" },
    { path: "/categories", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/knife-care", priority: 0.85, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.85, changeFrequency: "weekly" },
    { path: "/shipping", priority: 0.8, changeFrequency: "monthly" },
    { path: "/returns", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/track-order", priority: 0.7, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.5, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.5, changeFrequency: "monthly" },
  ];

  const routes: MetadataRoute.Sitemap = staticPaths.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  try {
    // Dynamic Product routes — every active product from Supabase included automatically
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at, created_at, main_image")
      .eq("is_active", true);

    const productRoutes: MetadataRoute.Sitemap = ((products || []) as { 
      slug: string; 
      updated_at?: string; 
      created_at?: string;
      main_image?: string;
    }[]).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      ...(product.main_image ? { images: [product.main_image] } : {}),
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
