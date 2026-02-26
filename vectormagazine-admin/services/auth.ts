// Auth service for Vector Magazine Admin using Supabase

import { supabase } from '@/lib/supabase';
import { User, LoginResponse, AuthError } from '@/types/auth';

// Check if we have a valid session
export async function isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

// Login
export async function login(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message || 'Login failed');
    }

    // Optional: Verify if the user is actually an admin by checking the users table
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

    if (userError || !userData?.is_admin) {
        await supabase.auth.signOut();
        throw new Error('Unauthorized: Admin access required');
    }

    return data;
}

// Logout
export async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
}

// Get current user (Supabase auth user mapped to our expected type if needed)
export async function getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    // Fetch the extended user details from our public.users table
    const { data: extendedUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!extendedUser) return null;

    return {
        id: extendedUser.id,
        email: extendedUser.email,
        name: extendedUser.email.split('@')[0], // Default name
        role: extendedUser.is_admin ? 'admin' : 'editor',
        is_active: true,
        created_at: extendedUser.created_at,
        last_login: null
    } as User;
}

// Change password
export async function changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) {
        throw new Error(error.message || 'Failed to change password');
    }
}
