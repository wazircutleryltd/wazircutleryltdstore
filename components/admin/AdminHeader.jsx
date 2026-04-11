"use client";

import { Bell, User, Search, LogOut, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAdminAuth } from "../AdminAuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function AdminHeader() {
    const { adminSession, logout } = useAdminAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuRef = useRef(null);

    const confirmLogout = () => {
        logout();
        toast.success('Admin logged out successfully');
        router.push('/');
        setShowLogoutModal(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <header className="relative bg-white shadow-sm border-b border-gray-200">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Uncomment these sections if you want to add search and notifications */}
                    {/*  <div className="relative">*/}
                    {/*    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />*/}
                    {/*    <Input*/}
                    {/*      placeholder="Search..."*/}
                    {/*      className="pl-10 w-64"*/}
                    {/*    />*/}
                    {/*  </div>*/}

                      <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                      </Button>


                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                                {adminSession?.username || 'Admin User'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {adminSession?.loginTime ?
                                    `Logged in: ${new Date(adminSession.loginTime).toLocaleString()}` :
                                    'admin@wazircutlery.com'
                                }
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full">
                            <User className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogoutClick}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-3">
                <Link href="/admin" className="flex items-center">
                    <img src="/logo.svg" alt="Stag Horn" className="h-12 w-auto" />
                </Link>
                <Button variant="ghost" size="sm" onClick={toggleMenu}>
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Mobile Sidebar */}
            {isMenuOpen && (
                <div ref={menuRef} className="absolute w-full z-10 md:hidden bg-white border-t border-gray-200">
                    <nav className="px-4 py-4">
                        <ul className="space-y-2 text-center">
                            <li>
                                <Link href="/admin/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/newsletter" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Newsletter
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/contact-submissions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Contact Submissions
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/login-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Login History
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="border-t border-gray-200 px-4 py-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogoutClick}
                            className="w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 transform transition-all duration-200 animate-in zoom-in-95 slide-in-from-bottom-4">
                        <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
                        <p className="mt-2 text-sm text-gray-600">Are you sure you want to log out?</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 text-white hover:bg-red-700"
                                onClick={confirmLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}