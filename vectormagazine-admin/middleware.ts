import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login'];

// Paths that are always public (static files, etc.)
const staticPaths = ['/_next', '/favicon.ico', '/static'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static files
    if (staticPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Skip API routes (handled by backend/proxy)
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Skip public paths
    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    // Check for refresh token cookie (indicates logged in session)
    const refreshToken = request.cookies.get('refresh_token');

    console.log('Middleware Path:', pathname);
    console.log('All Cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value}`).join('; '));
    console.log('Refresh Token Found:', !!refreshToken);

    if (!refreshToken) {
        // No refresh token, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Match all paths except static files
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
