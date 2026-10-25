"use client";

import { useState, useRef } from "react";
import { MessageSquare, Send, Phone, Mail, MapPin, CheckCircle2, ShieldCheck, Sparkles, Building2 } from "lucide-react";
import { FiArrowUpRight } from "react-icons/fi";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    whatsapp_number: "",
    company_name: "",
    country: "",
    city: "",
    inquiry_type: "Custom Bespoke Commission",
    product_quantity: "",
    shipment_address: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please provide your full name, email address, and message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: recaptchaToken || undefined
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to dispatch message to the forge.");
      }

      setIsSubmitted(true);
      toast.success("Inquiry Dispatched! Our master artisans will contact you shortly.");
      
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        whatsapp_number: "",
        company_name: "",
        country: "",
        city: "",
        inquiry_type: "Custom Bespoke Commission",
        product_quantity: "",
        shipment_address: "",
        message: ""
      });

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error?.message || "There was an issue sending your message. Please reach us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#0C0D0E] text-white p-8 sm:p-12 rounded-[2.5rem] border border-neutral-800 shadow-2xl max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#D6AF66]/20 border border-[#D6AF66]/40 flex items-center justify-center mx-auto text-[#D6AF66]">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl font-black font-geist text-white tracking-tight">Inquiry Received by the Forge</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to Wazir Cutlery. Our master artisans in Wazirabad review bespoke commissions and inquiries daily and will respond within 24 business hours.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/923160764052"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            <MessageSquare className="h-4 w-4" /> Priority WhatsApp Chat
          </a>
          <Button
            type="button"
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="h-11 px-6 rounded-xl border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900 font-bold text-xs"
          >
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Direct Artisan Contact Channels */}
      <div className="lg:col-span-5 space-y-6">
        {/* Direct WhatsApp Card */}
        <div className="bg-[#0C0D0E] text-white p-7 rounded-[2rem] border border-neutral-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D6AF66]/15 rounded-xl text-[#D6AF66]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-geist text-white">Direct Artisan Access</h3>
              <p className="text-xs text-neutral-400">Immediate response via WhatsApp</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <a
              href="https://wa.me/923160764052"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-neutral-900/80 hover:bg-neutral-800 border border-[#D6AF66]/30 hover:border-[#D6AF66] rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#D6AF66] transition-colors">Tayyab Mughal</div>
                  <div className="text-[10px] text-[#D6AF66] font-medium">International Client Relations Manager</div>
                  <div className="text-[11px] text-neutral-400 font-mono">+92 316 0764052</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#25D366]/20 text-[#25D366] inline-flex items-center gap-0.5">
                <span>Chat</span>
                <FiArrowUpRight className="h-3 w-3" />
              </span>
            </a>

            <a
              href="https://wa.me/+923080601995"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/80 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#D6AF66] transition-colors">Hassan Mughal</div>
                  <div className="text-[11px] text-neutral-400 font-mono">+92 308 0601995</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#25D366]/20 text-[#25D366] inline-flex items-center gap-0.5">
                <span>Chat</span>
                <FiArrowUpRight className="h-3 w-3" />
              </span>
            </a>

            <a
              href="https://wa.me/+923126209302"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/80 rounded-2xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#D6AF66] transition-colors">Qamar Shahzad</div>
                  <div className="text-[11px] text-neutral-400 font-mono">+92 312 6209302</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#25D366]/20 text-[#25D366] inline-flex items-center gap-0.5">
                <span>Chat</span>
                <FiArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          </div>
        </div>

        {/* Heritage Forge Location Card */}
        <div className="bg-white p-7 rounded-[2rem] border border-neutral-100 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 font-geist">The Historic Wazirabad Forge</h4>
              <p className="text-xs text-neutral-400">Centuries of bladecraft heritage</p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Near High Class Bakers, G.T. Road, Wazirabad, Punjab, Pakistan.<br />
            Known globally as the cutlery capital of South Asia.
          </p>
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
            <Mail className="h-4 w-4 text-[#D6AF66]" />
            <span>Official Inquiries:</span>
            <a href="mailto:info@wazircutlery.com" className="font-bold text-neutral-900 hover:text-[#D6AF66] transition-colors">
              info@wazircutlery.com
            </a>
          </div>
        </div>

        {/* Quality Assurance Card */}
        <div className="p-5 rounded-2xl bg-[#D6AF66]/10 border border-[#D6AF66]/20 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#D6AF66] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-neutral-800 leading-relaxed">
            Every custom blade is individually heat-treated, acid-etched, and inspected for Rockwell hardness prior to global shipment.
          </p>
        </div>
      </div>

      {/* Right Column: Contact & Custom Order Form */}
      <div className="lg:col-span-7 bg-white p-7 sm:p-10 rounded-[2.5rem] border border-neutral-100 shadow-xl space-y-8">
        <div>
          <h2 className="text-2xl font-black text-neutral-900 font-geist tracking-tight">Commission a Piece or Inquire</h2>
          <p className="text-xs text-neutral-400 mt-1">Fill out the details below and our team will get in touch with specification pricing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquiry Type Radio / Pill Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Inquiry Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                "Custom Bespoke Commission",
                "B2B Wholesale / Bulk",
                "Product Inquiry"
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleInputChange("inquiry_type", type)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                    formData.inquiry_type === type
                      ? "bg-neutral-900 border-neutral-900 text-white shadow-sm"
                      : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Full Name *</Label>
              <Input
                required
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="Lord / Lady Artisan"
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Email Address *</Label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="artisan@example.com"
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Phone / Mobile</Label>
              <Input
                value={formData.phone_number}
                onChange={(e) => handleInputChange("phone_number", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">WhatsApp Number</Label>
              <Input
                value={formData.whatsapp_number}
                onChange={(e) => handleInputChange("whatsapp_number", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Company & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2 sm:col-span-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Company (Optional)</Label>
              <Input
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                placeholder="Retail / Business"
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white"
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Country</Label>
              <Input
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="United States, UK, etc."
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white"
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">Desired Quantity</Label>
              <Input
                type="number"
                min="1"
                value={formData.product_quantity}
                onChange={(e) => handleInputChange("product_quantity", e.target.value)}
                placeholder="e.g., 1 or 50"
                className="h-12 rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white tabular-nums"
              />
            </div>
          </div>

          {/* Detailed Message */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-geist">
              Masterpiece Specifications / Message *
            </Label>
            <Textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Describe your desired blade steel (Damascus pattern, High Carbon), handle material (Stag Horn, Rosewood), blade length, or wholesale project details..."
              className="rounded-xl bg-neutral-50/50 border-neutral-200 focus:bg-white text-sm"
            />
          </div>

          {/* reCAPTCHA widget if key available */}
          {siteKey && (
            <div className="pt-1">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={(token: string | null) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>
          )}

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 rounded-2xl bg-[#D6AF66] hover:bg-[#C19A5A] text-neutral-950 font-bold text-sm tracking-wide shadow-xl shadow-[#D6AF66]/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Dispatching to Forge...</span>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send Inquiry to Master Artisans
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
