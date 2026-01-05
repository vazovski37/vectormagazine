'use client';

import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import { editorImageUploader } from '@/services/upload';
import { API_BASE_URL } from '@/services/api';


interface EditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  holder: string;
  onReady?: () => void;
}

export interface EditorRef {
  save: () => Promise<OutputData>;
  clear: () => void;
  load: (data: OutputData) => Promise<void>;
  isReady: () => boolean;
}

const Editor = forwardRef<EditorRef, EditorProps>(({ data, onChange, holder, onReady }, ref) => {
  const editorRef = useRef<any>(null); // EditorJS instance
  const isInitialized = useRef(false);
  const isReadyRef = useRef(false);
  const pendingDataRef = useRef<OutputData | null>(null);
  const [holderId] = useState(() => `${holder}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize editor with data
  const initializeEditor = useCallback(async (initialData?: OutputData) => {
    if (typeof window === 'undefined' || isInitialized.current) {
      return;
    }

    const holderElement = document.getElementById(holderId);
    if (!holderElement) {
      console.error(`Editor holder element with id "${holderId}" not found`);
      setError('Editor container not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Dynamically import Editor.js and tools only on client side
      const [
        { default: EditorJS },
        { default: Header },
        { default: Paragraph },
        { default: ImageTool },
        { default: List },
        { default: Quote },
        { default: CodeTool },
        { default: LinkTool },
        { default: Marker },
        { default: InlineCode },
        { default: Delimiter },
        { default: Table },
        { default: SimpleVideo },
        { default: RawTool },
      ] = await Promise.all([
        import('@editorjs/editorjs'),
        import('@editorjs/header'),
        import('@editorjs/paragraph'),
        import('@editorjs/image'),
        import('@editorjs/list'),
        import('@editorjs/quote'),
        import('@editorjs/code'),
        import('@editorjs/link'),
        import('@editorjs/marker'),
        import('@editorjs/inline-code'),
        import('@editorjs/delimiter'),
        import('@editorjs/table'),
        import('simple-video-editorjs'),
        import('@editorjs/raw'),
      ]);

      const editor = new EditorJS({
        holder: holderId,
        data: initialData || undefined,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: 'Start writing your article...',
            },
          },
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
            shortcut: 'CMD+SHIFT+H',
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote author',
            },
          },
          code: {
            class: CodeTool,
            config: {
              placeholder: 'Enter code',
            },
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: `${API_BASE_URL}/api/link`,
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: `${API_BASE_URL}/api/upload`,
              },
              field: 'image',
              types: 'image/*',
              captionPlaceholder: 'Add a caption (optional)',
              buttonContent: 'Click to upload an image',
              uploader: {
                uploadByFile: async (file: File) => {
                  return editorImageUploader(file);
                },
              },
            },
          },
          marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C',
          },
          delimiter: Delimiter,
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 2,
            },
          },
          video: {
            class: SimpleVideo,
            config: {
              placeholder: 'Paste a YouTube or Vimeo URL here...',
            }
          },
          raw: {
            class: RawTool,
            config: {
              placeholder: 'Paste HTML code here (e.g., YouTube iframe embed code)...',
            }
          },
        },
        placeholder: 'Start writing your article...',
        onChange: async () => {
          if (onChange && editorRef.current && isReadyRef.current) {
            try {
              const outputData = await editorRef.current.save();
              requestAnimationFrame(() => {
                onChange(outputData);
              });
            } catch (error) {
              console.error('Error saving editor content:', error);
            }
          }
        },
        autofocus: false,
        readOnly: false,
        minHeight: 400,
        // Enable drag and drop (default in Editor.js 2.x, but explicitly set)
        // Blocks can be dragged by clicking and holding on the left side
      });

      // Wait for editor to be ready
      await editor.isReady;

      editorRef.current = editor;
      isInitialized.current = true;
      isReadyRef.current = true;
      setIsLoading(false);

      // Load pending data if any
      if (pendingDataRef.current) {
        try {
          await editor.render(pendingDataRef.current);
          pendingDataRef.current = null;
        } catch (err) {
          console.error('Error loading pending data:', err);
        }
      }

      // Call onReady callback
      if (onReady) {
        onReady();
      }

      console.log('Editor.js initialized successfully');
    } catch (error) {
      console.error('Error creating Editor.js instance:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize editor');
      setIsLoading(false);
    }
  }, [holderId, onChange, onReady]);

  // Initialize editor on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initializeEditor(data);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []); // Only run once on mount

  // Handle data prop changes - only if editor is ready and data is different
  useEffect(() => {
    if (data && isReadyRef.current && editorRef.current) {
      // Editor is ready, load the data
      editorRef.current.render(data).catch((err: any) => {
        console.error('Error rendering data:', err);
      });
    } else if (data && !isReadyRef.current) {
      // Editor not ready yet, store for later
      pendingDataRef.current = data;
    }
  }, [data]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!editorRef.current || !isReadyRef.current) {
        throw new Error('Editor is not initialized or ready');
      }
      return await editorRef.current.save();
    },
    clear: () => {
      if (editorRef.current && isReadyRef.current) {
        editorRef.current.clear();
      }
    },
    load: async (newData: OutputData) => {
      if (!editorRef.current || !isReadyRef.current) {
        // Store for when editor is ready
        pendingDataRef.current = newData;
        // Wait for editor to be ready
        let attempts = 0;
        const maxAttempts = 40;
        return new Promise((resolve, reject) => {
          const checkReady = setInterval(() => {
            attempts++;
            if (isReadyRef.current && editorRef.current) {
              clearInterval(checkReady);
              // Clear first, then render
              editorRef.current.clear()
                .then(() => editorRef.current.render(newData))
                .then(() => {
                  pendingDataRef.current = null;
                  resolve();
                })
                .catch(reject);
            } else if (attempts >= maxAttempts) {
              clearInterval(checkReady);
              reject(new Error('Editor not ready after timeout'));
            }
          }, 250);
        });
      }

      // Editor is ready, load immediately
      try {
        // Clear existing content first
        if (editorRef.current.clear) {
          await editorRef.current.clear();
        }
        // Small delay to ensure clear is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        // Render new data
        await editorRef.current.render(newData);
        console.log('Content loaded into editor successfully');
      } catch (err) {
        console.error('Error loading data into editor:', err);
        throw err;
      }
    },
    isReady: () => isReadyRef.current,
  }), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy();
        } catch (err) {
          console.error('Error destroying editor:', err);
        }
        editorRef.current = null;
        isInitialized.current = false;
        isReadyRef.current = false;
      }
    };
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/10 backdrop-blur-sm z-10 rounded-lg">
          <div className="flex flex-col items-center gap-3 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                isInitialized.current = false;
                isReadyRef.current = false;
                initializeEditor(data);
              }}
              className="text-xs text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <div
        id={holderId}
        className="prose max-w-none min-h-[500px] w-full"
        style={{
          paddingLeft: '50px', // Space for toolbar
          position: 'relative'
        }}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

export default Editor;
