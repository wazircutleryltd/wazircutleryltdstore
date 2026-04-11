# 🦌 Stag-Horn: Agent Operating Guide

This document provides AI agents (Antigravity, Cursor, etc.) with a map and context of the **Stag-Horn** e-commerce project to ensure efficient development and consistent styling.

## 🚀 Project Overview
**Stag-Horn** is a premium e-commerce platform specializing in high-quality knives, swords, and related items. It is built using the latest Next.js features and a robust backend.

## 🛠️ Technology Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: JavaScript / TypeScript
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management**: React Hooks & Context API
- **Authentication**: [Clerk](https://clerk.com/) / Custom Admin Auth
- **Database / Backend**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Emails**: [Resend](https://resend.com/)

## 📂 Core Directory Structure
| Directory | Purpose |
| :--- | :--- |
| `/app` | Main application routes (pages, APIs, layouts). Uses Next.js App Router. |
| `/components` | UI and logic components. |
| `/components/admin` | Admin-specific dashboard components. |
| `/components/ui` | Fundamental UI elements (buttons, inputs, etc.). |
| `/lib` | Helper functions, API clients, and database hooks (`supabase-hooks.js`). |
| `/contexts` | Global state providers (Cart, Auth, etc.). |
| `/public` | Static assets (images, logos). |

## 🎨 Design Philosophy (Rich Aesthetics)
When creating or modifying UI:
- **Premium Feel**: Use subtle gradients, high-quality typography (Geist), and uniform spacing.
- **Micro-Animations**: Use `framer-motion` for smooth hover transitions, entry animations, and scroll interactions.
- **Color Palette**: Often uses gold/brass accents (`#D6AF66`) for a premium look associated with stag horn products.
- **Responsiveness**: Ensure all components work perfectly on mobile, tablet, and desktop.

## 🔧 Data & State Management
- **Database**: Interacts via `@supabase/supabase-js` client in `lib/supabase.js`.
- **Hooks**: **Crucial!** Use the custom hooks in `lib/supabase-hooks.js` for all data operations. This file is huge (>1400 lines) and contains logic for almost every entity (products, categories, users, orders, contact submissions).
- **Cart**: Managed via React Context and likely persisted in local storage or DB.

## 🔐 Auth & Security
- **General Auth**: Clerk is used for customer authentication.
- **Admin Auth**: A hybrid approach is used. Check `components/AdminAuthProvider.jsx` and `lib/supabase-hooks.js` (`useVerifyAdminLogin`).
- **Protection**: `middleware.js` and `AdminRouteProtection.jsx` guard sensitive routes.

## ⚠️ Potential Issues & Discrepancies (Analysis Notes)
- **Schema vs. UI**: Some components (like `ContactSubmissionsClient.jsx`) may use field names (e.g., `submission.name`, `submission.subject`) that differ from the SQL schema in `README.md` (e.g., `full_name`, `message`). Always verify fields against the actual table structure in Supabase before refactoring.
- **Next.js 15 + Turbopack**: The project uses the latest Next.js features. Be mindful of Server vs. Client component boundaries (`'use client'`).

## 🌍 SEO & Dynamic Routing
- **Title-Based Slugs**: Products use descriptive slugs (e.g., `/product/damascus-chef-knife`) instead of SKUs.
- **Slug Generation**: Use the `slugify` utility in `lib/utils.js` for all product and category name transformations.
- **Canonicalization**: Every public route must include `alternates.canonical` in its metadata to prevent duplicate indexing.
- **Structured Data**: Product pages must implement JSON-LD (Schema.org) for rich results (Price, Inventory, Rating).

## 📡 Data Fetching & Scaling
- **Pagination**: Admin tables (Products, Orders, etc.) MUST use server-side pagination via the `range(from, to)` Supabase method.
- **Hooks with Meta**: Data hooks like `useAllProducts` return `{ data, totalPages, totalCount }` to support navigation UI.
- **Server Actions/APIs**: Favor custom API routes in `/app/api` for sensitive operations (Orders, Newsletter) to enforce Clerk-based RBAC.

## 📝 Rules for AI Agents
1. **No Placeholders**: Always generate real content or use `generate_image` for missing assets.
2. **SEO First**: Ensure every new page has proper metadata (Title, Description, Canonical).
3. **Viewport Export**: Next.js 15 requires `themeColor` and `width` to be in a separate `viewport` export, NOT in `metadata`.
4. **Semantic HTML**: Use `<header>`, `<footer>`, `<main>`, `<h1>-<h6>` correctly.
5. **Patterns**: Follow the `*Client.jsx` convention for client-side functionality.
6. **Consistency**: Check existing UI components in `components/ui` before building new ones.

---
*Last updated on 2026-04-06*
