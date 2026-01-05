'use client';

import Header from '@/components/Header';
import { BookOpen, Plus, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCategoryForm } from '@/hooks/useCategories';

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
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
  } = useCategoryForm();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Categories
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Organize your articles with categories
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create Category</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        {/* Create Category Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
              <CardDescription>
                Add a new category to organize your articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">
                    Category Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="categoryName"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Technology, Business, Design"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categorySlug">Slug (URL-friendly)</Label>
                  <Input
                    id="categorySlug"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="Auto-generated from name"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in URLs. Auto-generated from name if left empty.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryDescription">Description (Optional)</Label>
                  <Textarea
                    id="categoryDescription"
                    value={formData.description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder="A brief description of this category..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Create Category</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchCategories}
                className="ml-4"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-sm text-gray-600">Loading categories...</p>
            </div>
          </div>
        )}

        {/* Categories List */}
        {!isLoading && !error && (
          <>
            {categories.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <CardTitle className="mt-4">No categories yet</CardTitle>
                <CardDescription className="mt-2">
                  Get started by creating your first category
                </CardDescription>
                <Button
                  onClick={() => setShowForm(true)}
                  className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Category
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="group transition-all duration-200 hover:shadow-lg hover:border-primary/50"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                      </div>
                      {category.description && (
                        <CardDescription className="line-clamp-2">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-mono">/{category.slug}</span>
                        <span>•</span>
                        <span>{formatDate(category.created_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
