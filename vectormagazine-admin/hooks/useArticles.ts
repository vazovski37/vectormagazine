'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Article,
    StatusFilter,
    getArticles,
    updateArticleStatus as updateStatus,
    deleteArticle as deleteArticleApi
} from '@/services/articles';

interface UseArticlesReturn {
    articles: Article[];
    isLoading: boolean;
    error: string | null;
    statusFilter: StatusFilter;
    selectedArticles: Set<number>;
    isUpdating: boolean;
    setStatusFilter: (status: StatusFilter) => void;
    fetchArticles: () => Promise<void>;
    updateArticleStatus: (articleId: number, newStatus: 'draft' | 'published' | 'archived') => Promise<void>;
    deleteArticle: (articleId: number) => Promise<void>;
    bulkUpdateStatus: (newStatus: 'draft' | 'published' | 'archived') => Promise<void>;
    toggleArticleSelection: (articleId: number) => void;
    toggleSelectAll: () => void;
    clearSelection: () => void;
    statusCounts: {
        all: number;
        draft: number;
        published: number;
        archived: number;
    };
}

export function useArticles(): UseArticlesReturn {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchArticlesData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getArticles(statusFilter);
            setArticles(data);
            setSelectedArticles(new Set()); // Clear selection on filter change
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load articles');
            console.error('Error fetching articles:', err);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchArticlesData();
    }, [fetchArticlesData]);

    const updateArticleStatus = useCallback(async (
        articleId: number,
        newStatus: 'draft' | 'published' | 'archived'
    ) => {
        try {
            setIsUpdating(true);
            await updateStatus(articleId, newStatus);
            await fetchArticlesData();
        } catch (err) {
            console.error('Error updating article status:', err);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [fetchArticlesData]);

    const deleteArticle = useCallback(async (articleId: number) => {
        try {
            setIsUpdating(true);
            await deleteArticleApi(articleId);
            await fetchArticlesData();
        } catch (err) {
            console.error('Error deleting article:', err);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [fetchArticlesData]);

    const bulkUpdateStatus = useCallback(async (newStatus: 'draft' | 'published' | 'archived') => {
        if (selectedArticles.size === 0) return;

        try {
            setIsUpdating(true);
            const promises = Array.from(selectedArticles).map(id => updateStatus(id, newStatus));
            await Promise.all(promises);
            await fetchArticlesData();
        } catch (err) {
            console.error('Error bulk updating articles:', err);
            throw err;
        } finally {
            setIsUpdating(false);
        }
    }, [selectedArticles, fetchArticlesData]);

    const toggleArticleSelection = useCallback((articleId: number) => {
        setSelectedArticles(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(articleId)) {
                newSelection.delete(articleId);
            } else {
                newSelection.add(articleId);
            }
            return newSelection;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        setSelectedArticles(prev => {
            if (prev.size === articles.length) {
                return new Set();
            }
            return new Set(articles.map(a => a.id));
        });
    }, [articles]);

    const clearSelection = useCallback(() => {
        setSelectedArticles(new Set());
    }, []);

    const statusCounts = {
        all: articles.length,
        draft: articles.filter(a => a.status === 'draft').length,
        published: articles.filter(a => a.status === 'published').length,
        archived: articles.filter(a => a.status === 'archived').length,
    };

    return {
        articles,
        isLoading,
        error,
        statusFilter,
        selectedArticles,
        isUpdating,
        setStatusFilter,
        fetchArticles: fetchArticlesData,
        updateArticleStatus,
        deleteArticle,
        bulkUpdateStatus,
        toggleArticleSelection,
        toggleSelectAll,
        clearSelection,
        statusCounts,
    };
}
