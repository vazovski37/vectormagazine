'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Category,
    CreateCategoryData,
    getCategories,
    createCategory as createCategoryApi,
    generateSlug
} from '@/services/categories';

interface UseCategoriesReturn {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    fetchCategories: () => Promise<void>;
    createCategory: (data: CreateCategoryData) => Promise<Category>;
}

export function useCategories(): UseCategoriesReturn {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load categories');
            console.error('Error fetching categories:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCategory = useCallback(async (data: CreateCategoryData): Promise<Category> => {
        const categoryData = {
            ...data,
            slug: data.slug || generateSlug(data.name),
        };

        const newCategory = await createCategoryApi(categoryData);
        await fetchCategories(); // Refresh the list
        return newCategory;
    }, [fetchCategories]);

    return {
        categories,
        isLoading,
        error,
        fetchCategories,
        createCategory,
    };
}

// Hook with form state for category creation
interface UseCategoryFormReturn extends UseCategoriesReturn {
    formData: {
        name: string;
        slug: string;
        description: string;
    };
    formError: string | null;
    isCreating: boolean;
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    handleNameChange: (name: string) => void;
    handleSlugChange: (slug: string) => void;
    handleDescriptionChange: (description: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    resetForm: () => void;
}

export function useCategoryForm(): UseCategoryFormReturn {
    const categoriesHook = useCategories();

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleNameChange = useCallback((name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }));
    }, []);

    const handleSlugChange = useCallback((slug: string) => {
        setFormData(prev => ({
            ...prev,
            slug: generateSlug(slug),
        }));
    }, []);

    const handleDescriptionChange = useCallback((description: string) => {
        setFormData(prev => ({
            ...prev,
            description,
        }));
    }, []);

    const resetForm = useCallback(() => {
        setFormData({ name: '', slug: '', description: '' });
        setFormError(null);
        setShowForm(false);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!formData.name.trim()) {
            setFormError('Category name is required');
            return;
        }

        setIsCreating(true);

        try {
            await categoriesHook.createCategory({
                name: formData.name.trim(),
                slug: formData.slug.trim() || generateSlug(formData.name),
                description: formData.description.trim() || null,
            });
            resetForm();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Failed to create category');
            console.error('Error creating category:', err);
        } finally {
            setIsCreating(false);
        }
    }, [formData, categoriesHook, resetForm]);

    return {
        ...categoriesHook,
        formData,
        formError,
        isCreating,
        showForm,
        setShowForm,
        handleNameChange,
        handleSlugChange,
        handleDescriptionChange,
        handleSubmit,
        resetForm,
    };
}
