import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, ADMIN_SESSION_TOKEN } from '@/services/authConfig';

export function proxy(request: NextRequest) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const path = request.nextUrl.pathname;

    // Protect Admin Dashboard strictly at server gateway
    if (path.startsWith('/admin') && token !== ADMIN_SESSION_TOKEN) {
        return NextResponse.redirect(new URL('/products', request.url));
    }

    // Restrict core product operations from unauthenticated guests
    if (path.startsWith('/products') && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = { matcher: ['/products/:path*', '/admin/:path*'] };
