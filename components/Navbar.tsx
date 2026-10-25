'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../contexts/CartContext';
import QuickCartSheet from './QuickCartSheet';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ isAdminLoggedIn }: { isAdminLoggedIn?: boolean } = {}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { totalItems } = useCart();

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
            <header className={`sticky top-0 z-40 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-[#F9F9F6]/90 backdrop-blur-md shadow-md border-b border-[#D6AF66]/20 py-2.5' 
                    : 'bg-[#F9F9F6] border-b border-transparent py-4'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="transition-transform duration-200 hover:scale-[1.02]">
                                <Image 
                                    src="/logo.svg" 
                                    alt="Wazir Cutlery Logo" 
                                    width={96} 
                                    height={64} 
                                    priority
                                    className="h-12 w-auto object-contain"
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
                        <div className="flex items-center space-x-3">
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

                                    <div className="pt-6 border-t border-neutral-200">
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

