'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, getCurrentUser, logout as authLogout, isAuthenticated } from '@/services/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (e) {
            setUser(null);
        }
    }, []);

    const logout = useCallback(async () => {
        await authLogout();
        setUser(null);
        // Redirect to login
        window.location.href = '/login';
    }, []);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (e) {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isLoggedIn: !!user,
        logout,
        refreshUser,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
