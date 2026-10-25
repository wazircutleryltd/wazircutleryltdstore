import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Admin authentication utilities
export const ADMIN_SESSION_KEY = 'wazir_admin_session';

export interface AdminSession {
  username?: string;
  email?: string;
  role?: string;
  token?: string;
  timestamp: number;
  [key: string]: unknown;
}

export const setAdminSession = (sessionData: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
      ...sessionData,
      timestamp: Date.now()
    }));
  }
};

export const getAdminSession = (): AdminSession | null => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      try {
        const sessionData: AdminSession = JSON.parse(session);
        // Check if session is still valid (24 hours)
        const now = Date.now();
        const sessionAge = now - (sessionData.timestamp || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionAge < maxAge) {
          return sessionData;
        } else {
          // Session expired, remove it
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
  }
  return null;
};

export const clearAdminSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
};

export const isAdminLoggedIn = (): boolean => {
  return getAdminSession() !== null;
};

// Get client IP address (for logging purposes)
export const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'unknown';
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'unknown';
  }
};

// Get user agent
export const getUserAgent = (): string => {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent;
  }
  return 'unknown';
};

// Slugify string for SEO URLs
export const slugify = (text: string | null | undefined): string => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};
