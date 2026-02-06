// API service for fetching data from backend

import { Article, Category } from './types';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

// Cache durations (in seconds)
const CACHE_DURATION = {
    SHORT: 60,      // 1 minute for dynamic content
    MEDIUM: 300,    // 5 minutes for semi-static content
    LONG: 3600,     // 1 hour for static content
};

// Response type with pagination
interface PaginatedResponse<T> {
    articles: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        has_more: boolean;
    };
}

// Generic fetch wrapper with error handling and caching
async function fetchApi<T>(
    endpoint: string,
    options?: { revalidate?: number; cache?: RequestCache }
): Promise<T> {
    const { revalidate = CACHE_DURATION.SHORT, cache } = options || {};

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        next: cache ? undefined : { revalidate },
        cache: cache,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

// Article API functions
export async function getArticles(status?: string, limit?: number): Promise<Article[]> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (limit) params.append('limit', limit.toString());

    const query = params.toString() ? `?${params.toString()}` : '';

    // Handle both old array format and new paginated format
    const response = await fetchApi<PaginatedResponse<Article> | Article[]>(
        `/api/articles${query}`,
        { revalidate: CACHE_DURATION.SHORT }
    );

    // Check if it's the new paginated format
    if ('articles' in response && Array.isArray(response.articles)) {
        return response.articles;
    }

    // Old format (array directly)
    return response as Article[];
}

export async function getPublishedArticles(): Promise<Article[]> {
    return getArticles('published');
}

export async function getArticleBySlug(slug: string): Promise<Article> {
    return fetchApi<Article>(
        `/api/articles/slug/${slug}`,
        { revalidate: CACHE_DURATION.SHORT }
    );
}

export async function getArticleById(id: number): Promise<Article> {
    return fetchApi<Article>(
        `/api/articles/${id}`,
        { revalidate: CACHE_DURATION.SHORT }
    );
}

// Category API functions
export async function getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>(
        '/api/categories',
        { revalidate: CACHE_DURATION.MEDIUM }
    );
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
    return fetchApi<Category>(
        `/api/categories/slug/${slug}`,
        { revalidate: CACHE_DURATION.MEDIUM }
    );
}

// Get articles by category
export async function getArticlesByCategory(categoryId: number): Promise<Article[]> {
    const articles = await getPublishedArticles();
    return articles.filter(article => article.category_id === categoryId);
}

// Get featured/hero articles (first 3 published)
export async function getHeroArticles(): Promise<Article[]> {
    const articles = await getArticles('published', 3);
    return articles.slice(0, 3);
}

// Get latest articles (for hero bottom row)
export async function getLatestArticles(count: number = 4): Promise<Article[]> {
    const articles = await getArticles('published', count);
    return articles.slice(0, count);
}

// Get breaking news articles  
export async function getBreakingNews(count: number = 5): Promise<Article[]> {
    const articles = await getArticles('published', count);
    return articles.slice(0, count);
}

// Force fresh fetch (for admin panel)
export async function getArticlesFresh(status?: string): Promise<Article[]> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';

    const response = await fetchApi<PaginatedResponse<Article> | Article[]>(
        `/api/articles${query}`,
        { cache: 'no-store' }
    );

    if ('articles' in response && Array.isArray(response.articles)) {
        return response.articles;
    }

    return response as Article[];
}

// Newsletter API
export async function subscribeToNewsletter(email: string): Promise<{ id: number; email: string; is_active: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/subscribers/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Subscription failed: ${response.statusText}`);
    }

    return response.json();
}
