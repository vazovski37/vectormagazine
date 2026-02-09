'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import {
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Save,
  Tag,
  Globe,
  ChevronDown,
  ChevronUp,
  Settings2,
  Eye,
  FileText,
  Sparkles,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { ArticleStats } from '@/components/ArticleStats';
import type { EditorRef } from '@/components/Editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useEditor } from '@/hooks/useEditor';

// Dynamically import Editor component with SSR disabled
const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  ),
});

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 px-1 text-sm font-medium hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const editSlug = searchParams?.get('edit') || searchParams?.get('slug');
  const [showTips, setShowTips] = useState(false);

  const {
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
    handlePublish,
    handleEditorChange,
    handleEditorReady,
  } = useEditor(editSlug);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Title & Status */}
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
              >
                <Sparkles className="h-5 w-5 text-violet-600" />
                Vector
              </a>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span>/</span>
                <span>{articleId ? 'Edit Article' : 'New Article'}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Status indicator */}
              {isDirty && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  Unsaved
                </div>
              )}

              {/* Word count */}
              <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="h-3.5 w-3.5" />
                {wordCount} words
              </div>

              {/* Status Select */}
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as 'draft' | 'published' | 'archived')}
              >
                <SelectTrigger className="w-[110px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                      Draft
                    </span>
                  </SelectItem>
                  <SelectItem value="published">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Published
                    </span>
                  </SelectItem>
                  <SelectItem value="archived">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                      Archived
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Publish Button */}
              <Button
                onClick={handlePublish}
                disabled={isPublishing || !title.trim()}
                className="h-9 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
              >
                {isPublishing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Publish</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className="mx-auto max-w-4xl px-4 pt-4">
          <Alert
            variant={message.type === 'error' ? 'destructive' : 'default'}
            className={message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : ''}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription className="text-sm font-medium">{message.text}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Main Content Area - Writing Focus */}
          <div className="flex-1 min-w-0">
            {/* Cover Image - Full width, visual */}
            <div className="mb-8">
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                placeholder="Add a cover image"
                previewHeight="h-64"
              />
            </div>

            {/* Title - Large, prominent */}
            <div className="mb-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title..."
                className="w-full text-4xl md:text-5xl font-bold tracking-tight bg-transparent border-0 outline-none placeholder:text-slate-300 focus:ring-0"
                autoComplete="off"
              />
            </div>

            {/* Subtitle */}
            <div className="mb-8">
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Add a subtitle or excerpt..."
                className="w-full text-xl text-muted-foreground bg-transparent border-0 outline-none placeholder:text-slate-300 focus:ring-0"
                autoComplete="off"
              />
            </div>

            {/* Editor Area */}
            <div className="relative">
              {/* Tips Toggle */}
              <div className="absolute -top-8 right-0">
                <button
                  type="button"
                  onClick={() => setShowTips(!showTips)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  Tips
                </button>
              </div>

              {/* Tips Panel */}
              {showTips && (
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100">
                  <p className="text-sm font-medium text-violet-900 mb-2">Quick Tips</p>
                  <ul className="text-xs text-violet-700 space-y-1">
                    <li>• Press <kbd className="px-1.5 py-0.5 bg-white rounded text-violet-900 font-mono">/</kbd> for quick block insertion</li>
                    <li>• Drag blocks using the handle on the left</li>
                    <li>• Select text for formatting options</li>
                  </ul>
                </div>
              )}

              {/* Editor Container */}
              <div className="min-h-[500px] rounded-2xl bg-white border border-slate-200/60 shadow-sm p-8 relative">
                {isLoadingArticle && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20 rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
                      <p className="text-sm text-muted-foreground">Loading article...</p>
                    </div>
                  </div>
                )}
                <Editor
                  key={`editor-instance-${articleId || 'new'}`}
                  ref={editorRef}
                  data={undefined}
                  holder="editorjs-container"
                  onChange={handleEditorChange}
                  onReady={handleEditorReady}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Settings Panel */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="rounded-2xl bg-white border border-slate-200/60 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Article Settings</span>
                </div>

                {/* Category & Tags */}
                <CollapsibleSection title="Category & Tags" icon={Tag} defaultOpen={true}>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Category</Label>
                      <Select
                        value={categoryId?.toString() || ''}
                        onValueChange={(value) => setCategoryId(value ? parseInt(value) : null)}
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Tags</Label>
                      <Input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="tag1, tag2, tag3"
                        className="h-9"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* SEO */}
                <CollapsibleSection title="SEO & Social" icon={Globe} defaultOpen={false}>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Description</Label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description for SEO..."
                        rows={3}
                        className="text-sm resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{description.length}/160</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Meta Title</Label>
                      <Input
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="Leave empty to use title"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Meta Description</Label>
                      <Textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Leave empty to use description"
                        rows={2}
                        className="text-sm resize-none"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">OG Image</Label>
                      <ImageUpload
                        value={ogImage}
                        onChange={setOgImage}
                        placeholder="Social media image"
                        previewHeight="h-24"
                      />
                    </div>
                  </div>
                </CollapsibleSection>

                {/* Advanced */}
                <CollapsibleSection title="Advanced" icon={Settings2} defaultOpen={false}>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Author ID</Label>
                    <Input
                      type="number"
                      value={authorId}
                      onChange={(e) => setAuthorId(parseInt(e.target.value) || 1)}
                      min="1"
                      className="h-9"
                    />
                  </div>
                </CollapsibleSection>

                {/* Analytics */}
                <CollapsibleSection title="Analytics" icon={TrendingUp} defaultOpen={true}>
                  <ArticleStats articleId={articleId} />
                </CollapsibleSection>

                {/* Stats */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <p className="text-2xl font-bold text-slate-900">{wordCount}</p>
                      <p className="text-xs text-muted-foreground">Words</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <p className="text-2xl font-bold text-slate-900">{Math.max(1, Math.ceil(wordCount / 200))}</p>
                      <p className="text-xs text-muted-foreground">Min read</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <p className="text-sm text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}
