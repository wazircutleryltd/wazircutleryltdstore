import ProductClient from "@/components/ProductClient";

export const metadata = {
  title: "Shop All Products | Wazir Cutlery",
  description: "Shop the full collection of Wazir Cutlery's masterfully crafted blades. Browse our extensive range of handmade knives, collector swords, and professional chef cutlery.",
  alternates: {
    canonical: 'https://wazircutlery.com/product',
  },
  openGraph: {
    title: "Shop All Products | Wazir Cutlery",
    description: "Shop the full collection of Wazir Cutlery's masterfully crafted blades.",
    url: 'https://wazircutlery.com/product',
    type: 'website',
  }
};

export default function ProductPage() {
  return <ProductClient />;
}
