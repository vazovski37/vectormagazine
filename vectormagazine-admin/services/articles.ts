import { fetchApi } from './api';
import { API_ENDPOINTS } from './endpoints';

import { Article, CreateArticleData, UpdateArticleData, StatusFilter } from '@/types/article';

// API Functions
export async function getArticles(status?: StatusFilter): Promise<Article[]> {
    const endpoint = status && status !== 'all'
        ? `${API_ENDPOINTS.ARTICLES.BASE}?status=${status}`
        : API_ENDPOINTS.ARTICLES.BASE;
    const response = await fetchApi<{ articles: Article[], pagination: any }>(endpoint);
    return response.articles;
}

export async function getArticleBySlug(slug: string): Promise<Article> {
    return fetchApi<Article>(API_ENDPOINTS.ARTICLES.BY_SLUG(slug));
}

export async function getArticleById(id: number): Promise<Article> {
    return fetchApi<Article>(API_ENDPOINTS.ARTICLES.BY_ID(id));
}

export async function createArticle(data: CreateArticleData): Promise<Article> {
    return fetchApi<Article>(API_ENDPOINTS.ARTICLES.BASE, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateArticle(id: number, data: UpdateArticleData): Promise<Article> {
    return fetchApi<Article>(API_ENDPOINTS.ARTICLES.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteArticle(id: number): Promise<void> {
    await fetchApi<void>(API_ENDPOINTS.ARTICLES.BY_ID(id), {
        method: 'DELETE',
    });
}

export async function updateArticleStatus(
    id: number,
    status: 'draft' | 'published' | 'archived'
): Promise<Article> {
    return updateArticle(id, { status });
}
