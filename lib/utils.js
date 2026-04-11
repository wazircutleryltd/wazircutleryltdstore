import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Admin authentication utilities
export const ADMIN_SESSION_KEY = 'wazir_admin_session';

export const setAdminSession = (sessionData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
      ...sessionData,
      timestamp: Date.now()
    }));
  }
};

export const getAdminSession = () => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      const sessionData = JSON.parse(session);
      // Check if session is still valid (24 hours)
      const now = Date.now();
      const sessionAge = now - sessionData.timestamp;
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxAge) {
        return sessionData;
      } else {
        // Session expired, remove it
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

export const isAdminLoggedIn = () => {
  return getAdminSession() !== null;
};

// Get client IP address (for logging purposes)
export const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'unknown';
  }
};

// Get user agent
export const getUserAgent = () => {
  if (typeof window !== 'undefined') {
    return window.navigator.userAgent;
  }
  return 'unknown';
};

// Slugify string for SEO URLs
export const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};
