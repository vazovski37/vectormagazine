import { fetchApi } from './api';

// Types
export interface Article {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    cover_image: string | null;
    content: any;
    status: 'draft' | 'published' | 'archived';
    slug: string;
    created_at: string;
    published_at: string | null;
    updated_at: string;
    views_count: number;
    category_id: number | null;
    category?: {
        id: number;
        name: string;
    };
    tags?: string[];
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: string | null;
    author_id?: number;
}

export interface CreateArticleData {
    title: string;
    subtitle?: string | null;
    description?: string | null;
    cover_image?: string | null;
    content: any;
    category_id?: number | null;
    tags?: string[] | null;
    meta_title?: string | null;
    meta_description?: string | null;
    og_image?: string | null;
    author_id?: number;
    status?: 'draft' | 'published' | 'archived';
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
    status?: 'draft' | 'published' | 'archived';
}

export type StatusFilter = 'all' | 'draft' | 'published' | 'archived';

// API Functions
export async function getArticles(status?: StatusFilter): Promise<Article[]> {
    const endpoint = status && status !== 'all'
        ? `/api/articles?status=${status}`
        : '/api/articles';
    const response = await fetchApi<{ articles: Article[], pagination: any }>(endpoint);
    return response.articles;
}

export async function getArticleBySlug(slug: string): Promise<Article> {
    return fetchApi<Article>(`/api/articles/slug/${slug}`);
}

export async function getArticleById(id: number): Promise<Article> {
    return fetchApi<Article>(`/api/articles/${id}`);
}

export async function createArticle(data: CreateArticleData): Promise<Article> {
    return fetchApi<Article>('/api/articles', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateArticle(id: number, data: UpdateArticleData): Promise<Article> {
    return fetchApi<Article>(`/api/articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteArticle(id: number): Promise<void> {
    await fetchApi<void>(`/api/articles/${id}`, {
        method: 'DELETE',
    });
}

export async function updateArticleStatus(
    id: number,
    status: 'draft' | 'published' | 'archived'
): Promise<Article> {
    return updateArticle(id, { status });
}
