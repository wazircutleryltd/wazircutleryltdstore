"use client";

import React from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ChevronRight, ShieldCheck, Lock, Eye } from "lucide-react";

export default function PrivacyClient() {
  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Privacy Policy</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" /> Patron Data Protection
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Effective Date: October 2026 • Wazir Cutlery Ltd
            </p>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="p-6 rounded-2xl bg-neutral-900 text-white border border-neutral-800 flex items-start gap-4">
            <Lock className="h-6 w-6 text-[#D6AF66] flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-neutral-300 leading-relaxed">
              <span className="font-bold text-sm text-white">Our Zero-Data-Selling Guarantee</span>
              <p>
                Wazir Cutlery respects the privacy of our collector guild. We do not sell, rent, lease, or monetize your personal information or purchase history with third-party data brokers.
              </p>
            </div>
          </div>

          {/* Content Document */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-neutral-200/80 shadow-sm space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed font-geist">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">1. Information We Collect</h2>
              <p>
                When you visit wazircutlery.com, commission a custom knife, or place an order, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-neutral-600">
                <li><strong>Identity & Contact:</strong> Full name, email address, phone number, and WhatsApp contact for custom order coordination.</li>
                <li><strong>Logistics Data:</strong> Physical shipping address, country, postal code, and customs declaration requirements.</li>
                <li><strong>Transactional Details:</strong> Order contents, custom blade specifications, transaction references (we do not store full credit card numbers on our servers).</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">2. Purpose of Data Processing</h2>
              <p>We process patron data exclusively to:</p>
              <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-neutral-600">
                <li>Fulfill, hand-forge, package, and dispatch your blades worldwide via DHL/FedEx.</li>
                <li>Provide direct order tracking updates, shipment notices, and delivery confirmations.</li>
                <li>Deliver exclusive Collector&apos;s Guild announcements (if explicitly subscribed).</li>
                <li>Prevent fraudulent transactions and protect platform security.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">3. Cookies & Session Storage</h2>
              <p>
                Our platform uses strictly necessary cookies and local storage tokens to preserve your shopping cart, maintain admin session security, and retain user display preferences. We do not use invasive cross-site tracking pixels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">4. International Data Transfers</h2>
              <p>
                Because Wazir Cutlery serves collectors globally from our master forge in Wazirabad, Pakistan, your logistics details are transmitted securely to international courier partners (DHL Express, FedEx) for the sole purpose of delivery.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">5. Your Legal Rights (GDPR & CCPA)</h2>
              <p>
                Under European GDPR, UK Data Protection Act, and California CCPA regulations, you hold the right to request access to the personal data we hold about you, request corrections, or request complete erasure of your contact details. Email our privacy team at <a href="mailto:info@wazircutlery.com" className="font-bold text-[#D6AF66] hover:underline">info@wazircutlery.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
