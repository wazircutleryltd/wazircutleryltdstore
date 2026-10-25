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

## 🏆 Completed Milestones Summary

- [x] **100% Pure TypeScript Conversion**: All `.js` / `.jsx` application files converted to strict TypeScript (`allowJs: false`, 0 TS errors).
- [x] **Payload Optimization**: `PRODUCT_CARD_SELECT` in `lib/query-hooks.ts`, cutting list query sizes by ~98%.
- [x] **Relational Single Queries**: Replaced category waterfall queries with inner joins (`categories!inner(slug)`).
- [x] **Next.js Image Pipeline**: Configured AVIF/WebP formats, 30-day cache TTL, device/image sizes in `next.config.ts`.
- [x] **Hydration Divergence Elimination**: Resolved layout and SSR mismatch bugs in `ConditionalLayout`, `WhatsAppIcon`, and `CheckoutClient`.
- [x] **TanStack Query v5 Storefront & Admin Migration**: 100% of data fetching across the app uses cached React Query hooks.
- [x] **TanStack Table v8 Admin Unification**: Orders, Products, Categories, Customers, and Newsletter all powered by `@tanstack/react-table`.
- [x] **Zero ESLint Warnings**: 0 errors and 0 warnings on `bun x eslint .`.
- [x] **Next.js 16 Modernization**: Clean migration to `proxy.ts`, 0 deprecation warnings.
