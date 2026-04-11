"use client";

import { toast } from "sonner";

/**
 * Global Error Handler for Wazir Cutlery
 * Standardizes how we handle, log, and display errors across the application.
 */
export const handleAppError = (error, context = "Operation") => {
  const code = error?.code || 'ERROR';
  const message = error?.message || 'Unexpected response from the forge.';
  
  // 1. Detailed Logging for Debugging
  console.error(`[Admin Error] @ ${context} | ${code}: ${message}`, {
    originalError: error,
    timestamp: new Date().toISOString()
  });

  // 2. User Feedback via Sonner
  // We customize the message for common Supabase/Network errors
  let userMessage = message;
  
  if (code === 'PGRST116') userMessage = "The requested resource could not be found.";
  if (code === '23505') userMessage = "A duplicate record already exists.";
  if (code === 'PGRST205') userMessage = "Database schema mismatch. Please contact support.";
  
  toast.error(`${context} Failed`, {
    description: userMessage,
    duration: 5000,
  });

  return { code, message: userMessage };
};

/**
 * Success Utility
 */
export const handleAppSuccess = (message, description = "") => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};
