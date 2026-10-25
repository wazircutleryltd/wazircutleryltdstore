"use client";

import { toast } from "sonner";

export interface AppError {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Global Error Handler for Wazir Cutlery
 * Standardizes how we handle, log, and display errors across the application.
 */
export const handleAppError = (error: unknown, context = "Operation"): { code: string; message: string } => {
  const err = error as AppError;
  const code = err?.code || 'ERROR';
  const message = err?.message || 'Unexpected response from the forge.';
  
  // 1. Detailed Logging for Debugging
  console.error(`[Admin Error] @ ${context} | ${code}: ${message}`, {
    originalError: error,
    timestamp: new Date().toISOString()
  });

  // 2. User Feedback via Sonner
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
export const handleAppSuccess = (message: string, description = "") => {
  toast.success(message, {
    description,
    duration: 3000,
  });
};
