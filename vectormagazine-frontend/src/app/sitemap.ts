import { MetadataRoute } from 'next';
import { getArticles, getCategories } from '@/lib/api';

// Revalidate sitemap every hour
// export const revalidate = 3600; // Removed for On-Demand ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vectormagazine.com';

    // Static routes
    const routes = ['', '/about', '/contact', '/privacy', '/terms'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    try {
        // Fetch all published articles (limit 1000 for now)
        const articles = await getArticles('published', 1000);

        // Fetch all categories
        const categories = await getCategories();

        // Article routes
        const articleRoutes = articles.map((article) => ({
            url: `${baseUrl}/articles/${article.slug}`,
            lastModified: article.updated_at || article.published_at || article.created_at,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        // Category routes
        const categoryRoutes = categories.map((category) => ({
            url: `${baseUrl}/category/${category.slug}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        }));

        return [...routes, ...articleRoutes, ...categoryRoutes];
    } catch (error) {
        console.warn('Failed to fetch dynamic routes for sitemap (backend might be down during build):', error);
        // Return only static routes if API fails
        return routes;
    }
}
