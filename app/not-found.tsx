import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { FaCompass, FaArrowLeft, FaWhatsapp } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Page Not Found (404) | Wazir Cutlery",
  description: "The requested artisanal blade or page could not be located in our forge records.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0B0A] text-white flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,175,102,0.08)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/30 text-[#D6AF66] text-xs font-mono uppercase tracking-widest">
          HTTP 404 • Blade Not Located
        </div>

        {/* 404 Heading */}
        <div className="space-y-3">
          <h1 className="text-6xl sm:text-8xl font-black font-[family-name:var(--font-outfit)] text-white tracking-tight">
            4<span className="text-[#D6AF66]">0</span>4
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-200 font-[family-name:var(--font-outfit)]">
            The Piece You Seek Has Departed the Forge
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-[family-name:var(--font-cabin)] leading-relaxed max-w-md mx-auto">
            The requested blade, collection, or URL is not available. It may have been retired, acquired by a collector, or relocated.
          </p>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/product"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D6AF66] hover:bg-[#c49e55] text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-[#D6AF66]/20 font-[family-name:var(--font-outfit)]"
          >
            <FaCompass className="h-4 w-4" />
            Explore All Handcrafted Blades
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-white/10 font-semibold text-sm transition-all font-[family-name:var(--font-outfit)]"
          >
            <FaArrowLeft className="h-3.5 w-3.5 text-neutral-400" />
            Return to Storefront
          </Link>
        </div>

        {/* WhatsApp Custom Inquiry Support */}
        <div className="pt-6 border-t border-white/10 text-xs text-neutral-400 space-y-2">
          <p>Looking for a specific custom Damascus order or legacy catalog piece?</p>
          <a
            href="https://wa.me/923126209302?text=Hello%20Qamar%20Mughal,%20I%20am%20looking%20for%20a%20specific%20blade%20on%20Wazir%20Cutlery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#D6AF66] hover:underline font-medium"
          >
            <FaWhatsapp className="h-3.5 w-3.5" />
            Direct Artisan Assistance with Qamar Mughal (+92 312 6209302)
          </a>
        </div>
      </div>
    </div>
  );
}
