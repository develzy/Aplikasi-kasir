import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const auth = request.cookies.get('auth');
    const { pathname } = request.nextUrl;

    // Paths that don't require auth
    if (pathname.startsWith('/login') || pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    if (!auth) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
