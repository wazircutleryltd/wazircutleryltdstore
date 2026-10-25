"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Play, Pause, Volume2, VolumeX, Flame, Hammer, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CraftChapter {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  metric: string;
  metricLabel: string;
}

const chapters: CraftChapter[] = [
  {
    id: "forge",
    title: "1. The White-Hot Hearth",
    tagline: "Stacking 1095 & 15N20 Carbon Steels",
    description: "Alternating billets of ultra-pure high-carbon 1095 steel and high-nickel 15N20 are fused under 2,300°F white heat, initiating the molecular bond of legendary Damascus steel.",
    icon: Flame,
    metric: "2,300°F",
    metricLabel: "Forge Temperature",
  },
  {
    id: "fold",
    title: "2. The 350-Layer Fold",
    tagline: "Recursive Forge-Welding & Folding",
    description: "Every blade undergoes iterative folding and hammer-welding, forging undulating raindrop and ladder patterns unique to each blade—no two masterworks are ever alike.",
    icon: Hammer,
    metric: "350+",
    metricLabel: "Forged Micro-Layers",
  },
  {
    id: "stag",
    title: "3. Genuine Stag Horn Fitting",
    tagline: "Naturally Shed Antler & Brass Bolsters",
    description: "Carved from naturally shed wild stag horn, handles are contoured for ergonomic palm weld, capped with solid hand-buffed brass guards and mosaic pins.",
    icon: Sparkles,
    metric: "100%",
    metricLabel: "Natural Horn & Brass",
  },
  {
    id: "temper",
    title: "4. Cryogenic Temper & Keen Edge",
    tagline: "Double Quenching to 58-60 HRC",
    description: "Oil quenching followed by cryogenic tempering delivers enduring edge retention and shock resilience, hand-stropped to a hair-splitting 15° razor apex.",
    icon: ShieldCheck,
    metric: "58-60",
    metricLabel: "Rockwell HRC Hardness",
  },
];

export default function ArtisanCraftReel() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const activeChapter = chapters[activeChapterIndex];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative py-20 bg-neutral-950 text-white overflow-hidden">
      {/* Decorative Forge Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-[#D6AF66]/30 bg-[#D6AF66]/10 mb-4">
            <Flame className="w-4 h-4 text-[#D6AF66]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#D6AF66]">
              Artisanal Bladesmithing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-[family-name:var(--font-outfit)]">
            Born of Fire, Carbon & Craft
          </h2>
          <p className="mt-4 text-neutral-400 text-base sm:text-lg font-[family-name:var(--font-cabin)]">
            Journey into our ancestral Wazirabad workshops where centuries of metalwork heritage fuse with surgical-grade modern metallurgy.
          </p>
        </div>

        {/* Video Canvas & Chapter Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Video Reel Viewport */}
          <div className="lg:col-span-7 relative group rounded-2xl overflow-hidden border border-[#D6AF66]/30 shadow-2xl bg-neutral-900 aspect-video flex items-center justify-center">
            {/* Fallback loop video showing fire/craftsmanship */}
            <video
              ref={videoRef}
              src="https://assets.mixkit.co/videos/preview/mixkit-fire-sparks-rising-in-the-dark-42416-large.mp4"
              poster="/product.jpg"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Dark gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30 pointer-events-none" />

            {/* In-Video Active Chapter Tag */}
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#D6AF66]/30 text-xs font-medium text-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Chapter {activeChapterIndex + 1} of 4</span>
              </span>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Chapters & Storytelling Milestone Tabs */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            {chapters.map((chapter, index) => {
              const isSelected = activeChapterIndex === index;
              const Icon = chapter.icon;

              return (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapterIndex(index)}
                  className={`text-left p-4 rounded-xl transition-all duration-300 relative border ${
                    isSelected
                      ? "bg-neutral-900 border-[#D6AF66]/50 shadow-lg shadow-[#D6AF66]/5"
                      : "bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/70 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-[#D6AF66]/20 text-[#D6AF66]" : "bg-neutral-800 text-neutral-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold font-[family-name:var(--font-outfit)] ${
                          isSelected ? "text-white" : "text-neutral-300"
                        }`}>
                          {chapter.title}
                        </h4>
                        <p className="text-xs text-neutral-500 font-[family-name:var(--font-cabin)]">
                          {chapter.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-mono font-bold ${
                        isSelected ? "text-[#D6AF66]" : "text-neutral-400"
                      }`}>
                        {chapter.metric}
                      </div>
                      <div className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        {chapter.metricLabel}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-400 font-[family-name:var(--font-cabin)] leading-relaxed">
                          {chapter.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}

            {/* Direct CTA */}
            <div className="pt-2">
              <Link
                href="/product"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#D6AF66] to-[#F27F0C] hover:opacity-95 text-white text-sm font-semibold shadow-lg transition-all"
              >
                <span>Explore Handcrafted Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Hallmark Proof Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-900">
          <div className="text-center p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-bold text-[#D6AF66] font-[family-name:var(--font-outfit)]">
              350+
            </div>
            <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
              Damascus Steel Layers
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
              58-60 HRC
            </div>
            <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
              Rockwell Hardness
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-bold text-[#D6AF66] font-[family-name:var(--font-outfit)]">
              100%
            </div>
            <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
              Natural Horn & Brass
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/60">
            <div className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-outfit)]">
              Lifetime
            </div>
            <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
              Artisan Warranty
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
