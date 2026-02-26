// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Generic API response type
export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

// Note: The rest of this file is maintained for any legacy fetch endpoints
// but we'll remove the auth injection since Supabase replaces it.
export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options?.headers as Record<string, string>,
    };

    let response = await fetch(url, {
        mode: 'cors',
        credentials: 'include',
        ...options,
        headers,
    });

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

    const headers: Record<string, string> = {};

    let response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) => fetchApi<T>(endpoint, { method: 'GET', ...options }),
    post: <T>(endpoint: string, data: any, options?: RequestInit) => fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
    put: <T>(endpoint: string, data: any, options?: RequestInit) => fetchApi<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
    delete: <T>(endpoint: string, options?: RequestInit) => fetchApi<T>(endpoint, { method: 'DELETE', ...options }),
};
