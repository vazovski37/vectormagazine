import { supabase } from '@/lib/supabase';
import { Category, CreateCategoryData } from '@/types/category';

// API Functions
export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
        console.error('Error fetching categories:', error);
        throw new Error('Failed to fetch categories');
    }
    return data as Category[];
}

export async function getCategoryById(id: number): Promise<Category> {
    const { data, error } = await supabase.from('categories').select('*').eq('id', id).single();
    if (error) throw new Error('Failed to fetch category');
    return data as Category;
}

export async function createCategory(data: CreateCategoryData): Promise<Category> {
    const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([{ ...data, slug: generateSlug(data.name) }])
        .select()
        .single();

    if (error) {
        throw new Error(error.message || 'Failed to create category');
    }
    return newCategory as Category;
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
