# 📋 Wazir Cutlery Ltd Store: Actionable Engineering TODO

> **Status**: Completed Core Modernization Sprints  
> **Last Updated**: 2026-10-25  
> **Stack**: Next.js 16.3 (Turbopack, `proxy.ts`), TypeScript Strict (`allowJs: false`), Zustand v5, TanStack Query v5, TanStack Table v8, Tailwind CSS v4

---

## 🎯 Phase 1: TanStack Query v5 Migration (Eliminate Legacy Hooks)

### 1.1 Query & Mutation Hooks Expansion ([lib/query-hooks.ts](file:///Users/mac/Desktop/stag-horn/lib/query-hooks.ts))
- [x] Add `useCategoriesWithProductCountsQuery()` with relational join count and cache invalidation.
- [x] Add `useAllUsersQuery(page, pageSize, searchTerm)` with server-side pagination and total counts.
- [x] Add `useNewsletterSubscribersQuery()` and `useDeleteNewsletterSubscriberMutation()`.
- [x] Add `useContactSubmissionsQuery()` and `useUpdateContactSubmissionStatusMutation()`.
- [x] Add `useCreateOrderMutation()` for checkout and storefront order flows.
- [x] Add `useAdminLoginMutation()` and `useAdminLoginHistoryQuery()`.

