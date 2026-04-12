# 🦌 Wazir Cutlery Ltd Store
### Premium E-commerce for Handcrafted Blades

**Wazir Cutlery Ltd Store** is a state-of-the-art e-commerce platform built for **Wazir Cutlery Ltd**, specializing in high-end knives, swords, and professional cutlery. It combines artisan design with enterprise-grade performance.

---

## 🚀 Core Technology Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) (Modern PostCSS Integration)
- **Database / Backend**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Authentication**: [Clerk](https://clerk.com/) & Custom High-Security Admin Auth
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Infrastructure**: [Bun](https://bun.sh/) (Package Management & Runtime)
- **Monitoring**: Vercel Analytics & Google Tag Manager (GTM)

---

## ✨ Key Features
- 💎 **Artisan UI**: A high-end, responsive interface designed with the "Stag-Horn" premium aesthetic.
- 🖼️ **Intelligent Image Engine**: Automated runtime cropping, compression (sub-1MB), and 1:1 aspect ratio enforcement.
- 📈 **Dynamic Analytics Dashboard**: Real-time sales data, metric cards, and revenue history powered by Supabase RPC.
- 🔍 **AI-First SEO (GEO)**: Optimized for the "Generative Search" era with FAQ, Organization, and Store Schemas. Custom AI-bot friendly `robots.js` facilitates ranking in LLM-driven answers (Claude, GPT, Gemini).
- 🔐 **Hardened Security**: Multi-layer admin route protection and Clerk-integrated customer workflows. Zero-dependency on local storage fallbacks.
- 📧 **Newsletter & Engagement**: Integrated subscription management and automated lead tracking.

---

## 🛠️ Getting Started

### 1. Environment Configuration
Create a `.env.local` file at the root and populate it with your service credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Credentials
NEXT_PUBLIC_ADMIN_USERNAME=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### 2. Database Initialization
To set up your database, run the following SQL scripts in your **Supabase SQL Editor** in order:

1.  **Core Schema**: `supabase-schema.sql` (Tables & Initial RLS)
2.  **SEO & Routes**: `schema_update.sql` (Product Slugs & Uniqueness)
3.  **Newsletter System**: `newsletter-db.md` (Subscription Infrastructure)
4.  **Performance Optimization**: `dashboard-rpc.md` (Remote Procedure Calls)

### 3. Development
Install dependencies and start the Turbopack dev server:

```bash
bun install
bun run dev
```

---

## 🌍 SEO & Meta Structure
- **Sitemap**: Available at `/sitemap.xml`
- **Product Slugs**: Generated dynamically as `[name]-[sku]` for guaranteed uniqueness and SEO ranking.
- **Canonicalization**: Automated site-wide link stabilization via Next.js metadata.

---

Created by **Antigravity** for **Wazir Cutlery Ltd**.
*Last updated: 2026-04-12*
