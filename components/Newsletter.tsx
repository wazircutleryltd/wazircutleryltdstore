"use client";

import { useState } from "react";
import { Mail, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe to the guild.");
      }

      setIsSubscribed(true);
      toast.success("Welcome to the Collector's Guild! Check your inbox for your 10% welcome gift.");
      setEmail("");
    } catch (error: any) {
      toast.error(error?.message || "Could not complete subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0C0D0E] text-white p-8 sm:p-14 border border-neutral-800 shadow-2xl">
          {/* Subtle gold radial background glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-[#D6AF66]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-[#D6AF66]/5 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/15 border border-[#D6AF66]/30 text-[#D6AF66] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" />
                The Collector&apos;s Guild
              </div>
              <h2 className="text-2xl sm:text-4xl font-black font-geist text-white tracking-tight leading-tight">
                Unlock 10% Off Your First Forged Masterpiece
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Be the first to inspect limited forge runs, bespoke stag horn Bowie knives, and custom Damascus sword batches before public catalog release.
              </p>
            </div>

            {/* Right Subscription Form */}
            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="p-6 rounded-2xl bg-neutral-900/80 border border-[#D6AF66]/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#D6AF66]/20 text-[#D6AF66] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white font-geist">You Are Now in the Guild</h4>
                  <p className="text-xs text-neutral-400">
                    Your exclusive code <span className="text-[#D6AF66] font-mono font-bold">FORGE10</span> is ready for checkout.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="relative flex-1">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="pl-11 h-13 rounded-2xl bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500 text-sm focus:border-[#D6AF66] focus:ring-2 focus:ring-[#D6AF66]/20 transition-all font-geist"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-13 px-7 rounded-2xl bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 font-bold text-xs tracking-wider uppercase font-geist transition-all shadow-lg shadow-[#D6AF66]/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        "Joining..."
                      ) : (
                        <>
                          <span>Join Guild</span>
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-[11px] text-neutral-400 pl-1">
                    No spam ever. Unsubscribe with one click at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
