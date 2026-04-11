import { supabase } from "@/lib/supabase";

export default async function sitemap() {
  const baseUrl = "https://wazircutlery.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/contact",
    "/categories",
    "/cart",
    "/checkout",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Dynamic Product routes
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true);

    const productRoutes = (products || []).map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updated_at || new Date()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
