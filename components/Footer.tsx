'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useActiveCategoriesQuery } from "../lib/hooks";

const Footer = () => {
  const { data: categories } = useActiveCategoriesQuery();
  const topCategories = categories?.slice(0, 5);

  return (
    <footer className="bg-footer py-12 md:py-16 border-t border-neutral-800/80">
      <div className="max-w-8xl mx-auto px-6 lg:px-9">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row gap-12 mb-12">
          {/* Logo & Brand Mission Section */}
          <div className="flex-shrink-0 lg:w-1/4 space-y-4">
            <Link href="/" className="inline-block">
              <div className="w-16 h-16 flex items-center justify-center">
                <Image src="/footer-logo.svg" alt="Wazir Logo" width={143} height={58} />
              </div>
            </Link>
            <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-xs font-geist">
              Master artisans of Wazirabad, forging pattern-welded Damascus steel and authentic stag horn antler cutlery for discerning collectors worldwide.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* The Forge */}
            <div>
              <h3 className="footer-heading font-bold text-sm tracking-widest uppercase mb-5 text-white">The Forge</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Home</Link></li>
                <li><Link href="/product" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">All Masterworks</Link></li>
                <li><Link href="/categories" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Categories</Link></li>
                <li><Link href="/about" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">About the Heritage</Link></li>
                <li><Link href="/knife-care" className="footer-link text-xs hover:text-[#D6AF66] transition-colors font-semibold text-[#D6AF66]">Knife Care Guide</Link></li>
                <li><Link href="/track-order" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Track Your Order</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="footer-heading font-bold text-sm tracking-widest uppercase mb-5 text-white">Patron Service</h3>
              <ul className="space-y-3">
                <li><Link href="/contact" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Frequently Asked Questions</Link></li>
                <li><Link href="/shipping" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Worldwide Shipping & Customs</Link></li>
                <li><Link href="/returns" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Artisan Lifetime Warranty</Link></li>
                <li><Link href="/contact" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">B2B & Wholesale Orders</Link></li>
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h3 className="footer-heading font-bold text-sm tracking-widest uppercase mb-5 text-white">Compliance</h3>
              <ul className="space-y-3">
                <li><Link href="/terms" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="footer-link text-xs hover:text-[#D6AF66] transition-colors">Privacy Policy</Link></li>
                <li><span className="text-[11px] text-[#808080] block pt-1">Age Verification Required (18+)</span></li>
                <li><span className="text-[11px] text-[#808080] block">Ethically Sourced Shed Antler</span></li>
              </ul>
            </div>

            {/* Direct Artisan Contact & Socials */}
            <div>
              <h3 className="footer-heading font-bold text-sm tracking-widest uppercase mb-5 text-white">Artisan Hotline</h3>
              <div className="space-y-3 text-xs mb-6">
                <div>
                  <p className="text-[#808080] text-[11px] mb-0.5">Hassan Mughal:</p>
                  <Link href="https://wa.me/+923080601995" target="_blank" className="text-[#C0C0C0] hover:text-[#D6AF66] font-mono transition-colors">
                    +92 308 0601995 (WhatsApp)
                  </Link>
                </div>
                <div>
                  <p className="text-[#808080] text-[11px] mb-0.5">Qamar Shahzad:</p>
                  <Link href="https://wa.me/+923126209302" target="_blank" className="text-[#C0C0C0] hover:text-[#D6AF66] font-mono transition-colors">
                    +92 312 6209302 (WhatsApp)
                  </Link>
                </div>
              </div>

              {/* Social Icons with Gold Hover */}
              <div className="flex items-center gap-3">
                <a href="https://www.facebook.com/share/16z6hKB6KL/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#D6AF66] hover:border-[#D6AF66] transition-colors group">
                  <Image src="/facebook-gray.svg" alt="Facebook" width={18} height={18} className="group-hover:brightness-0" />
                </a>
                <a href="https://www.instagram.com/wazircutlery?utm_source=qr&igsh=am4yc3Z2ZDV1bTM4" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#D6AF66] hover:border-[#D6AF66] transition-colors group">
                  <Image src="/instagram-gray.svg" alt="Instagram" width={18} height={18} className="group-hover:brightness-0" />
                </a>
                <a href="https://youtube.com/@wazircutleryltd?si=1_jqdKkNlecHfcFz" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#D6AF66] hover:border-[#D6AF66] transition-colors group">
                  <Image src="/youtube-gray.svg" alt="YouTube" width={18} height={18} className="group-hover:brightness-0" />
                </a>
                <a href="https://www.tiktok.com/@wazircutlery?_t=ZP-8zmHjcDQuLe&_r=1" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-[#D6AF66] hover:border-[#D6AF66] transition-colors group">
                  <Image src="/tiktok-gray.svg" alt="Tik Tok" width={18} height={18} className="group-hover:brightness-0" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Forge Address */}
        <div className="pt-8 border-t border-neutral-800/80 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-xs text-[#808080]">
            <span className="font-semibold text-[#A0A0A0]">Wazir Cutlery Works:</span>
            <span>Near High Class Bakers, G.T. Road, Wazirabad, Punjab, Pakistan</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-[#606060]">
          <p>© {new Date().getFullYear()} Wazir Cutlery Ltd. All rights reserved. Handcrafted in the cutlery capital of South Asia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;