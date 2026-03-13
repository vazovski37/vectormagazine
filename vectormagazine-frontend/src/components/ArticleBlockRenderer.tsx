
import React from 'react';

// Supported EditorJS block types are documented here to keep admin and frontend in sync:
// paragraph, header, image, list, quote, code, raw, delimiter, table, columns, spacer, video, linkTool

interface VideoBlockData {
    url: string;
    caption?: string;
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    stretched?: boolean;
}

interface LinkToolBlockData {
    link: string;
    meta?: {
        title?: string;
        description?: string;
        image?: { url?: string };
        site_name?: string;
    };
}

const getBlockTextStyle = (block: any): React.CSSProperties | undefined => {
    const alignment = block?.tunes?.alignment?.alignment;
    if (!alignment) return undefined;

    return {
        textAlign: alignment,
        // In this project, right-aligned blocks are also used for RTL copy.
        direction: alignment === 'right' ? 'rtl' : 'ltr',
    };
};

export const ArticleBlockRenderer = ({ block }: { block: any }) => {
    switch (block.type) {
        case 'paragraph':
            return (
                <p style={getBlockTextStyle(block)} dangerouslySetInnerHTML={{ __html: block.data.text }} />
            );

        case 'header':
            const level = block.data.level || 2;
            const HeaderTag = `h${level}` as React.ElementType;
            return <HeaderTag style={getBlockTextStyle(block)} dangerouslySetInnerHTML={{ __html: block.data.text }} />;

        case 'image':
            const normalizeCssValue = (value: string | undefined): string | undefined => {
                if (!value) return undefined;
                if (!isNaN(Number(value))) return `${value}px`;
                return value;
            };

            const rawWidth = block.tunes?.imageTune?.width || block.data.width;
            const width = normalizeCssValue(rawWidth) || '100%';

            const rawHeight = block.tunes?.imageTune?.height || block.data.height;
            const height = normalizeCssValue(rawHeight);

            // Ensure width is valid CSS and overrides prose defaults
            const style: React.CSSProperties = {
                width: width,
                height: height || 'auto',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'block',
                maxWidth: '100%' // Prevent overflowing container
            };

            const imgStyle: React.CSSProperties = height ? {
                height: '100%',
                objectFit: 'cover'
            } : {};

            return (
                <figure className="my-8" style={style}>
                    <img
                        src={block.data.file?.url || block.data.url}
                        alt={block.data.caption || ''}
                        className="rounded-lg"
                        style={{ ...imgStyle, width: '100%', height: height ? '100%' : 'auto' }}
                    />
                    {block.data.caption && (
                        <figcaption className="text-center text-sm text-muted-foreground mt-2">
                            {block.data.caption}
                        </figcaption>
                    )}
                </figure>
            );

        case 'list':
            const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
            return (
                <ListTag style={getBlockTextStyle(block)}>
                    {block.data.items.map((item: string, i: number) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                </ListTag>
            );

        case 'quote':
            return (
                <blockquote style={getBlockTextStyle(block)}>
                    <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
                    {block.data.caption && (
                        <cite>— {block.data.caption}</cite>
                    )}
                </blockquote>
            );

        case 'code':
            return (
                <pre className="overflow-x-auto">
                    <code>{block.data.code}</code>
                </pre>
            );

        case 'raw':
            return (
                <div
                    className="my-6"
                    dangerouslySetInnerHTML={{ __html: block.data.html }}
                />
            );

        case 'delimiter':
            return (
                <div className="my-12 flex justify-center">
                    <span className="text-2xl text-muted-foreground">* * *</span>
                </div>
            );

        case 'table':
            return (
                <div className="my-6 overflow-x-auto">
                    <table className="w-full">
                        <tbody>
                            {block.data.content.map((row: string[], rowIndex: number) => (
                                <tr key={rowIndex}>
                                    {row.map((cell: string, cellIndex: number) => (
                                        <td
                                            key={cellIndex}
                                            dangerouslySetInnerHTML={{ __html: cell }}
                                            className="border px-4 py-2"
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );

        case 'columns':
            return (
                <div
                    className="grid grid-cols-1 gap-8 my-8 md:grid-cols-none"
                    style={{
                        // Default to grid-cols-1 on mobile (via class), use explicit repeat for md+ 
                        // Note: Tailwind arbitrary values rely on build-time classes, so dynamic strings like md:grid-[...] won't work reliably if not pre-generated.
                        // Instead, we use a CSS variable or direct style for the desktop columns.
                        gridTemplateColumns: `repeat(${block.data.cols.length}, minmax(0, 1fr))`
                    }}
                >
                    {block.data.cols.map((col: any, colIndex: number) => (
                        <div key={colIndex} className="flex flex-col gap-4">
                            {col.blocks.map((childBlock: any, childIndex: number) => (
                                <ArticleBlockRenderer key={childIndex} block={childBlock} />
                            ))}
                        </div>
                    ))}
                </div>
            );

        case 'spacer':
            return (
                <div style={{ height: block.data.height + 'px' }} aria-hidden="true" />
            );

        case 'video': {
            const data: VideoBlockData = block.data || {};
            if (!data.url) return null;

            const isYouTube = /youtu\.be|youtube\.com/.test(data.url);
            const isVimeo = /vimeo\.com/.test(data.url);

            // Match admin-style: centered, responsive player with optional caption
            return (
                <figure className="my-8">
                    <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingTop: '56.25%' }}>
                        {isYouTube || isVimeo ? (
                            <iframe
                                src={data.url}
                                title={data.caption || 'Embedded video'}
                                className="absolute inset-0 h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={data.url}
                                className="absolute inset-0 h-full w-full"
                                controls={data.controls !== false}
                                autoPlay={!!data.autoplay}
                                muted={!!data.muted}
                            />
                        )}
                    </div>
                    {data.caption && (
                        <figcaption className="text-center text-sm text-muted-foreground mt-2">
                            {data.caption}
                        </figcaption>
                    )}
                </figure>
            );
        }

        case 'linkTool': {
            const data: LinkToolBlockData = block.data || {};
            if (!data.link) return null;

            const label = data.meta?.title || data.link;

            return (
                <p className="my-4">
                    <a
                        href={data.link}
                        className="text-primary underline underline-offset-2 break-words"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {label}
                    </a>
                </p>
            );
        }

        default:
            console.warn('Unknown block type:', block.type);
            return null;
    }
};
