import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, verifyDoorSessionToken } from '@/lib/auth';

// Routes accessible by door workers (check-in related)
const DOOR_ALLOWED_PATTERNS = [
    /^\/admin\/events\/[^/]+\/checkin$/,
    /^\/admin\/checkin$/,
    /^\/admin\/door$/,
];

function isDoorAllowedRoute(pathname: string): boolean {
    return DOOR_ALLOWED_PATTERNS.some((pattern) => pattern.test(pathname));
}

export async function proxy(request: NextRequest) {
    // Pass pathname to server components via REQUEST headers (not response)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    const pathname = request.nextUrl.pathname;

    // Admin auth check
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const adminSession = request.cookies.get('admin-session')?.value;
        const doorSession = request.cookies.get('door-session')?.value;

        const isAdmin = adminSession ? await verifySessionToken(adminSession) : false;
        const isDoor = doorSession ? await verifyDoorSessionToken(doorSession) : false;

        if (!isAdmin && !isDoor) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Door workers can only access check-in and door hub pages
        if (isDoor && !isAdmin && !isDoorAllowedRoute(pathname)) {
            return NextResponse.redirect(new URL('/admin/door', request.url));
        }

        // Pass role to server components
        requestHeaders.set('x-admin-role', isAdmin ? 'admin' : 'door');
    }

    const response = NextResponse.next({
        request: { headers: requestHeaders },
    });
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (pathname.startsWith('/api/')) {
        response.headers.set('Cache-Control', 'no-store, max-age=0');
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
