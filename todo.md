# 📋 Stag-Horn / Wazir Cutlery Project: TODO & Refactoring

## ✅ Completed Sprint: Hardening & Global SEO (2026-04-12)
- [x] **Guest Checkout Stabilization**: Fixed `api/orders/route.js` to handle `NULL` user IDs correctly for non-logged-in customers.
- [x] **Backend Single Source of Truth**: Removed all legacy `localStorage` fallbacks in the ordering and admin flows; the system now relies 100% on Supabase.
- [x] **Generative Experience Optimization (GEO)**: Implemented specialized JSON-LD schemas (FAQ, Store, Organization) and AI-friendly `robots.js` to rank in LLM answers (Gemini, Claude, ChatGPT).
- [x] **Technical SEO Fixes**: Resolved critical `ProductCard` routing bug (SKU vs Slug) and enhanced `ProductClient` to support category slugs for cleaner URLs.
- [x] **Data Performance**: Optimized `useProductBySlug` and recommendation logic using relational joins to reduce network round-trips.
- [x] **Landing Page Streamlining**: Removed generic placeholder sections (Hero Slider, Promo Cards) to create a more focused artisan experience.

## ✅ Completed Sprint (2026-04-11)
...

## ✅ Previous Sprint (2026-04-09)
- [x] **Intelligent Image Processing**: Runtime cropping and auto-compression.
- [x] **Dynamic Analytics Dashboard**: Metric cards and recent activity feed.

## 🛠️ Refactoring & Performance (Proposed)

### 1. SEO & Content
- [x] **JSON-LD Breadcrumbs**: Implemented structured data for category paths on product and category pages.
- [x] **Dynamic Metadata**: Enhanced product page metadata with real price and inventory status for Google Rich Snippets.

### 2. Component Decomposition
- [x] **ProductModal Refactor**: Split into modular artisan sections.
- [x] **ProductsClient Refactor**: Decomposed listing into Header, Filters, and Table.

---
*Last updated on 2026-04-11*
