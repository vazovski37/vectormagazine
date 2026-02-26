// API service for fetching data from Supabase

import { Article, Category } from './types';
import { supabase } from './supabase';

const CACHE_DURATION = {
    SHORT: 60,      // 1 minute
    MEDIUM: 300,    // 5 minutes
    LONG: 3600,     // 1 hour
};

// Article API functions
export async function getArticles(status?: string, limit?: number): Promise<Article[]> {
    let query = supabase.from('articles').select('*').order('created_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status.toUpperCase());
    }
    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
    return data as Article[];
}

export async function getPublishedArticles(): Promise<Article[]> {
    return getArticles('PUBLISHED');
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching article by slug ${slug}:`, error);
        return null;
    }
    return data as Article;
}

export async function getArticleById(id: number): Promise<Article | null> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching article by id ${id}:`, error);
        return null;
    }
    return data as Article;
}

// Category API functions
export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching category by slug ${slug}:`, error);
        return null;
    }
    return data as Category;
}

// Get articles by category
export async function getArticlesByCategory(categoryId: number): Promise<Article[]> {
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'PUBLISHED')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(`Error fetching articles for category ${categoryId}:`, error);
        return [];
    }
    return data as Article[];
}

// Get featured/hero articles (first 3 published)
export async function getHeroArticles(): Promise<Article[]> {
    return getArticles('PUBLISHED', 3);
}

// Get latest articles (for hero bottom row)
export async function getLatestArticles(count: number = 4): Promise<Article[]> {
    return getArticles('PUBLISHED', count);
}

// Get breaking news articles  
export async function getBreakingNews(count: number = 5): Promise<Article[]> {
    return getArticles('PUBLISHED', count);
}

// Force fresh fetch (for admin panel)
export async function getArticlesFresh(status?: string): Promise<Article[]> {
    return getArticles(status); // Since Supabase is real-time via the JS client, we don't strictly need cache busting here like we did with fetch.
}

// Newsletter API
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from('subscribers').insert([{ email, is_active: true }]);

    if (error) {
        // Handle unique constraint violations gracefully
        if (error.code === '23505') {
            return { success: false, error: 'Email is already subscribed' };
        }
        console.error('Newsletter error:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
