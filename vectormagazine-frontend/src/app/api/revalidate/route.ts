import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-Demand ISR Revalidation API Route
 * 
 * This endpoint is called by the Flask backend when articles are published,
 * updated, or deleted. It triggers regeneration of specific static pages.
 * 
 * Usage:
 *   POST /api/revalidate
 *   Body: { "secret": "your_token", "path": "/articles/my-article-slug" }
 * 
 * Or for tag-based revalidation:
 *   Body: { "secret": "your_token", "tag": "articles" }
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { secret, path, tag, type } = body;

        // Validate secret token
        const expectedSecret = process.env.REVALIDATION_SECRET || 'vectormagazine-revalidate-secret';

        if (secret !== expectedSecret) {
            return NextResponse.json(
                { message: 'Invalid token', revalidated: false },
                { status: 401 }
            );
        }

        // Revalidate by path (specific article)
        if (path) {
            revalidatePath(path);
            console.log(`[ISR] Revalidated path: ${path}`);

            return NextResponse.json({
                revalidated: true,
                path,
                timestamp: Date.now()
            });
        }

        // Revalidate by tag (group of pages)
        if (tag) {
            revalidateTag(tag);
            console.log(`[ISR] Revalidated tag: ${tag}`);

            return NextResponse.json({
                revalidated: true,
                tag,
                timestamp: Date.now()
            });
        }

        // Revalidate based on type
        if (type === 'article') {
            // Revalidate homepage and articles listing
            revalidatePath('/');
            revalidatePath('/articles');
            console.log('[ISR] Revalidated homepage and articles listing');

            return NextResponse.json({
                revalidated: true,
                paths: ['/', '/articles'],
                timestamp: Date.now()
            });
        }

        // If no path or tag provided
        return NextResponse.json(
            { message: 'Path or tag is required', revalidated: false },
            { status: 400 }
        );

    } catch (error) {
        console.error('[ISR] Revalidation error:', error);
        return NextResponse.json(
            { message: 'Error revalidating', error: String(error), revalidated: false },
            { status: 500 }
        );
    }
}

// Also handle GET for easy testing
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get('secret');
    const path = searchParams.get('path');

    if (!secret || !path) {
        return NextResponse.json({
            message: 'Use POST method for revalidation. GET requires secret and path params.',
            example: '/api/revalidate?secret=your_token&path=/articles/your-slug'
        });
    }

    const expectedSecret = process.env.REVALIDATION_SECRET || 'vectormagazine-revalidate-secret';

    if (secret !== expectedSecret) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    revalidatePath(path);

    return NextResponse.json({
        revalidated: true,
        path,
        timestamp: Date.now()
    });
}
