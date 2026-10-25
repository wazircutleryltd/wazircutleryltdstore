"use client";

import React from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ChevronRight, Truck, Globe, ShieldCheck, Clock, PackageCheck, AlertCircle } from "lucide-react";

export default function ShippingClient() {
  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Worldwide Shipping</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <Globe className="h-3.5 w-3.5" /> Express Global Delivery
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Shipping & Delivery Policy
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Every handcrafted blade leaves our Wazirabad forge via priority air freight, encased in protective oil and rigid collector packaging.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-[#D6AF66]/15 text-[#D6AF66] flex items-center justify-center mx-auto sm:mx-0">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-900 font-geist">Complimentary Shipping</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Free priority worldwide express delivery on all orders over $150 USD.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto sm:mx-0">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-900 font-geist">2–4 Business Days</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Average international transit time via DHL Express and FedEx Priority.
              </p>
            </div>

            <div className="p-6 rounded-[2rem] bg-white border border-neutral-100 shadow-sm space-y-2 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-900 font-geist">Transit Guarantee</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                100% full replacement guarantee if an item is lost or damaged during transit.
              </p>
            </div>
          </div>

          {/* Content Sections */}
          <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-neutral-200/80 shadow-sm space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed font-geist">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">1. Dispatch & Processing Timelines</h2>
              <p>
                <strong>In-Stock Artisan Pieces:</strong> Dispatched from our Wazirabad facility within 24 to 48 business hours after order confirmation.
              </p>
              <p>
                <strong>Custom Forged Commissions:</strong> Handcrafted to your specifications, typically requiring 7 to 14 working days for hand-folding, vacuum heat-treatment, acid etching, and custom sheath tailoring.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">2. Certified Secure Packaging</h2>
              <p>
                Shipping high-value cutlery requires meticulous preservation. Every piece undergoes a multi-layer packaging protocol:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-neutral-600">
                <li>Blade coated in protective corrosion-inhibiting mineral oil.</li>
                <li>Housed inside its tailored full-grain leather sheath with snap locks.</li>
                <li>Cushioned inside a rigid foam collector presentation box.</li>
                <li>Enclosed in tamper-evident international air freight protective packaging.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">3. International Customs & Import Regulations</h2>
              <p>
                We routinely ship to over 80 countries worldwide. Packages include official commercial invoices declaring the contents under international Harmonized Tariff Codes (HS 8211 for table/hunting cutlery and HS 9307 for collectible swords).
              </p>
              <p className="text-xs text-neutral-500 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <AlertCircle className="inline h-4 w-4 mr-1 text-amber-600 align-sub" />
                <strong>Notice:</strong> Any local import taxes, VAT, or customs clearance processing fees levied by your national customs authority are the responsibility of the recipient.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-neutral-900 font-geist">4. Tracking Your Masterwork</h2>
              <p>
                As soon as your shipment is scanned by DHL Express or FedEx, you will receive an automated dispatch notification with your real-time tracking number. You can also inspect live order progress on our <Link href="/track-order" className="font-bold text-[#D6AF66] hover:underline">Track Order</Link> page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
