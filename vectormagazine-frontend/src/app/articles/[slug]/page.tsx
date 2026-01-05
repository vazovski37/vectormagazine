import { getArticleBySlug, getPublishedArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { formatRelativeDate } from '@/lib/types';
import type { Metadata } from 'next';

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
                        {article.content?.blocks?.map((block: any, index: number) => {
                            switch (block.type) {
                                case 'paragraph':
                                    return (
                                        <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
                                    );

                                case 'header':
                                    const level = block.data.level || 2;
                                    if (level === 1) return <h1 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                    if (level === 2) return <h2 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                    if (level === 3) return <h3 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                    if (level === 4) return <h4 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                    if (level === 5) return <h5 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
                                    return <h6 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

                                case 'image':
                                    return (
                                        <figure key={index} className="my-8">
                                            <img
                                                src={block.data.file?.url || block.data.url}
                                                alt={block.data.caption || ''}
                                                className="w-full rounded-lg"
                                            />
                                            {block.data.caption && (
                                                <figcaption className="text-center text-sm text-muted-foreground mt-2">
                                                    {block.data.caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    );

                                case 'list':
                                    const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                                    return (
                                        <ListTag key={index}>
                                            {block.data.items.map((item: string, i: number) => (
                                                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                            ))}
                                        </ListTag>
                                    );

                                case 'quote':
                                    return (
                                        <blockquote key={index}>
                                            <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                                            {block.data.caption && (
                                                <cite>— {block.data.caption}</cite>
                                            )}
                                        </blockquote>
                                    );

                                case 'code':
                                    return (
                                        <pre key={index} className="overflow-x-auto">
                                            <code>{block.data.code}</code>
                                        </pre>
                                    );

                                case 'raw':
                                    return (
                                        <div
                                            key={index}
                                            className="my-6"
                                            dangerouslySetInnerHTML={{ __html: block.data.html }}
                                        />
                                    );

                                case 'delimiter':
                                    return (
                                        <div key={index} className="my-12 flex justify-center">
                                            <span className="text-2xl text-muted-foreground">* * *</span>
                                        </div>
                                    );

                                case 'table':
                                    return (
                                        <div key={index} className="my-6 overflow-x-auto">
                                            <table className="w-full">
                                                <tbody>
                                                    {block.data.content.map((row: string[], rowIndex: number) => (
                                                        <tr key={rowIndex}>
                                                            {row.map((cell: string, cellIndex: number) => (
                                                                <td
                                                                    key={cellIndex}
                                                                    dangerouslySetInnerHTML={{ __html: cell }}
                                                                    className="border px-4 py-2"
                                                                />
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    );

                                default:
                                    return null;
                            }
                        })}
                    </article>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
