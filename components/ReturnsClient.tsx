"use client";

import React from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ChevronRight, Award, RotateCcw, ShieldCheck, CheckCircle2, MessageSquare } from "lucide-react";

export default function ReturnsClient() {
  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Artisan Guarantee</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <Award className="h-3.5 w-3.5" /> Lifetime Craftsmanship Promise
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Returns & Lifetime Warranty
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Every Wazir Cutlery creation is backed by our generational commitment to bladecraft excellence and patron satisfaction.
            </p>
          </div>

          {/* Guarantee Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#D6AF66]/15 text-[#D6AF66] flex items-center justify-center mx-auto sm:mx-0">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-900 font-geist">30-Day Inspection</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Inspect your blade at home. Return unused in original packaging within 30 days for an exchange or full refund.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-900 font-geist">Lifetime Forge Warranty</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Covers metallurgical integrity, tang construction, and handle pin bonding for the life of the tool.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-900 font-geist">Hassle-Free Process</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Direct WhatsApp or email support with our forge masters to ensure swift resolution.
              </p>
            </div>
          </div>

          {/* Document Content */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-neutral-200/80 shadow-sm space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed font-geist">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">1. 30-Day Return & Exchange Policy</h2>
              <p>
                We want you to be completely thrilled with your purchase. If for any reason you are not satisfied with your blade upon arrival, you may return it within 30 days of delivery for a replacement, store credit, or full refund to your original payment method.
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-neutral-600">
                <li>The knife must be in its original, unused condition without edge chips or resharpening alterations.</li>
                <li>Must include the original leather sheath, documentation, and collector presentation box.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">2. Lifetime Craftsmanship Warranty</h2>
              <p>
                Wazir Cutlery warrants all blades against manufacturing defects, delaminations in pattern-welded Damascus steel, loose bolsters, and handle structural failures resulting from normal, intended cutlery use.
              </p>
              <p className="text-xs text-neutral-500 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <strong>Warranty Exclusions:</strong> Does not cover surface rust or patina resulting from lack of oiling, damage caused by dishwashers, batoning through concrete/metal, or edge degradation resulting from intentional abuse.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">3. How to Initiate a Return</h2>
              <p>
                To initiate a return or warranty inspection, reach out to our team with your Order ID and photos of the piece:
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/923160764052"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <MessageSquare className="h-4 w-4" /> Message Support on WhatsApp
                </a>
                <a
                  href="mailto:info@wazircutlery.com?subject=Return%20or%20Warranty%20Inquiry"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  Email Support Team
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
