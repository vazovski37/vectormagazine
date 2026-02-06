// Auth service for Vector Magazine Admin
// Handles login, logout, token refresh, and user state

import { API_BASE_URL } from './api';
import { API_ENDPOINTS } from './endpoints';

// Types
import { User, LoginResponse, AuthError } from '@/types/auth';

// Token storage (memory only - more secure than localStorage)
let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

// Get current access token
export function getAccessToken(): string | null {
    // Check if token is expired
    if (tokenExpiresAt && Date.now() >= tokenExpiresAt) {
        accessToken = null;
        tokenExpiresAt = null;
    }
    return accessToken;
}

// Set access token with expiration
export function setAccessToken(token: string, expiresIn: number): void {
    accessToken = token;
    // Set expiry 30 seconds early to account for clock skew
    tokenExpiresAt = Date.now() + (expiresIn - 30) * 1000;
}

// Clear tokens
export function clearTokens(): void {
    accessToken = null;
    tokenExpiresAt = null;
}

// Check if we have a valid token
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}

// Login
export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Required for HTTP-only cookies
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(error.error || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    setAccessToken(data.access_token, data.expires_in);

    return data;
}

// Logout
export async function logout(): Promise<void> {
    try {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (e) {
        // Ignore errors during logout
    }
    clearTokens();
}

// Refresh access token using HTTP-only cookie
export async function refreshToken(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            clearTokens();
            return false;
        }

        const data = await response.json();
        setAccessToken(data.access_token, data.expires_in);
        return true;
    } catch (e) {
        clearTokens();
        return false;
    }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
    const token = getAccessToken();
    if (!token) {
        // Try to refresh first
        const refreshed = await refreshToken();
        if (!refreshed) return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ME}`, {
            headers: {
                'Authorization': `Bearer ${getAccessToken()}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired, try refresh
                const refreshed = await refreshToken();
                if (refreshed) {
                    return getCurrentUser();
                }
            }
            return null;
        }

        const data = await response.json();
        return data.user;
    } catch (e) {
        return null;
    }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`,
        },
        credentials: 'include',
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to change password' }));
        throw new Error(error.error || 'Failed to change password');
    }
}

// Authenticated fetch wrapper
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    let token = getAccessToken();

    // Try to refresh if no token
    if (!token) {
        const refreshed = await refreshToken();
        if (!refreshed) {
            throw new Error('Not authenticated');
        }
        token = getAccessToken();
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    });

    // If 401, try refresh and retry once
    if (response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${getAccessToken()}`,
                },
                credentials: 'include',
            });
        }
    }

    return response;
}
