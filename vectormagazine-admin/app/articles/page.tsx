'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import { FileText, Calendar, Image as ImageIcon, Eye, Plus, Edit2, Trash2, Archive, Send, CheckCircle2, Clock, ArchiveRestore } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useArticles } from '@/hooks/useArticles';

export default function ArticlesPage() {
  const {
    articles,
    isLoading,
    error,
    statusFilter,
    selectedArticles,
    isUpdating,
    setStatusFilter,
    fetchArticles,
    updateArticleStatus,
    deleteArticle,
    bulkUpdateStatus,
    toggleArticleSelection,
    toggleSelectAll,
    statusCounts,
  } = useArticles();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline',
    } as const;

    const icons = {
      draft: Clock,
      published: CheckCircle2,
      archived: Archive,
    };

    const labels = {
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived',
    };

    if (!status) return null;

    const normalizedStatus = status.toLowerCase();
    const Icon = icons[normalizedStatus as keyof typeof icons] || Clock;
    const variant = variants[normalizedStatus as keyof typeof variants] || 'secondary';

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {labels[normalizedStatus as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleDelete = async (articleId: number) => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }
    try {
      await deleteArticle(articleId);
    } catch {
      alert('Failed to delete article');
    }
  };

  const handleStatusUpdate = async (articleId: number, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      await updateArticleStatus(articleId, newStatus);
    } catch {
      alert('Failed to update article status');
    }
  };

  const handleBulkUpdate = async (newStatus: 'draft' | 'published' | 'archived') => {
    try {
      await bulkUpdateStatus(newStatus);
    } catch {
      alert('Failed to update articles');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Articles
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage and organize your articles
            </p>
          </div>
          <div className="flex items-center gap-3">
            {selectedArticles.size > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkUpdate('published')}
                  disabled={isUpdating}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Publish ({selectedArticles.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkUpdate('archived')}
                  disabled={isUpdating}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive ({selectedArticles.size})
                </Button>
              </div>
            )}
            <Link href="/editor">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create New Article</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 flex items-center gap-2 border-b">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${statusFilter === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${statusFilter === 'published'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Published ({statusCounts.published})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${statusFilter === 'draft'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Drafts ({statusCounts.draft})
          </button>
          <button
            onClick={() => setStatusFilter('archived')}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${statusFilter === 'archived'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
          >
            Archived ({statusCounts.archived})
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={fetchArticles} className="ml-4">
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading articles...</p>
            </div>
          </div>
        )}

        {/* Articles List */}
        {!isLoading && !error && (
          <>
            {articles.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No articles found</CardTitle>
                <CardDescription className="mt-2">
                  {statusFilter === 'all'
                    ? 'Get started by creating your first article'
                    : `No ${statusFilter} articles yet`}
                </CardDescription>
                {statusFilter === 'all' && (
                  <Link href="/editor">
                    <Button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Article
                    </Button>
                  </Link>
                )}
              </Card>
            ) : (
              <>
                {/* Bulk Actions Bar */}
                {selectedArticles.size > 0 && (
                  <div className="mb-4 flex items-center justify-between rounded-lg border bg-muted p-3">
                    <span className="text-sm font-medium">
                      {selectedArticles.size} article{selectedArticles.size > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSelectAll}
                      >
                        {selectedArticles.size === articles.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {articles.map((article) => (
                    <Card
                      key={article.id}
                      className={`transition-all hover:shadow-md ${selectedArticles.has(article.id) ? 'ring-2 ring-primary' : ''
                        }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedArticles.has(article.id)}
                            onChange={() => toggleArticleSelection(article.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />

                          {/* Cover Image */}
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                            {article.cover_image ? (
                              <img
                                src={article.cover_image}
                                alt={article.title}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Article Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  {getStatusBadge(article.status)}
                                  {article.category && (
                                    <Badge variant="outline">{article.category.name}</Badge>
                                  )}
                                </div>
                                <Link href={`/articles/${article.slug}`}>
                                  <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
                                    {article.title}
                                  </h3>
                                </Link>
                                {article.subtitle && (
                                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                                    {article.subtitle}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(article.created_at)}
                                  </span>
                                  {article.published_at && (
                                    <span>Published: {formatDate(article.published_at)}</span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {article.views_count} views
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {article.status === 'draft' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(article.id, 'published')}
                                    disabled={isUpdating}
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                )}
                                {article.status === 'published' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(article.id, 'archived')}
                                    disabled={isUpdating}
                                  >
                                    <Archive className="h-4 w-4" />
                                  </Button>
                                )}
                                {article.status === 'archived' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(article.id, 'published')}
                                    disabled={isUpdating}
                                  >
                                    <ArchiveRestore className="h-4 w-4" />
                                  </Button>
                                )}
                                <Link href={`/editor?edit=${article.slug || article.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(article.id)}
                                  disabled={isUpdating}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
