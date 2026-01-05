import { fetchApi } from './api';

// Types
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
}

export interface CreateCategoryData {
    name: string;
    slug?: string;
    description?: string | null;
}

// API Functions
export async function getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/api/categories');
}

export async function getCategoryById(id: number): Promise<Category> {
    return fetchApi<Category>(`/api/categories/${id}`);
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
    return fetchApi<Category>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Utility function for generating slugs
export function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[-\s]+/g, '-')
        .trim()
        .replace(/^-+|-+$/g, '');
}
