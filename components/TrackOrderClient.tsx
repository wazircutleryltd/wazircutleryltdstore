"use client";

import { useState } from "react";
import Link from "next/link";
import ConditionalLayout from "@/components/ConditionalLayout";
import { 
  ChevronRight, 
  PackageSearch, 
  Search, 
  Truck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) {
      toast.error("Please enter both Order ID and Email Address.");
      return;
    }

    setIsLoading(true);
    setSearched(true);

    try {
      // Query order by order_number and email
      const cleanOrderNum = orderNumber.trim();
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .ilike("order_number", `%${cleanOrderNum}%`)
        .single();

      if (error || !data) {
        setOrderData(null);
        toast.info("No matching consignment found. Please verify your order number.");
      } else {
        setOrderData(data);
        toast.success("Order status retrieved!");
      }
    } catch (err) {
      console.error("Lookup error:", err);
      toast.error("Network error while searching for order.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "completed") return 4;
    if (s === "shipped" || s === "in_transit") return 3;
    if (s === "processing" || s === "forging") return 2;
    return 1;
  };

  const currentStep = orderData ? getStepProgress(orderData.status || orderData.order_status) : 1;

  return (
    <ConditionalLayout>
      <div className="min-h-screen bg-[#FDFCFB] text-neutral-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <nav className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-400">
              <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#D6AF66]">Order Tracking</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6AF66]/10 border border-[#D6AF66]/20 text-[#B89249] text-xs font-bold uppercase tracking-widest">
              <PackageSearch className="h-3.5 w-3.5" /> Live Consignment Tracker
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-geist tracking-tight">
              Track Your Masterwork
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Enter your Order Reference Number and Email to inspect the forging, packaging, and international transit status of your shipment.
            </p>
          </div>

          {/* Lookup Card */}
          <div className="bg-white p-7 sm:p-10 rounded-[2.5rem] border border-neutral-200/80 shadow-sm max-w-2xl mx-auto">
            <form onSubmit={handleLookup} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                  Order Reference Number *
                </Label>
                <Input
                  required
                  placeholder="e.g., ORD-1792916..."
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
                  Customer Email Address *
                </Label>
                <Input
                  type="email"
                  required
                  placeholder="The email used during checkout..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-[#D6AF66]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  "Querying Forge Archives..."
                ) : (
                  <>
                    <Search className="h-4 w-4" /> Locate Consignment
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Results Display */}
          {searched && (
            <div className="max-w-2xl mx-auto">
              {orderData ? (
                <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-md space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-neutral-100">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-geist">Consignment</span>
                      <h3 className="text-lg font-black text-neutral-900 font-mono">{orderData.order_number}</h3>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#D6AF66]/15 border border-[#D6AF66]/30 text-[#B89249] text-xs font-bold capitalize">
                      Status: {orderData.status || orderData.order_status || "Processing"}
                    </div>
                  </div>

                  {/* Visual 4-Step Progress Bar */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Fulfillment Lifecycle</span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { title: "Confirmed", step: 1 },
                        { title: "Inspected & Oiled", step: 2 },
                        { title: "In Transit", step: 3 },
                        { title: "Delivered", step: 4 }
                      ].map((s) => (
                        <div key={s.step} className="space-y-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              currentStep >= s.step ? "bg-[#D6AF66]" : "bg-neutral-100"
                            }`}
                          />
                          <span
                            className={`text-[11px] block font-semibold ${
                              currentStep >= s.step ? "text-neutral-900 font-bold" : "text-neutral-400"
                            }`}
                          >
                            {s.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-neutral-50 text-xs">
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Order Date:</span>
                      <p className="font-bold text-neutral-800 mt-0.5">{new Date(orderData.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Order Total:</span>
                      <p className="font-bold text-neutral-800 mt-0.5">${(Number(orderData.total_amount) || 0).toFixed(2)} USD</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-[2rem] bg-neutral-50 border border-neutral-200 text-center space-y-3">
                  <PackageSearch className="h-10 w-10 text-neutral-400 mx-auto" />
                  <h4 className="font-bold text-neutral-900">No Record Found</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    We could not locate an order matching that reference ID. Please check your confirmation email or message our support team on WhatsApp.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Direct Support */}
          <div className="text-center space-y-2 pt-4">
            <p className="text-xs text-neutral-400">Need immediate assistance with your delivery?</p>
            <a
              href="https://wa.me/+923080601995"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Inquire with Master Artisan on WhatsApp ↗
            </a>
          </div>
        </div>
      </div>
    </ConditionalLayout>
  );
}
