import { fetchApi } from './api';
import { API_ENDPOINTS } from './endpoints';

// Types
import { Category, CreateCategoryData } from '@/types/category';

// API Functions
export async function getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>(API_ENDPOINTS.CATEGORIES.BASE);
}

export async function getCategoryById(id: number): Promise<Category> {
    return fetchApi<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
    return fetchApi<Category>(API_ENDPOINTS.CATEGORIES.BASE, {
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
