"use client";

import { useState } from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ChevronDown, ChevronRight, HelpCircle, Sparkles, Search, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    category: "Craftsmanship & Metallurgy",
    question: "What makes Wazirabad Damascus steel world-renowned?",
    answer: "Wazirabad has been the epicenter of blade craftsmanship in South Asia for centuries. Our master artisans hand-forge pattern-welded Damascus by forge-welding alternating layers of 1095 high-carbon steel and 15N20 nickel alloy steel. The billet is folded and hammered between 256 to 512 layers, followed by precise heat-treatment and an acid bath that reveals the iconic undulating watery Damascus grain."
  },
  {
    category: "Craftsmanship & Metallurgy",
    question: "Are your stag horn handles genuine and ethically sourced?",
    answer: "Yes, 100% authentic naturally shed deer antler (stag horn). Male deer shed their antlers annually after the mating season. Our team sources these sheds responsibly from local collectors with zero harm to wildlife. Each antler handle is hand-contoured, polished, and fitted with solid brass pins and guards."
  },
  {
    category: "Craftsmanship & Metallurgy",
    question: "What is the Rockwell hardness (HRC) of Wazir Cutlery blades?",
    answer: "Our Damascus and high-carbon blades are vacuum heat-treated and oil-quenched to 58-60 HRC. This provides the optimal balance for functional cutlery: exceptional edge retention that holds a razor bevel under heavy use while retaining the micro-flexibility required to prevent chipping."
  },
  {
    category: "Worldwide Shipping & Customs",
    question: "Do you ship knives and swords internationally?",
    answer: "Yes, we ship globally to collectors in the United States, Canada, United Kingdom, European Union, Australia, and over 80 other countries. All shipments are expedited via DHL Express and FedEx International Priority with end-to-end tracking."
  },
  {
    category: "Worldwide Shipping & Customs",
    question: "How do you package blades to clear international customs safely?",
    answer: "Each blade is coated in protective anti-corrosion mineral oil, fitted into its hand-stitched leather sheath, and packed in reinforced collector boxes. Packages are legally declared with appropriate tariff codes (HS Code 8211 / 9307) for cutlery and collector works."
  },
  {
    category: "Worldwide Shipping & Customs",
    question: "What is the typical shipping timeline?",
    answer: "In-stock masterworks are dispatched within 24 hours and typically arrive within 2-4 business days worldwide. Custom forged orders require 7-14 days depending on blade complexity, heat-treatment cycles, and custom sheath leathercraft."
  },
  {
    category: "Custom Commissions & B2B",
    question: "Can I commission a custom knife with personalized engraving?",
    answer: "Yes. Our forge accommodates bespoke handle materials (burl wood, micarta, stag horn), custom blade profiles (Bowie, Santoku, Cleaver, Dagger, Viking Sword), and laser or hand-chiseled name/initial engravings. Contact us directly via our contact form or WhatsApp."
  },
  {
    category: "Custom Commissions & B2B",
    question: "Do you offer wholesale pricing for retailers and outdoor outfitters?",
    answer: "We supply specialty knife stores, hunting lodges, and cutlery boutiques worldwide. Tiered wholesale pricing and white-label custom manufacturing contracts are available. Inquire via our B2B contact form."
  },
  {
    category: "Blade Care & Maintenance",
    question: "How should I clean and store my Damascus knife to prevent patina and rust?",
    answer: "High-carbon steel must never be placed in a dishwasher or left submerged in water. After each use, hand-wash with mild warm water, dry thoroughly with a soft cloth, and apply a drop of food-safe mineral oil, camellia oil, or Renaissance wax before storage. Read our comprehensive /knife-care guide for step-by-step instructions."
  }
];

export default function FaqClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ["All", "Craftsmanship & Metallurgy", "Worldwide Shipping & Customs", "Custom Commissions & B2B", "Blade Care & Maintenance"];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Frequently Asked Questions</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <HelpCircle className="h-3.5 w-3.5" />
              Collector Knowledge Base
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Everything you need to know regarding authentic Wazirabad Damascus steel, stag horn harvesting, global shipping logistics, and knife care.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blade steel, shipping, customs, or warranty..."
              className="w-full pl-12 pr-4 h-13 rounded-2xl bg-white border border-neutral-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF66]/20 focus:border-[#D6AF66] transition-all font-geist"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#0C0D0E] text-white shadow-md shadow-neutral-900/10"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Questions */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-neutral-900 font-geist hover:text-[#D6AF66] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div className={`p-2 rounded-xl bg-neutral-100 text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180 bg-[#D6AF66]/15 text-[#D6AF66]" : ""}`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/60 font-geist">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Need More Assistance Banner */}
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#0C0D0E] text-white text-center space-y-4 border border-neutral-800 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-black font-geist text-white">Have a Specific Forge Question?</h3>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Our master artisans and support team are available on WhatsApp for direct consultations and custom specifications.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/923160764052"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp Master Artisan
              </a>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-neutral-700"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
