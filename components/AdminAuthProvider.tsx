"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAdminSession, clearAdminSession } from '../lib/utils';
import type { AdminSession } from '@/types';

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  adminSession: AdminSession | any | null;
  isLoading: boolean;
  login: (sessionData: any) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminSession, setAdminSession] = useState<AdminSession | any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const session = getAdminSession();
      if (session) {
        setIsAdminLoggedIn(true);
        setAdminSession(session);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (sessionData: any) => {
    try {
      setAdminSession(sessionData);
      setIsAdminLoggedIn(true);
    } catch (error) {
      console.error('Error during admin login:', error);
    }
  };

  const logout = () => {
    try {
      clearAdminSession();
      setAdminSession(null);
      setIsAdminLoggedIn(false);
    } catch (error) {
      console.error('Error during admin logout:', error);
    }
  };

  const value = {
    isAdminLoggedIn,
    adminSession,
    isLoading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
