'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import { useSettingsStore } from '@/stores/settingsStore';
import QuickCartSheet from './QuickCartSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu, ShoppingBag, Phone } from 'lucide-react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa6';
import { motion } from 'framer-motion';

export default function Navbar({ isAdminLoggedIn }: { isAdminLoggedIn?: boolean } = {}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { totalItems } = useCart();
    const settings = useSettingsStore((state) => state.settings);

    const qamarPhone = settings.storeWhatsapp || "+92 312 6209302";
    const cleanQamarPhone = qamarPhone.replace(/[^0-9]/g, '');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/categories', label: 'Categories' },
        { href: '/product', label: 'All Products' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact Us' },
    ];

    return (
        <>
            {/* Top Bar with Qamar Mughal WhatsApp & Phone */}
            <div className="bg-[#111827] text-white text-xs border-b border-neutral-800 relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2">
                    {/* Left: Artisan branding */}
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse flex-shrink-0" />
                        <span className="text-[#D6AF66] font-bold tracking-wide truncate">Qamar Mughal:</span>
                        <span className="hidden md:inline text-neutral-300 truncate">Master Bladesmith &amp; Founder</span>
                    </div>

                    {/* Right: Direct WhatsApp & Phone Links */}
                    <div className="flex items-center gap-3 sm:gap-5 font-mono text-[11px] sm:text-xs flex-shrink-0">
                        <a 
                            href={`https://wa.me/${cleanQamarPhone}?text=Hello%20Qamar%20Mughal,%20I%20am%20interested%20in%20Wazir%20Cutlery%20blades`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-neutral-100 hover:text-[#25D366] transition-colors"
                            aria-label="Chat with Qamar Mughal on WhatsApp"
                        >
                            <FaWhatsapp className="h-3.5 w-3.5 text-[#25D366]" />
                            <span className="hidden sm:inline font-sans text-neutral-400">WhatsApp:</span>
                            <span className="font-semibold">{qamarPhone}</span>
                        </a>

                        <span className="text-neutral-700 hidden sm:inline">•</span>

                        <a 
                            href={`tel:${cleanQamarPhone}`}
                            className="inline-flex items-center gap-1.5 text-neutral-100 hover:text-[#D6AF66] transition-colors"
                            aria-label="Call Qamar Mughal"
                        >
                            <Phone className="h-3 w-3 text-[#D6AF66]" />
                            <span className="hidden sm:inline font-sans text-neutral-400">Call:</span>
                            <span className="font-semibold">{qamarPhone}</span>
                        </a>
                    </div>
                </div>
            </div>

            <header className={`sticky top-0 z-40 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-[#F9F9F6]/95 backdrop-blur-md shadow-sm border-b border-[#D6AF66]/25' 
                    : 'bg-[#F9F9F6] border-b border-neutral-200/60'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center py-1 transition-transform duration-200 hover:opacity-90">
                                <Image 
                                    src="/logo.svg" 
                                    alt="Wazir Cutlery Logo" 
                                    width={110} 
                                    height={44} 
                                    priority
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-[family-name:var(--font-outfit)] ${
                                            isActive
                                                ? 'text-neutral-900 font-semibold'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                                        }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#D6AF66] to-[#F27F0C] rounded-full"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Shopping Cart Button triggers QuickCartSheet */}
                            <motion.button
                                whileTap={{ scale: 0.94 }}
                                onClick={() => setIsCartSheetOpen(true)}
                                className={`relative p-2.5 rounded-xl border border-neutral-200/80 transition-all duration-200 cursor-pointer ${
                                    totalItems > 0 
                                        ? 'bg-[#D6AF66]/10 border-[#D6AF66]/40 text-[#8C6D23]' 
                                        : 'bg-white hover:bg-neutral-100 text-neutral-700'
                                }`}
                                aria-label="Open Shopping Cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        key={totalItems}
                                        className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#D6AF66] to-[#F27F0C] text-white text-[11px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-sm"
                                    >
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Mobile Menu Sheet */}
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        className="md:hidden p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition-colors"
                                        aria-label="Toggle navigation menu"
                                    >
                                        <Menu className="w-5 h-5" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-72 bg-[#F9F9F6] border-l border-[#D6AF66]/20 p-6 flex flex-col justify-between">
                                    <div>
                                        <SheetHeader className="text-left mb-6">
                                            <SheetTitle className="flex items-center space-x-2">
                                                <Image src="/logo.svg" alt="Logo" width={80} height={48} className="h-10 w-auto" />
                                            </SheetTitle>
                                        </SheetHeader>

                                        {/* Mobile Direct Artisan Contact Block */}
                                        <div className="mb-4 p-3 rounded-xl bg-neutral-900 text-white border border-[#D6AF66]/30">
                                            <div className="text-[11px] font-bold text-[#D6AF66] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                                                <span>Qamar Mughal • Direct Forge</span>
                                            </div>
                                            <div className="space-y-1.5 text-xs font-mono">
                                                <a 
                                                    href={`https://wa.me/${cleanQamarPhone}?text=Hello%20Qamar%20Mughal,%20I%20am%20interested%20in%20Wazir%20Cutlery%20blades`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between text-neutral-200 hover:text-[#25D366] py-1 transition-colors"
                                                >
                                                    <span className="font-sans text-neutral-400">WhatsApp:</span>
                                                    <span className="font-semibold text-white">{qamarPhone}</span>
                                                </a>
                                                <a 
                                                    href={`tel:${cleanQamarPhone}`}
                                                    className="flex items-center justify-between text-neutral-200 hover:text-[#D6AF66] py-1 border-t border-neutral-800 transition-colors"
                                                >
                                                    <span className="font-sans text-neutral-400">Call Phone:</span>
                                                    <span className="font-semibold text-white">{qamarPhone}</span>
                                                </a>
                                            </div>
                                        </div>

                                        <nav className="flex flex-col space-y-2">
                                            {navLinks.map((link) => {
                                                const isActive = pathname === link.href;
                                                return (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={`px-4 py-3 rounded-xl text-base font-medium transition-colors font-[family-name:var(--font-outfit)] ${
                                                            isActive
                                                                ? 'bg-[#D6AF66]/15 text-[#8C6D23] font-semibold'
                                                                : 'text-neutral-700 hover:bg-neutral-100'
                                                        }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>

                                    <div className="pt-6 border-t border-neutral-200 space-y-4">
                                        <Link
                                            href="/cart"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm"
                                        >
                                            <ShoppingBag className="w-4 h-4 text-[#D6AF66]" />
                                            <span>View Cart ({totalItems})</span>
                                        </Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Quick-Cart Slide-Over Sheet Drawer */}
            <QuickCartSheet
                open={isCartSheetOpen}
                onOpenChange={setIsCartSheetOpen}
            />
        </>
    );
}

