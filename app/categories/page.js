import CategoriesClient from "@/components/CategoriesClient";

export const metadata = {
  title: "Shop by Category | Wazir Cutlery",
  description: "Explore the diverse categories of handcrafted blades from Wazir Cutlery. Shop by category to find the perfect handmade knives, collector swords, professional chef cutlery, and more.",
  alternates: {
    canonical: 'https://wazircutlery.com/categories',
  },
  openGraph: {
    title: "Shop by Category | Wazir Cutlery",
    description: "Explore the diverse categories of handcrafted blades from Wazir Cutlery.",
    url: 'https://wazircutlery.com/categories',
    type: 'website',
  }
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
