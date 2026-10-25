"use client";

import React from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ChevronRight, ShieldAlert, Scale, FileText } from "lucide-react";

export default function TermsClient() {
  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Terms of Service</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <Scale className="h-3.5 w-3.5" /> Legal & Ownership Policy
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">
              Last Updated: October 2026 • Wazir Cutlery Ltd
            </p>
          </div>

          {/* Age Compliance Alert Banner */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold text-sm">Age Verification & Legal Compliance Notice (18+ Only)</span>
              <p>
                By placing an order on Wazir Cutlery, you affirm that you are at least 18 years of age (or legal adult age in your jurisdiction) and that ownership of edged cutlery, swords, or knives is compliant with all local, state, and national laws in your area.
              </p>
            </div>
          </div>

          {/* Content Document */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-neutral-200/80 shadow-sm space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed font-geist">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and Wazir Cutlery Ltd (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of the wazircutlery.com website and our custom knife ordering services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">2. Handcrafted Artisan Nature & Variations</h2>
              <p>
                Every knife, dagger, and sword created by Wazir Cutlery is hand-forged by master artisans in Wazirabad. Because we use genuine Damascus pattern welding (1095 and 15N20 high-carbon steels) and naturally shed deer stag antler:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-xs sm:text-sm text-neutral-600">
                <li>No two Damascus billets produce identical wave ripples or acid-etched etchings.</li>
                <li>Antler texture, grain density, natural curves, and coloring will display authentic organic variance.</li>
                <li>Weight and dimensional tolerances may vary by $\pm 3\%$ due to hand-grinding and finishing.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">3. Responsible Ownership & Safety</h2>
              <p>
                Our blades are razor-sharp functional collector pieces and outdoor tools. Wazir Cutlery strictly disclaims all liability for accidental injury, property damage, or unlawful use of any item purchased. It is solely the purchaser&apos;s responsibility to handle, maintain, display, and transport blades in a safe and law-abiding manner.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">4. International Shipping & Customs Clearance</h2>
              <p>
                We dispatch packages internationally via DHL Express, FedEx, and EMS. While we declare every shipment accurately under international cutlery codes, the buyer is responsible for any applicable local import duties, VAT, or local customs licensing required in the destination country.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">5. Custom Bespoke Commissions</h2>
              <p>
                Custom bespoke blades created to unique customer specifications require forge scheduling. Once steel forging and handle shaping have commenced, deposits or payments for custom commissions are non-refundable, except under our artisan defect guarantee.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">6. Intellectual Property</h2>
              <p>
                All trademarks, logos, photography, blade designs, and written content on this website are the intellectual property of Wazir Cutlery Ltd. Unauthorized reproduction or commercial use without prior written consent is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">7. Governing Law & Contact</h2>
              <p>
                These terms are governed by the laws of Pakistan with international commercial arbitration standards. For inquiries regarding our terms, email us at <a href="mailto:info@wazircutlery.com" className="font-bold text-[#D6AF66] hover:underline">info@wazircutlery.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
