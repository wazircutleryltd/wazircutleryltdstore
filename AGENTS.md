# 🦌 Wazir Cutlery Ltd Store: Agent Operating Guide

This document provides AI agents (Antigravity, Cursor, etc.) with a map and context of the **Wazir Cutlery Ltd** e-commerce project to ensure efficient development and consistent styling.

## 🚀 Project Overview
**Wazir Cutlery Ltd Store** is a premium e-commerce platform specializing in high-quality knives, swords, and related items.
 It is built using the latest Next.js features and a robust backend.

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
- **ESM vs CJS**: Due to Webpack/Turbopack requirements in Next.js 15, `postcss.config.js` MUST use CommonJS (`module.exports = { plugins: { '@tailwindcss/postcss': {} } }`) to maintain build stability. Avoid using `.mjs` for PostCSS.

## 🌍 SEO & Dynamic Routing
- **Title-Based Slugs**: Products use descriptive slugs (e.g., `/product/damascus-chef-knife-uh-12`) which are unique name+SKU combinations.
- **Sitemap**: A dynamic sitemap is generated at `app/sitemap.js`. Ensure any new public routes are added to this file.
- **Slug Generation**: Use the `slugify` utility in `lib/utils.js` for all product and category name transformations.

---
*Last updated on 2026-04-11*
