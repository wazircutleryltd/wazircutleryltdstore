"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from './AdminAuthProvider';

import { LoadingState } from './common/StateComponents';

export default function AdminRouteProtection({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdminLoggedIn) {
      router.push('/login');
    }
  }, [isAdminLoggedIn, isLoading, router]);

  // Show premium loading state while verifying artisan credentials
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <LoadingState message="Verifying Artisan Credentials..." />
      </div>
    );
  }

  // Prevent leak of admin UI elements during redirect
  if (!isAdminLoggedIn) {
    return null;
  }

  return children;
}
