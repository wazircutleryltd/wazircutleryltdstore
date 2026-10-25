"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getAdminSession } from '../lib/utils';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    try {
      const session = getAdminSession();
      setIsAdminLoggedIn(!!session);
    } catch (error) {
      console.warn('Error checking admin session:', error);
    }
  }, []);

  // Don't show navbar and footer on admin and auth pages
  const isAdminPage = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  const shouldShowNavbarFooter = !isAdminPage && !isAuthPage;

  return (
    <>
      {shouldShowNavbarFooter && <Navbar isAdminLoggedIn={isAdminLoggedIn} />}
      {children}
      {shouldShowNavbarFooter && <Footer />}
    </>
  );
}
