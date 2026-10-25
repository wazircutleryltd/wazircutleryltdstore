import type { MetadataRoute } from 'next';
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://wazircutlery.com";

  // Core static and knowledge routes
  const staticPaths: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/product", priority: 0.9, changeFrequency: "daily" },
    { path: "/categories", priority: 0.9, changeFrequency: "weekly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/knife-care", priority: 0.85, changeFrequency: "weekly" }, // Major SEO authority asset
    { path: "/faq", priority: 0.85, changeFrequency: "weekly" },       // Major AEO question engine asset
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
    // Dynamic Product routes
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true);

    const productRoutes: MetadataRoute.Sitemap = ((products || []) as { slug: string; updated_at?: string }[]).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
