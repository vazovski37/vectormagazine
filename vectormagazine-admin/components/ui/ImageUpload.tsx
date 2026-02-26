'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Link, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { uploadMedia } from '@/services/upload';
import { UploadResponse } from '@/types/upload';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onClear?: () => void;
    placeholder?: string;
    previewHeight?: string;
    accept?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value = '',
    onChange,
    onClear,
    placeholder = 'Drop image here or click to upload',
    previewHeight = 'h-48',
    accept = 'image/*',
    disabled = false,
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInputValue, setUrlInputValue] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const result: UploadResponse = await uploadMedia(file);
            if (result.success === 1 && result.file?.url) {
                onChange(result.file.url);
                setShowUrlInput(false);
                setUrlInputValue('');
            } else {
                const errorMessage = typeof result.error === 'string'
                    ? result.error
                    : result.error?.message || 'Upload failed';
                setError(errorMessage);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled || isUploading) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    }, [disabled, isUploading, handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled && !isUploading) {
            setIsDragging(true);
        }
    }, [disabled, isUploading]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    }, [handleFile]);

    const handleUrlSubmit = useCallback(() => {
        if (urlInputValue.trim()) {
            onChange(urlInputValue.trim());
            setShowUrlInput(false);
            setUrlInputValue('');
            setError(null);
        }
    }, [urlInputValue, onChange]);

    const handleClear = useCallback(() => {
        onChange('');
        setError(null);
        if (onClear) {
            onClear();
        }
    }, [onChange, onClear]);

    // If we have a value, show the preview
    if (value) {
        return (
            <div className="space-y-3">
                <div className={`relative overflow-hidden rounded-lg border bg-muted ${previewHeight}`}>
                    <img
                        src={value}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                        }}
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                        onClick={handleClear}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate" title={value}>
                    {value}
                </p>
            </div>
        );
    }

    // Show URL input mode
    if (showUrlInput) {
        return (
            <div className="space-y-3">
                <div className="flex gap-2">
                    <Input
                        type="url"
                        value={urlInputValue}
                        onChange={(e) => setUrlInputValue(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleUrlSubmit();
                            }
                        }}
                        disabled={disabled}
                    />
                    <Button
                        type="button"
                        onClick={handleUrlSubmit}
                        disabled={!urlInputValue.trim() || disabled}
                    >
                        Add
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setShowUrlInput(false);
                            setUrlInputValue('');
                        }}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }

    // Show upload zone
    return (
        <div className="space-y-3">
            <div
                className={`
          relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer
          ${isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                    }
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={disabled || isUploading}
                />

                {isUploading ? (
                    <>
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        <p className="text-sm font-medium text-muted-foreground">Uploading...</p>
                    </>
                ) : (
                    <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                            <ImageIcon className="h-7 w-7 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium">{placeholder}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, GIF, WebP up to 10MB
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || isUploading}
                >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowUrlInput(true)}
                    disabled={disabled || isUploading}
                >
                    <Link className="h-4 w-4 mr-2" />
                    Paste URL
                </Button>
            </div>

            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
}
