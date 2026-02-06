export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh',
        ME: '/api/auth/me',
        CHANGE_PASSWORD: '/api/auth/change-password',
    },
    ARTICLES: {
        BASE: '/api/articles',
        BY_SLUG: (slug: string) => `/api/articles/slug/${slug}`,
        BY_ID: (id: number) => `/api/articles/${id}`,
    },
    CATEGORIES: {
        BASE: '/api/categories',
        BY_ID: (id: number) => `/api/categories/${id}`,
    },
    UPLOAD: {
        BASE: '/api/upload',
    },
    LINK: {
        BASE: '/api/link', // For Editor.js link too
    }
} as const;
