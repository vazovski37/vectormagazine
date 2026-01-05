'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import type { EditorRef } from '@/components/Editor';
import {
    Article,
    CreateArticleData,
    getArticleBySlug,
    createArticle,
    updateArticle
} from '@/services/articles';
import { Category, getCategories } from '@/services/categories';

interface UseEditorReturn {
    // Article data
    articleId: number | null;
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
    categoryId: number | null;
    tags: string;
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    status: 'draft' | 'published' | 'archived';
    authorId: number;

    // Categories
    categories: Category[];
    isLoadingCategories: boolean;

    // UI State
    isLoadingArticle: boolean;
    isPublishing: boolean;
    message: { type: 'success' | 'error'; text: string } | null;
    wordCount: number;
    isDirty: boolean;

    // Editor ref
    editorRef: React.RefObject<EditorRef | null>;

    // Setters
    setTitle: (value: string) => void;
    setSubtitle: (value: string) => void;
    setDescription: (value: string) => void;
    setCoverImage: (value: string) => void;
    setCategoryId: (value: number | null) => void;
    setTags: (value: string) => void;
    setMetaTitle: (value: string) => void;
    setMetaDescription: (value: string) => void;
    setOgImage: (value: string) => void;
    setStatus: (value: 'draft' | 'published' | 'archived') => void;
    setAuthorId: (value: number) => void;
    setMessage: (value: { type: 'success' | 'error'; text: string } | null) => void;

    // Actions
    loadArticle: (slug: string) => Promise<void>;
    handlePublish: () => Promise<void>;
    handleEditorChange: (data: OutputData) => void;
    handleEditorReady: () => void;
    resetForm: () => void;
}

