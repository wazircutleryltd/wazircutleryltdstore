import type { MetadataRoute } from 'next';
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://wazircutlery.com";

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/contact",
    "/categories",
    "/cart",
    "/checkout",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
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
      priority: 0.7,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
