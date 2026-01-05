// Base API configuration
// Use localhost to match the frontend origin (CORS requires same host naming)
export const API_BASE_URL = '';

// Generic API response type
export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

// Import auth functions for authenticated requests
import { getAccessToken, refreshToken } from './auth';

// Generic fetch wrapper with error handling and auth
export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const makeRequest = async (token: string | null) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options?.headers as Record<string, string>,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            mode: 'cors',
            credentials: 'include',
            ...options,
            headers,
        });
    };

    let token = getAccessToken();
    let response = await makeRequest(token);

    // If 401, try to refresh token and retry
    if (response.status === 401 && token) {
        const refreshed = await refreshToken();
        if (refreshed) {
            response = await makeRequest(getAccessToken());
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${response.statusText}`);
    }

    return response.json();
}

// Fetch wrapper for form data (file uploads) with auth
export async function fetchFormData<T>(
    endpoint: string,
    formData: FormData
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const makeRequest = async (token: string | null) => {
        const headers: Record<string, string> = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: formData,
        });
    };

    let token = getAccessToken();
    let response = await makeRequest(token);

    // If 401, try to refresh token and retry
    if (response.status === 401 && token) {
        const refreshed = await refreshToken();
        if (refreshed) {
            response = await makeRequest(getAccessToken());
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    return response.json();
}

