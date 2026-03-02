"use client"
// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getMe } from '@/services/auth-service';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // ⚠️ Start true to prevent flash
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
        try {
            // Validate token by fetching user data
            const response = await getMe();
            setUser(response.data);
        } catch (error) {
            // If 401, token is invalid. Clear user.
            // The interceptor won't redirect here, so we do it manually.
            setUser(null);
            
            // Only redirect if not already on login page
            if (pathname !== '/login') {
            router.replace('/login');
            }
        } finally {
            setIsLoading(false); // ⚠️ Stop loading only after check completes
        }
        };

        checkAuth();
    }, [router, pathname]);

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};