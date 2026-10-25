"use client";

import { Bell, User, Search, LogOut, Menu, X, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAdminAuth } from "../AdminAuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

export default function AdminHeader() {
    const { adminSession, logout } = useAdminAuth();
    const router = useRouter();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const confirmLogout = () => {
        logout();
        toast.success('Admin session ended securely');
        router.push('/login');
        setShowLogoutModal(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    return (
        <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-30 shadow-2xs">
            {/* Desktop Header */}
            <div className="flex items-center justify-between px-6 h-16">
                {/* Left: Mobile Toggle & Context */}
                <div className="flex items-center gap-3">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <button
                                className="md:hidden p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
                                aria-label="Open Admin Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 bg-[#0C0D0E] text-white p-6 flex flex-col justify-between border-r border-neutral-800">
                            <div>
                                <SheetHeader className="text-left mb-6">
                                    <SheetTitle className="flex items-center gap-2 text-white">
                                        <img src="/logo.svg" alt="Logo" className="h-7 w-auto brightness-0 invert" />
                                        <span className="text-sm font-bold">Wazir Cutlery</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="space-y-1">
                                    {[
                                        { name: 'Dashboard', href: '/admin' },
                                        { name: 'Orders', href: '/admin/orders' },
                                        { name: 'Categories', href: '/admin/categories' },
                                        { name: 'Products', href: '/admin/products' },
                                        { name: 'Newsletter', href: '/admin/newsletter' },
                                        { name: 'Contact Submissions', href: '/admin/contact-submissions' },
                                        { name: 'Customers', href: '/admin/customers' },
                                        { name: 'Login History', href: '/admin/login-history' },
                                        { name: 'Settings', href: '/admin/settings' },
                                    ].map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                            <div className="border-t border-neutral-800 pt-4">
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <div className="hidden sm:flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Live Forge Admin</span>
                    </div>
                </div>

                {/* Right: Quick Actions & Profile */}
                <div className="flex items-center gap-3">
                    {/* Quick Add Product Shortcut */}
                    <Link href="/admin/products?action=new">
                        <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#D6AF66] text-white hover:text-neutral-900 text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Quick Add Piece</span>
                        </button>
                    </Link>

                    {/* Admin Profile */}
                    <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
                        <div className="text-right hidden md:block">
                            <div className="text-xs font-bold text-neutral-900 leading-tight">
                                {adminSession?.username || 'Master Bladesmith'}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-mono">
                                Admin Access
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 text-xs font-bold font-mono">
                            {(adminSession?.username || 'A')[0].toUpperCase()}
                        </div>
                        <button
                            onClick={handleLogoutClick}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Sign out of admin"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 transform transition-all duration-200 animate-in zoom-in-95">
                        <h3 className="text-base font-bold text-neutral-900">Sign Out of Admin Portal</h3>
                        <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                            Are you sure you want to log out? Any unsaved edits in open product forms will be lost.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs font-semibold rounded-lg"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
                                onClick={confirmLogout}
                            >
                                Confirm Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}