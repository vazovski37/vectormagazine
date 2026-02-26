export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    cover_image: string | null;
    content: any;
    status: ArticleStatus;
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
    slug?: string;
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
    status?: ArticleStatus;
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
    status?: ArticleStatus;
}

export type StatusFilter = 'all' | ArticleStatus;