export function useEditor(editSlug?: string | null): UseEditorReturn {
    // Article data
    const [articleId, setArticleId] = useState<number | null>(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [categoryId, setCategoryId] = useState<number | null>(null);
    const [tags, setTags] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [ogImage, setOgImage] = useState('');
    const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
    const [authorId, setAuthorId] = useState(1);

    // Categories
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // UI State
    const [isLoadingArticle, setIsLoadingArticle] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [wordCount, setWordCount] = useState(0);
    const [isDirty, setIsDirty] = useState(false);

    // Editor ref
    const editorRef = useRef<EditorRef | null>(null);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Mark form as dirty when changes are made
    useEffect(() => {
        if (title || subtitle || description || coverImage || tags || categoryId) {
            setIsDirty(true);
        }
    }, [title, subtitle, description, coverImage, tags, categoryId]);

    const resetForm = useCallback(() => {
        setTitle('');
        setSubtitle('');
        setDescription('');
        setCoverImage('');
        setCategoryId(null);
        setTags('');
        setMetaTitle('');
        setMetaDescription('');
        setOgImage('');
        setStatus('draft');
        setArticleId(null);
        setIsDirty(false);

        if (editorRef.current) {
            editorRef.current.clear();
        }
    }, []);

    const loadArticle = useCallback(async (slug: string) => {
        try {
            setIsLoadingArticle(true);
            setMessage(null);

            const article = await getArticleBySlug(slug);

            setArticleId(article.id);
            setTitle(article.title || '');
            setSubtitle(article.subtitle || '');
            setDescription(article.description || '');
            setCoverImage(article.cover_image || '');
            setCategoryId(article.category_id || null);
            setTags(article.tags ? article.tags.join(', ') : '');
            setMetaTitle(article.meta_title || '');
            setMetaDescription(article.meta_description || '');
            setOgImage(article.og_image || '');
            setAuthorId(article.author_id || 1);
            setStatus(article.status || 'draft');

            // Load content into editor
            if (article.content && editorRef.current) {
                await new Promise(resolve => setTimeout(resolve, 500));

                if (editorRef.current.isReady && editorRef.current.isReady()) {
                    await editorRef.current.load(article.content);
                } else {
                    let attempts = 0;
                    const maxAttempts = 25;
                    const loadInterval = setInterval(async () => {
                        attempts++;
                        if (editorRef.current?.isReady?.()) {
                            clearInterval(loadInterval);
                            try {
                                await editorRef.current.load(article.content);
                            } catch (err) {
                                console.error('Error loading content:', err);
                                setMessage({
                                    type: 'error',
                                    text: 'Content loaded but editor failed to render it. Please refresh the page.',
                                });
                            }
                        } else if (attempts >= maxAttempts) {
                            clearInterval(loadInterval);
                            setMessage({
                                type: 'error',
                                text: 'Editor took too long to initialize. Please refresh the page.',
                            });
                        }
                    }, 400);
                }
            }

            setIsDirty(false);
            setMessage({
                type: 'success',
                text: 'Article loaded successfully. You can now edit it.',
            });

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error loading article:', error);
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to load article for editing',
            });
        } finally {
            setIsLoadingArticle(false);
        }
    }, []);

    const handleEditorReady = useCallback(() => {
        console.log('Editor is ready');
        if (editSlug && !articleId) {
            setTimeout(() => loadArticle(editSlug), 200);
        }
    }, [editSlug, articleId, loadArticle]);

    const handleEditorChange = useCallback((data: OutputData) => {
        setIsDirty(true);
        if (data?.blocks) {
            let count = 0;
            data.blocks.forEach((block: any) => {
                if (block.type === 'paragraph' || block.type === 'header') {
                    const text = block.data?.text || '';
                    count += text.split(/\s+/).filter((w: string) => w.length > 0).length;
                }
            });
            setWordCount(count);
        }
    }, []);

    const handlePublish = useCallback(async () => {
        if (!title.trim()) {
            setMessage({ type: 'error', text: 'Title is required' });
            return;
        }

        setIsPublishing(true);
        setMessage(null);

        try {
            if (!editorRef.current) {
                throw new Error('Editor is not initialized');
            }

            const editorData = await editorRef.current.save();

            if (!editorData?.blocks?.length) {
                throw new Error('Please add some content to the article');
            }

            const tagsArray = tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);

            const articleData: CreateArticleData = {
                title: title.trim(),
                subtitle: subtitle.trim() || null,
                description: description.trim() || null,
                cover_image: coverImage.trim() || null,
                content: editorData,
                category_id: categoryId || null,
                tags: tagsArray.length > 0 ? tagsArray : null,
                meta_title: metaTitle.trim() || null,
                meta_description: metaDescription.trim() || null,
                og_image: ogImage.trim() || null,
                author_id: authorId,
                status: status,
            };

            let result: Article;
            if (articleId) {
                result = await updateArticle(articleId, articleData);
            } else {
                result = await createArticle(articleData);
            }

            setMessage({
                type: 'success',
                text: articleId ? 'Article updated successfully!' : 'Article published successfully!'
            });
            setIsDirty(false);

            if (result.id && !articleId) {
                setArticleId(result.id);
            }

            if (!articleId) {
                resetForm();
            }

            setTimeout(() => setMessage(null), 5000);
        } catch (error) {
            console.error('Error publishing article:', error);
            let errorMessage = 'Failed to publish article';

            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                errorMessage = 'Cannot connect to backend server. Please ensure the Flask backend is running.';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsPublishing(false);
        }
    }, [
        title, subtitle, description, coverImage, categoryId, tags,
        metaTitle, metaDescription, ogImage, authorId, status,
        articleId, resetForm
    ]);

    return {
        articleId,
        title,
        subtitle,
        description,
        coverImage,
        categoryId,
        tags,
        metaTitle,
        metaDescription,
        ogImage,
        status,
        authorId,
        categories,
        isLoadingCategories,
        isLoadingArticle,
        isPublishing,
        message,
        wordCount,
        isDirty,
        editorRef,
        setTitle,
        setSubtitle,
        setDescription,
        setCoverImage,
        setCategoryId,
        setTags,
        setMetaTitle,
        setMetaDescription,
        setOgImage,
        setStatus,
        setAuthorId,
        setMessage,
        loadArticle,
        handlePublish,
        handleEditorChange,
        handleEditorReady,
        resetForm,
    };
}
