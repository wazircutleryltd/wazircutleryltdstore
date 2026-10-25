"use client";

import React from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ChevronRight, Sparkles, Droplets, ShieldAlert, CheckCircle2, Feather, Flame } from "lucide-react";

export default function KnifeCareClient() {
  const steps = [
    {
      num: "01",
      title: "Hand-Wash Immediately After Every Use",
      desc: "Never put a Damascus or high-carbon knife in a dishwasher. Dishwasher detergents contain caustic salts, and the high-temperature steam will strip protective oils, warp antler/wood handles, and accelerate oxidation. Wash gently with warm water, mild dish soap, and a non-abrasive sponge.",
      icon: Droplets
    },
    {
      num: "02",
      title: "Towel-Dry Completely (Never Air Dry)",
      desc: "High-carbon steel (1095) is susceptible to surface flash oxidation if left in contact with standing moisture. Immediately dry the blade, spine, tang, and bolster using a soft microfiber towel. Pay special attention to the junction between the bolster and the stag horn handle.",
      icon: Feather
    },
    {
      num: "03",
      title: "Apply a Micro-Layer of Protective Mineral Oil",
      desc: "Wipe a couple of drops of 100% pure food-grade mineral oil, camellia seed oil, or Renaissance micro-crystalline wax along the bevel and Damascus rippled flats. This forms an impermeable hydrophobic barrier that seals the high-carbon and nickel layers from ambient humidity.",
      icon: Flame
    },
    {
      num: "04",
      title: "Stag Horn Antler & Exotic Wood Conditioning",
      desc: "Genuine deer stag horn is natural organic bone matter. To prevent drying, cracking, or shrinkage in arid or air-conditioned environments, rub the antler scales once every 2–3 months with pure mineral oil or natural beeswax paste. Wipe off excess after 15 minutes.",
      icon: Sparkles
    },
    {
      num: "05",
      title: "Proper Storage (Out of Leather Sheath)",
      desc: "Leather sheaths are treated with tanning salts and natural humectants that attract atmospheric moisture. For daily carry or field transport, the sheath is ideal. For long-term display or collection storage over 2 weeks, store the oiled knife outside its leather sheath in a dry presentation box.",
      icon: ShieldAlert
    }
  ];

  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Artisan Care Guide</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" /> Generational Preservation
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Damascus Knife Care & Maintenance Guide
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Preserve the razor bevel, high-carbon edge retention, and undulating Damascus grain of your Wazir Cutlery blade for generations.
            </p>
          </div>

          {/* Golden Rules Summary Banner */}
          <div className="p-8 rounded-[2.5rem] bg-[#0C0D0E] text-white border border-neutral-800 shadow-xl space-y-4">
            <h3 className="text-xl font-black font-geist text-[#D6AF66]">The 3 Golden Rules of High-Carbon Cutlery</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="font-bold text-white text-sm">1. Never Dishwash</span>
                <p className="text-neutral-400">Harsh detergents and high heat will permanently destroy Damascus etchings and warp horn handles.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="font-bold text-white text-sm">2. Keep It Oiled</span>
                <p className="text-neutral-400">A microscopic film of food-safe mineral oil prevents atmospheric moisture from reacting with carbon steel.</p>
              </div>
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <span className="font-bold text-white text-sm">3. Dry Instantly</span>
                <p className="text-neutral-400">Hand-wash and towel-dry with a clean cloth immediately following cutting tasks.</p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-neutral-900 font-geist tracking-tight text-center">
              The 5 Essential Maintenance Steps
            </h2>

            <div className="space-y-4">
              {steps.map((step) => (
                <div
                  key={step.num}
                  className="bg-white p-7 sm:p-8 rounded-[2rem] border border-neutral-200/80 shadow-2xs space-y-3 flex flex-col sm:flex-row items-start gap-6"
                >
                  <div className="flex-shrink-0 flex items-center gap-3 sm:block">
                    <span className="text-2xl font-black font-mono text-[#D6AF66]">{step.num}</span>
                    <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700 sm:mt-2">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 font-geist">{step.title}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-geist">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharpening Recommendation Section */}
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-neutral-200/80 shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-neutral-900 font-geist">Sharpening & Bevel Honing Angles</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Wazir Cutlery blades are tempered to 58–60 HRC. For optimal cutting performance:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                <span className="font-bold text-neutral-900 text-sm">Chef & Culinary Cutlery: 15°–18° Per Side</span>
                <p className="text-neutral-500 leading-relaxed">
                  Use whetstones (1000 grit for setting bevel, 3000–6000 grit for surgical razor polishing). Strop on a leather paddle charged with green chromium oxide compound.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5">
                <span className="font-bold text-neutral-900 text-sm">Hunting Bowies & Bushcraft: 20°–22° Per Side</span>
                <p className="text-neutral-500 leading-relaxed">
                  A wider secondary bevel angle offers superior edge resilience against heavy cartilage, field dressing, and wood carving.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
