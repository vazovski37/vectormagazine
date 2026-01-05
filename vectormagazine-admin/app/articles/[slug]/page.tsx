'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  description: string | null;
  cover_image: string | null;
  content: any;
  created_at: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const articleSlug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleSlug) {
      fetchArticle();
    }
  }, [articleSlug]);

  const fetchArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://127.0.0.1:5000/api/articles/slug/${articleSlug}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load article');
      console.error('Error fetching article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive bg-destructive/10 p-8 text-center">
            <h2 className="text-xl font-bold text-destructive">Error</h2>
            <p className="mt-2 text-sm text-destructive/80">{error || 'Article not found'}</p>
            <Link
              href="/articles"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/articles"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>

        {/* Cover Image */}
        {article.cover_image && (
          <div className="mb-8 overflow-hidden rounded-xl border shadow-sm">
            <img
              src={article.cover_image}
              alt={article.title}
              className="h-64 w-full object-cover sm:h-96"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage Not Found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mb-8 rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {article.title}
          </h1>

          {article.description && (
            <p className="mb-4 text-lg text-muted-foreground">
              {article.description}
            </p>
          )}

          <div className="flex items-center gap-4 border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        {article.content && article.content.blocks && article.content.blocks.length > 0 ? (
          <div className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm">
            <div className="prose prose-lg max-w-none">
              {article.content.blocks.map((block: any, index: number) => {
                // Simple renderer for Editor.js blocks
                if (block.type === 'paragraph') {
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {block.data.text}
                    </p>
                  );
                }
                if (block.type === 'header') {
                  const HeadingTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
                  return (
                    <HeadingTag key={index} className="mb-4 mt-8 font-bold first:mt-0">
                      {block.data.text}
                    </HeadingTag>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <div key={index} className="my-8">
                      <img
                        src={block.data.file?.url || block.data.url}
                        alt={block.data.caption || 'Article image'}
                        className="w-full rounded-lg"
                      />
                      {block.data.caption && (
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          {block.data.caption}
                        </p>
                      )}
                    </div>
                  );
                }
                if (block.type === 'list') {
                  const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
                  return (
                    <ListTag key={index} className="mb-4 ml-6 list-disc">
                      {block.data.items.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="mb-2">
                          {item}
                        </li>
                      ))}
                    </ListTag>
                  );
                }
                if (block.type === 'quote') {
                  return (
                    <blockquote key={index} className="my-6 border-l-4 border-primary pl-4 italic">
                      <p>{block.data.text}</p>
                      {block.data.caption && (
                        <cite className="mt-2 block text-sm text-muted-foreground">
                          — {block.data.caption}
                        </cite>
                      )}
                    </blockquote>
                  );
                }
                if (block.type === 'code') {
                  return (
                    <pre key={index} className="my-4 overflow-x-auto rounded-lg bg-muted p-4">
                      <code className="text-sm">{block.data.code}</code>
                    </pre>
                  );
                }
                if (block.type === 'raw') {
                  // Raw HTML block - render as actual HTML
                  return (
                    <div
                      key={index}
                      className="my-6"
                      dangerouslySetInnerHTML={{ __html: block.data.html }}
                    />
                  );
                }
                if (block.type === 'video') {
                  // Video block (from simple-video-editorjs)
                  return (
                    <div key={index} className="my-8">
                      <video
                        src={block.data.url}
                        controls={block.data.controls !== false}
                        autoPlay={block.data.autoplay === true}
                        muted={block.data.muted === true}
                        className="w-full rounded-lg"
                      />
                      {block.data.caption && (
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          {block.data.caption}
                        </p>
                      )}
                    </div>
                  );
                }
                if (block.type === 'embed') {
                  // Embed block for YouTube, Vimeo, etc.
                  return (
                    <div key={index} className="my-8 aspect-video">
                      <iframe
                        src={block.data.embed}
                        className="w-full h-full rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      {block.data.caption && (
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          {block.data.caption}
                        </p>
                      )}
                    </div>
                  );
                }
                if (block.type === 'delimiter') {
                  return (
                    <div key={index} className="my-8 flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground">* * *</span>
                    </div>
                  );
                }
                if (block.type === 'table') {
                  return (
                    <div key={index} className="my-6 overflow-x-auto">
                      <table className="w-full border-collapse border border-muted">
                        <tbody>
                          {block.data.content.map((row: string[], rowIndex: number) => (
                            <tr key={rowIndex} className={rowIndex === 0 && block.data.withHeadings ? 'bg-muted font-bold' : ''}>
                              {row.map((cell: string, cellIndex: number) => {
                                const CellTag = (rowIndex === 0 && block.data.withHeadings) ? 'th' : 'td';
                                return (
                                  <CellTag
                                    key={cellIndex}
                                    className="border border-muted px-4 py-2"
                                    dangerouslySetInnerHTML={{ __html: cell }}
                                  />
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">No content available for this article.</p>
          </div>
        )}
      </div>
    </div>
  );
}



