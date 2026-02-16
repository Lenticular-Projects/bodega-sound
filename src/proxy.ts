import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
    // Pass pathname to server components via REQUEST headers (not response)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    // Admin auth check
    if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
        const session = request.cookies.get('admin-session')?.value;
        if (!session || !(await verifySessionToken(session))) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (request.nextUrl.pathname.startsWith('/api/')) {
        response.headers.set('Cache-Control', 'no-store, max-age=0');
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
