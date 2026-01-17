// TypeScript interfaces for frontend data

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Article {
    id: number;
    title: string;
    slug: string;
    subtitle?: string;
    description?: string;
    cover_image?: string;
    content?: {
        blocks: ContentBlock[];
    };
    status: 'draft' | 'published' | 'archived';
    category_id?: number;
    category?: Category;
    author_id?: number;
    created_at: string;
    updated_at?: string;
    published_at?: string;
    meta_title?: string;
    meta_description?: string;
    og_image?: string;
    tags?: string[];
    read_time?: number;
    views_count?: number;
}

export interface ContentBlock {
    id?: string;
    type: string;
    data: Record<string, any>;
}

// Simplified post type for card components
export interface Post {
    id: number;
    title: string;
    category: string;
    imageSrc: string;
    date: string;
    slug: string;
}

// Helper to normalize image URLs from backend
function normalizeImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
        return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800';
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

    // Check if the URL contains /static/
    const staticIndex = imageUrl.indexOf('/static/');
    if (staticIndex !== -1) {
        // Strip everything before /static/ and prepend the correct backend URL
        const relativePath = imageUrl.substring(staticIndex);
        return `${backendUrl}${relativePath}`;
    }

    // If it's already a full URL (and doesn't contain /static/ which we handled above), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it's any other relative path, prepend backend URL
    return `${backendUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
}

// Transform Article to Post format for cards
export function articleToPost(article: Article): Post {
    return {
        id: article.id,
        title: article.title,
        category: article.category?.name || 'Uncategorized',
        imageSrc: normalizeImageUrl(article.cover_image),
        date: formatRelativeDate(article.created_at),
        slug: article.slug,
    };
}

// Format date to relative time (e.g., "2 days ago")
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
