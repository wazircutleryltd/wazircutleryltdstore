# 🦌 Wazir Cutlery Ltd Store
### Master-Forged Damascus Knives, Collector Swords & Artisan Cutlery

[![Next.js](https://img.shields.io/badge/Next.js-16.3%2B-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-blueviolet?style=flat-square)](https://turbo.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![Bun](https://img.shields.io/badge/Bun-1.4%2B-f472b6?style=flat-square&logo=bun)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-Proprietary-gold?style=flat-square)](#)

**Wazir Cutlery Ltd Store** is a high-performance e-commerce platform and operational artisan backoffice built for **Wazir Cutlery Ltd**—headquartered in the historic cutlery capital of **Wazirabad, Punjab, Pakistan**. Combining traditional bladesmithing heritage with modern web engineering, the platform delivers luxury aesthetics, instant client-side transitions, generative AI discovery (AEO/LLMO), and an operational admin suite.

---

## 🏛️ Core Technology Stack

- **Framework**: [Next.js 16+](https://nextjs.org/) (App Router, Turbopack, `proxy.ts` middleware)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) (Strict mode, zero `allowJs`)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/) with Damascus Obsidian (`#0C0D0E`) & Antique Gold (`#D6AF66`) design tokens
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/) (Zero raw emoji dependencies)
- **State Management**:
  - Storefront Cart: [Zustand v5](https://zustand-demo.pmnd.rs/) with localStorage persistence
  - Server State: [TanStack Query v5](https://tanstack.com/query/latest) (Declarative caching, optimistic invalidation)
  - Tables: [TanStack Table v8](https://tanstack.com/table/latest) (Sorting, search filtering, cell formatting)
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Row-Level Security, Storage Buckets, Database RPCs)
- **Authentication**: [Clerk](https://clerk.com/) (Patrons) & Custom High-Security Session Auth (Admin Suite)
- **Micro-Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) (Rich toasts with quick action buttons)
- **Testing**: [Playwright](https://playwright.dev/) End-to-End Suite

---

## ✨ Flagship Capabilities

### 🛍️ Storefront & Collector Experience
- **Luxury Damascus Visual Identity**: Polished typography (Outfit, Cabin, Open Sans, Geist), subtle metallic borders, and glassmorphism headers.
- **Dynamic Slide-Over Quick Cart**: Free worldwide shipping progress indicator ($150 threshold), real-time calculations, and 1-click checkout drawer.
- **One-Click Social Media Sharing**: Instant product sharing across WhatsApp, Facebook, X (Twitter), Pinterest, direct link clipboard copy, and native mobile Web Share sheet (`navigator.share`).
- **Curated Collections Showcase**: High-aesthetic category browser with dark gradient overlays, hover zoom animations, piece count indicators, and responsive pagination.
- **Artisanal Damascus Video Showcase**: Interactive multi-chapter video player documenting traditional folding, forging, and vacuum heat treatment in Wazirabad.
- **Delightful Checkout Pipeline**: Cash on Delivery (COD) & online payments with celebratory confetti on order completion (`/thank-you`).

### 🤖 Generative AI SEO / AEO / LLMO Engine
- **Standardized `llms.txt` & `llms-full.txt`**: Machine-readable markdown corpuses structured specifically for generative AI answer engines (ChatGPT, Perplexity, Claude, Gemini, DeepSeek).
- **Proactive AI Crawler Permissions ([`app/robots.ts`](file:///Users/mac/Desktop/stag-horn/app/robots.ts))**: Explicit crawl allowance for `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, and `OAI-SearchBot`.
- **Deep Schema.org Graph**: Validated JSON-LD schemas including `Organization`, `Store`, `FAQPage`, `HowTo` (blade maintenance), `BreadcrumbList`, and `Product` with `offers` and `aggregateRating`.
- **Dynamic Priority Sitemap ([`app/sitemap.ts`](file:///Users/mac/Desktop/stag-horn/app/sitemap.ts))**: Automated indexing across all 35 static pages and dynamic product slugs.

### 🛡️ Complete Trust, Legal & Educational Suite
- **`/faq`**: Categorized accordions for steel metallurgy, custom orders, international shipping, and blade care.
- **`/knife-care`**: Comprehensive masterclass on oiling 1095 & 15N20 carbon Damascus steel, preventing oxidation, and preserving stag horn antler handles.
- **`/track-order`**: Real-time consignment tracker with order ID and email lookup featuring a 4-step progress visualization.
- **`/shipping`**: Express DHL & FedEx international transit policies, customs guidelines, and safe blade packaging protocols.
- **`/returns`**: 30-day inspection period and Lifetime Forge Guarantee on blade delamination.
- **`/terms`**: Age 18+ knife ownership verification and bespoke commission terms.
- **`/privacy`**: Zero-data-selling pledge, GDPR & CCPA rights disclosure, and cookie policy.

### ⚡ Operational Admin Portal (`/admin`)
- **Product Management Command Center**:
  - Inline click-to-edit price and stock directly from the table with instant database synchronization.
  - Quick Duplicate / Clone piece modal for rapid addition of blade variants.
  - 1-click Active / Inactive toggle.
  - 3-tab creation modal (Basics, Pricing & Inventory, Media & WebP CDN upload).
- **Patron Inquiries & Commissions (`/admin/contact-submissions`)**:
  - Status filter tabs (`All`, `New`, `In Progress`, `Resolved`, `Archived`).
  - Search filter by customer name, email, or country.
  - 1-click **Reply via WhatsApp** and **Send Email** triggers.
  - Detailed modal for inspecting custom order briefs and updating progress.
- **Storefront & AI Forge Settings (`/admin/settings`)**:
  - Store identity editor (Wazirabad forge physical address, currency, support emails, primary/secondary artisan WhatsApp lines).
  - AI engine knowledge prompt and crawler permission toggles.
  - Shipping threshold configuration.
  - Social media channel links.
- **Collector's Guild Newsletter (`/admin/newsletter`)**:
  - Live subscriber KPI cards and health metrics.
  - 1-click **CSV Export** for Klaviyo/Mailchimp integration.
  - **Collector Announcement Composer** with ready-to-broadcast artisan email templates.

---

## 📂 Directory Layout

```
├── app/                           # Next.js App Router (35 static & dynamic routes)
│   ├── api/                       # Resilient API routes (contact, newsletter, orders)
│   ├── admin/                     # Protected backoffice dashboard & sub-routes
│   ├── categories/                # Artisan blade collections browser
│   ├── faq/                       # Categorized FAQ with FAQPage Schema
│   ├── knife-care/                # Damascus maintenance guide with HowTo Schema
│   ├── product/                   # Catalog & dynamic [slug] product detail
│   ├── shipping/                  # Worldwide delivery & customs policy
│   ├── returns/                   # 30-day return & lifetime forge guarantee
│   ├── terms/ & privacy/          # 18+ legal compliance & GDPR privacy
│   ├── track-order/               # Self-service consignment tracking
│   ├── robots.ts & sitemap.ts     # Dynamic AI-crawler & sitemap generators
│   └── layout.tsx                 # Root layout with Organization JSON-LD & Sonner
├── components/                    # Reusable React UI components
│   ├── admin/                     # Admin table, modal, sidebar & metrics components
│   ├── ui/                        # Accessible Radix primitives (shadcn-inspired)
│   ├── ContactForm.tsx            # Luxury inquiry & WhatsApp consultation form
│   ├── ProductDetails.tsx         # Product hero with 1-click social sharing
│   ├── QuickCartSheet.tsx         # Slide-over cart drawer with delivery progress
│   └── Footer.tsx                 # Categorized 4-column luxury footer
├── contexts/                      # Global state (CartContext with Zustand)
├── lib/                           # Database client, TanStack Query hooks & utilities
│   ├── query-hooks.ts             # Primary query & mutation hooks
│   ├── supabase.ts                # Initialized Supabase client
│   └── storage.ts                 # Resilient WebP image CDN pipeline
└── public/                        # Static assets, SVG logos & AI corpuses
    ├── llms.txt                   # Concise AI knowledge base
    └── llms-full.txt              # Exhaustive AI knowledge corpus
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Bun](https://bun.sh/) (v1.2+) installed on your system.

### 2. Environment Configuration
Create a `.env.local` file at the root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Clerk Authentication (Patrons)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Backoffice Credentials
NEXT_PUBLIC_ADMIN_USERNAME=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password

# Email & Logistics (Resend)
RESEND_API_KEY=re_...

# Google reCAPTCHA (Optional / Resilient)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le...
RECAPTCHA_SECRET_KEY=6Le...
```

### 3. Installation & Local Development

```bash
# Install dependencies with Bun
bun install

# Start Next.js development server with Turbopack
bun run dev
```

The application will be live at `http://localhost:3000` (or `http://localhost:3002`).

### 4. Build & Production Validation

```bash
# Type-check TypeScript strictly
bun x tsc --noEmit

# Compile optimized production bundle
bun run build

# Start production server
bun run start
```

---

## 🧪 Testing & Code Quality

- **Zero-Warning TypeScript**: Configured with strict compiler settings.
- **Playwright Testing**: Automated test coverage for storefront navigation, cart recalculation, checkout, order submission, admin authentication, inline table edits, and contact submission workflows.
- **AI Crawler Accessibility**: Verify generative engine discovery at `http://localhost:3000/llms.txt` and `http://localhost:3000/robots.txt`.

---

## 🏛️ About Wazir Cutlery Ltd

Forged in the heart of **Wazirabad, Pakistan**—a centuries-old bladesmithing capital renowned throughout South Asia—**Wazir Cutlery Ltd** produces hand-forged 1095 and 15N20 high-carbon pattern-welded Damascus steel knives, ceremonial swords, hunting bowies, and chef cutlery featuring authentic ethically sourced stag horn antler handles.

- **Primary Forge Contacts**:
  - Hassan Mughal: `+92 308 0601995` (WhatsApp)
  - Qamar Shahzad: `+92 312 6209302` (WhatsApp)
  - Official Inquiries: `info@wazircutlery.com`
- **Physical Address**: Near High Class Bakers, G.T. Road, Wazirabad, Punjab, 52000, Pakistan

---
*Maintained by the Wazir Cutlery Engineering Team. Last updated: October 2026.*
