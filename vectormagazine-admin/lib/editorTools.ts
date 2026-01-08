import { API_BASE_URL } from '@/services/api';
import { editorImageUploader } from '@/services/upload';
import { safeImport } from '@/lib/editorUtils';

export const loadEditorTools = async () => {
    const [
        EditorJSModule,
        HeaderModule,
        ParagraphModule,
        ImageToolModule,
        ListModule,
        QuoteModule,
        CodeToolModule,
        LinkToolModule,
        MarkerModule,
        InlineCodeModule,
        DelimiterModule,
        TableModule,
        SimpleVideoModule,
        RawToolModule,
        ColorPluginModule,
        FontSizeModule,
        AlignmentTuneModule,
        SpacerModule,
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
        import('editorjs-text-color-plugin'),
        // @ts-ignore
        import('editorjs-font-size').catch(err => {
            console.error('Failed to load editorjs-font-size:', err);
            return null;
        }),
        // @ts-ignore
        import('editorjs-text-alignment-blocktune').catch(err => {
            console.error('Failed to load editorjs-text-alignment-blocktune:', err);
            return null;
        }),
        import('@/components/editor-tools/Spacer'),
    ]);

    const EditorJS = safeImport(EditorJSModule, 'EditorJS');
    const Header = safeImport(HeaderModule, 'Header');
    const Paragraph = safeImport(ParagraphModule, 'Paragraph');
    const ImageTool = safeImport(ImageToolModule, 'ImageTool');
    const List = safeImport(ListModule, 'List');
    const Quote = safeImport(QuoteModule, 'Quote');
    const CodeTool = safeImport(CodeToolModule, 'CodeTool');
    const LinkTool = safeImport(LinkToolModule, 'LinkTool');
    const Marker = safeImport(MarkerModule, 'Marker');
    const InlineCode = safeImport(InlineCodeModule, 'InlineCode');
    const Delimiter = safeImport(DelimiterModule, 'Delimiter');
    const Table = safeImport(TableModule, 'Table');
    const SimpleVideo = safeImport(SimpleVideoModule, 'SimpleVideo');
    const RawTool = safeImport(RawToolModule, 'RawTool');
    const ColorPlugin = safeImport(ColorPluginModule, 'ColorPlugin');
    const AlignmentTune = safeImport(AlignmentTuneModule, 'AlignmentTune');
    const Spacer = safeImport(SpacerModule, 'Spacer');

    // Special handling for FontSize which uses a named export
    // @ts-ignore
    let FontSize = safeImport(FontSizeModule, 'FontSize');
    if (FontSize && typeof FontSize === 'object' && FontSize.FontSize) {
        FontSize = FontSize.FontSize;
    }

    // Debug definitions
    console.log('Editor Tools Loaded:', {
        FontSizeType: typeof FontSize,
        FontSizeIsClass: FontSize?.toString().startsWith('class'),
        ColorType: typeof ColorPlugin,
    });

    const tools = {
        paragraph: Paragraph ? {
            class: Paragraph as any,
            inlineToolbar: true,
            tunes: AlignmentTune ? ['alignment'] : [],
            config: {
                placeholder: 'Type forward slash / to open menu',
            },
        } : undefined,
        header: Header ? {
            class: Header as any,
            config: {
                placeholder: 'Enter a header',
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
            },
            shortcut: 'CMD+SHIFT+H',
            inlineToolbar: true,
            tunes: AlignmentTune ? ['alignment'] : [],
        } : undefined,
        list: List ? {
            class: List as any,
            inlineToolbar: true,
            tunes: AlignmentTune ? ['alignment'] : [],
            config: {
                defaultStyle: 'unordered',
            },
        } : undefined,
        quote: Quote ? {
            class: Quote as any,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            tunes: AlignmentTune ? ['alignment'] : [],
            config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote author',
            },
        } : undefined,
        code: CodeTool ? {
            class: CodeTool as any,
            tunes: AlignmentTune ? ['alignment'] : [],
            config: {
                placeholder: 'Enter code',
            },
        } : undefined,
        linkTool: LinkTool ? {
            class: LinkTool as any,
            config: {
                endpoint: `${API_BASE_URL}/api/link`,
            },
        } : undefined,
        image: ImageTool ? {
            class: ImageTool as any,
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
        } : undefined,
        marker: Marker ? {
            class: Marker as any,
            shortcut: 'CMD+SHIFT+M',
        } : undefined,
        inlineCode: InlineCode ? {
            class: InlineCode as any,
            shortcut: 'CMD+SHIFT+C',
        } : undefined,
        delimiter: Delimiter ? (Delimiter as any) : undefined,
        table: Table ? {
            class: Table as any,
            inlineToolbar: true,
            config: {
                rows: 2,
                cols: 2,
            },
        } : undefined,
        video: SimpleVideo ? {
            class: SimpleVideo as any,
            config: {
                placeholder: 'Paste a YouTube or Vimeo URL here...',
            }
        } : undefined,
        raw: RawTool ? {
            class: RawTool as any,
            config: {
                placeholder: 'Paste HTML code here (e.g., YouTube iframe embed code)...',
            }
        } : undefined,
        textColor: ColorPlugin ? {
            class: ColorPlugin as any,
            inlineToolbar: true,
            config: {
                colorCollections: [
                    '#FF1300', '#EC7878', '#9C27B0', '#673AB7', '#3F51B5', '#0070FF', '#03A9F4', '#00BCD4', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#111111', '#FFFFFF'
                ],
                defaultColor: '#111111',
                type: 'text',
                customPicker: true
            }
        } : undefined,
        fontSize: FontSize ? {
            class: FontSize as any,
            inlineToolbar: true,
            config: {
                fontSizeScheme: [10, 12, 14, 16, 18, 20, 24, 28, 30, 36, 48, 60, 72]
            }
        } : undefined,
        alignment: AlignmentTune ? {
            class: AlignmentTune as any,
            config: {
                default: "left",
                blocks: {
                    header: 'left',
                    list: 'left'
                }
            },
        } : undefined,
        spacer: Spacer ? Spacer : undefined,
    };

    return { EditorJS, tools };
};
