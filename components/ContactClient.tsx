"use client";

import React from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import ContactForm from "@/components/ContactForm";
import { ChevronRight, Sparkles } from "lucide-react";

export default function ContactClient() {
  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Contact & Commissions</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              Direct Artisan Consultation
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Connect with the Forge
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Whether commissioning a bespoke Damascus hunting piece, discussing wholesale blade supply, or seeking craftsmanship guidance, our masters in Wazirabad are at your service.
            </p>
          </div>

          {/* Form and Contact Cards */}
          <ContactForm />
        </div>
      </div>
    </ConditionalLayout>
  );
}
