import { getArticleBySlug, getPublishedArticles } from '@/lib/api';
import { ArticleBlockRenderer } from '@/components/ArticleBlockRenderer';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { formatRelativeDate } from '@/lib/types';
import type { Metadata } from 'next';
import { ArticleTracker } from '@/components/ArticleTracker';

interface Props {
    params: Promise<{ slug: string }>;
}

// Enable ISR - revalidate every 60 seconds by default
// Can be overridden by on-demand revalidation from Flask
export const revalidate = 60;

// Allow new articles to be generated on-demand without rebuild
export const dynamicParams = true;

// Pre-render all published articles at build time
export async function generateStaticParams() {
    try {
        const articles = await getPublishedArticles();
        return articles.map((article) => ({
            slug: article.slug,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Generate SEO metadata for each article
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const article = await getArticleBySlug(slug);

        return {
            title: article.meta_title || article.title,
            description: article.meta_description || article.description || article.subtitle,
            openGraph: {
                title: article.meta_title || article.title,
                description: article.meta_description || article.description || article.subtitle,
                images: article.og_image || article.cover_image ? [article.og_image || article.cover_image!] : [],
                type: 'article',
                publishedTime: article.published_at || undefined,
                authors: ['Vector Magazine'],
            },
            twitter: {
                card: 'summary_large_image',
                title: article.meta_title || article.title,
                description: article.meta_description || article.description || article.subtitle,
                images: article.og_image || article.cover_image ? [article.og_image || article.cover_image!] : [],
            },
        };
    } catch {
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
        };
    }
}



export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    console.log(`Loading article page for slug: ${slug}`);

    let article;
    try {
        article = await getArticleBySlug(slug);
    } catch (error) {
        notFound();
    }

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen w-full custom-scrollbar font-inter">
            <ArticleTracker articleId={article.id} slug={article.slug} />
            <Header />

            <main className="py-12">
                <Container>
                    {/* Cover Image */}
                    {article.cover_image && (
                        <div className="mb-8 overflow-hidden rounded-2xl">
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-64 md:h-96 object-cover"
                            />
                        </div>
                    )}

                    {/* Article Header */}
                    <header className="mb-12">
                        {article.category && (
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                                {article.category.name}
                            </span>
                        )}

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {article.title}
                        </h1>

                        {article.description && (
                            <p className="text-xl text-muted-foreground mb-6">
                                {article.description}
                            </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <time>{formatRelativeDate(article.created_at)}</time>
                        </div>
                    </header>

                    {/* Article Content */}
                    <article className="prose prose-lg dark:prose-invert max-w-none">
                        {article.content?.blocks?.map((block: any, index: number) => (
                            <ArticleBlockRenderer key={block.id || index} block={block} />
                        ))}
                    </article>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
