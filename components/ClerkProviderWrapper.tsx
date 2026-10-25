'use client';
import React from 'react';
import { ClerkProvider } from "@clerk/nextjs";

export default function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn("Clerk publishable key not found. Authentication features will be disabled.");
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
