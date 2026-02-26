import { supabase } from '@/lib/supabase';
import { Article, CreateArticleData, UpdateArticleData, StatusFilter } from '@/types/article';

// Helper for generating slugs
function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// API Functions
export async function getArticles(status?: StatusFilter): Promise<Article[]> {
    let query = supabase.from('articles').select('*, author:users(email), category:categories(name)').order('created_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status.toUpperCase());
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles');
    }

    return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article> {
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) throw new Error('Failed to fetch article');
    return data as Article;
}

export async function getArticleById(id: number): Promise<Article> {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (error) throw new Error('Failed to fetch article');
    return data as Article;
}

export async function createArticle(data: CreateArticleData): Promise<Article> {
    const { data: userData } = await supabase.auth.getUser();

    const articleData = {
        ...data,
        status: data.status?.toUpperCase() || 'DRAFT',
        slug: data.slug || slugify(data.title),
        author_id: userData?.user?.id
    };

    const { data: newArticle, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

    if (error) {
        console.error('Error creating article:', error);
        throw new Error(error.message || 'Failed to create article');
    }

    return newArticle as Article;
}

export async function updateArticle(id: number, data: UpdateArticleData): Promise<Article> {
    const articleData = {
        ...data,
        ...(data.status && { status: data.status.toUpperCase() }),
        updated_at: new Date().toISOString()
    };

    const { data: updatedArticle, error } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating article:', error);
        throw new Error(error.message || 'Failed to update article');
    }

    return updatedArticle as Article;
}

export async function deleteArticle(id: number): Promise<void> {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw new Error('Failed to delete article');
}

export async function updateArticleStatus(
    id: number,
    status: 'draft' | 'published' | 'archived'
): Promise<Article> {
    return updateArticle(id, { status: status.toUpperCase() as any });
}