### 1.2 Storefront Components Migration
- [x] **[components/ProductClient.tsx](file:///Users/mac/Desktop/stag-horn/components/ProductClient.tsx)**:
  - Replaced `useActiveProducts`, `useProductsByCategory`, and `useCategoriesWithProductCounts` with TanStack Query hooks.
  - Implemented instant cached transitions between categories without waterfall delays.
- [x] **[components/CategoriesClient.tsx](file:///Users/mac/Desktop/stag-horn/components/CategoriesClient.tsx)**:
  - Replaced `useCategoriesWithProductCounts` with `useCategoriesWithProductCountsQuery`.
- [x] **[components/OrderForm.tsx](file:///Users/mac/Desktop/stag-horn/components/OrderForm.tsx)**:
  - Migrated `useCreateOrder` to `useCreateOrderMutation()`.

### 1.3 Admin Suite Components Migration
- [x] **[components/admin/RecentSales.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/RecentSales.tsx)**:
  - Replaced legacy `useAllOrders` with existing `useAllOrdersQuery(1, 5)`.
- [x] **[components/admin/CustomersClient.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/CustomersClient.tsx)**:
  - Replaced `useAllUsers` with `useAllUsersQuery`.
- [x] **[components/admin/NewsletterClient.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/NewsletterClient.tsx)**:
  - Replaced `useAllNewsletterSubscribers` & `useDeleteNewsletterSubscriber` with TanStack query & mutation.
- [x] **[components/admin/ContactSubmissionsClient.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/ContactSubmissionsClient.tsx)**:
  - Replaced `useAllContactSubmissions` & `useUpdateContactSubmissionStatus` with TanStack query & mutation.
- [x] **[components/admin/CategoryModal.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/CategoryModal.tsx)**:
  - Replaced legacy `useCreateCategory` and `useUpdateCategory` with `useCreateCategoryMutation` and `useUpdateCategoryMutation`.
- [x] **[components/LoginClient.tsx](file:///Users/mac/Desktop/stag-horn/components/LoginClient.tsx)** & **[components/admin/LoginHistoryClient.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/LoginHistoryClient.tsx)**:
  - Modernized admin authentication hooks with TanStack patterns.

---

## 🧹 Phase 2: Codebase Hygiene & Zero-Warning ESLint

- [x] Retired obsolete [lib/supabase-hooks.ts](file:///Users/mac/Desktop/stag-horn/lib/supabase-hooks.ts) once all consumers were migrated to TanStack Query.
- [x] Simplified [lib/hooks.ts](file:///Users/mac/Desktop/stag-horn/lib/hooks.ts) to re-export exclusively from `query-hooks.ts`.
- [x] Fixed all ESLint warnings to achieve **0 errors, 0 warnings** across the entire repository.
- [x] Verified `bun x tsc --noEmit` and `bun run build` compile cleanly with 0 errors across 28/28 routes.

---

## 📊 Phase 3: TanStack Table v8 Unification in Admin Suite

- [x] **[components/admin/CustomersClient.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/CustomersClient.tsx)**:
  - Converted manual HTML table to `@tanstack/react-table` with sorting, column definitions, and empty/loading states (matching `OrdersClient` & `CategoriesClient`).
- [x] **[components/admin/NewsletterClient.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/NewsletterClient.tsx)**:
  - Converted manual HTML table to `@tanstack/react-table` with sorting, search filter, and action buttons.

---

## ⚡ Phase 4: Next.js 16 Deprecation & Architecture Updates

- [x] Migrated `middleware.ts` to [proxy.ts](file:///Users/mac/Desktop/stag-horn/proxy.ts) per Next.js 16 conventions, clearing the Turbopack deprecation notice.
- [x] Verified Turbopack build generates all 28/28 static & dynamic routes in ~3.1s without deprecation warnings.

---

## 🗄️ Phase 5: Storage Architecture & Media Optimization

- [x] Create [lib/storage.ts](file:///Users/mac/Desktop/stag-horn/lib/storage.ts) with resilient Supabase storage upload pipeline and automatic Base64 fallback.
- [x] Wire `uploadImage` into [components/admin/CategoryModal.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/CategoryModal.tsx) and [components/admin/product/ProductMediaManager.tsx](file:///Users/mac/Desktop/stag-horn/components/admin/product/ProductMediaManager.tsx).
- [x] Provide ready-to-run Supabase Storage bucket SQL migration script in [schema_update.sql](file:///Users/mac/Desktop/stag-horn/schema_update.sql).
- [ ] (Optional) Execute `schema_update.sql` in Supabase SQL Editor to switch from fallback Base64 to public CDN URLs.

---

## 🧪 Phase 6: Comprehensive Playwright E2E Testing

- [x] **Suite 1: Storefront Discovery & Browsing** (`ST-01` to `ST-04`): Verified `/`, `/categories`, `/product`, and `/product/[slug]` with 0 hydration errors.
- [x] **Suite 2: Zustand Cart & Checkout Pipeline** (`CT-01` to `CT-04`): Verified Add to Cart, cart recalculations, checkout form submission, COD order placement (`201 Created`), and `/thank-you` order confirmation.
- [x] **Suite 3: Admin Authentication & Security** (`AD-01` to `AD-03`): Verified `/admin` route guard redirect to `/login`, admin login mutation, and `/admin/login-history` audit logs.
- [x] **Suite 4: TanStack Table Admin Backoffice** (`TB-01` to `TB-06`): Verified Products, Orders, Categories, Customers, Newsletter, and Contact Submissions tables, sorting, filters, and modals.
- [x] **E2E Test Report**: Documented in [e2e_test_report.md](file:///Users/mac/.gemini/antigravity-ide/brain/4acb82e4-c068-4f91-853e-4d883f2c1752/e2e_test_report.md).

---

## 🎨 Phase 7: UI/UX Modernization & Luxury Polish

- [x] **Tailwind CSS 4.0 Luxury Theme Tokens**: Added Damascus Charcoal, Antique Gold (`#D6AF66`), and glassmorphism styling to `app/globals.css`.
- [x] **Sonner Toaster Migration**: Fully replaced `react-toastify` with `Sonner` (`<Toaster richColors closeButton position="top-right" />`) in `app/layout.tsx`.
- [x] **shadcn/ui Component Library Expansion**: Built accessible Radix-powered components in `components/ui/` (`dialog.tsx`, `sheet.tsx`, `tabs.tsx`, `tooltip.tsx`, `skeleton.tsx`, `badge.tsx`, `dropdown-menu.tsx`).
- [x] **Slide-Over Quick-Cart Drawer**: Created `components/QuickCartSheet.tsx` with free delivery progress bar, item quantity steppers, subtotal, and instant checkout link.
- [x] **Navbar Polish**: Enhanced `components/Navbar.tsx` with scroll-reactive glassmorphism, quick-cart sheet trigger, animated link indicators, and mobile sheet drawer.
- [x] **ProductCard Micro-Animations**: Enhanced `components/ProductCard.tsx` with Framer Motion hover elevation, image zoom, luxury badges, and Sonner "View Cart" toast action.
- [x] **Artisanal Craft Video Reel**: Created `components/ArtisanCraftReel.tsx` with video player, 4 interactive chapter milestones, live Damascus metrics, and embedded into `components/HomeClient.tsx`.
- [x] **Order Delight Confetti**: Integrated `canvas-confetti` into `components/ThankYouClient.tsx` for celebration on order completion.
- [x] **Production Build Verified**: 100% clean Next.js 16 build (`bun run build`) across 28/28 routes in 4.6s.

