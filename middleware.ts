import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_PASSWORD ?? "";
const DOOR_SECRET = process.env.DOOR_PASSWORD ?? "";
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

const DOOR_ALLOWED_PATTERNS = [
  /^\/admin\/events\/[^/]+\/checkin$/,
  /^\/admin\/checkin$/,
  /^\/admin\/door$/,
];

function isDoorAllowedRoute(pathname: string): boolean {
  return DOOR_ALLOWED_PATTERNS.some((pattern) => pattern.test(pathname));
}

async function signToken(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSession = request.cookies.get('admin-session')?.value;
    const doorSession = request.cookies.get('door-session')?.value;

    let isAdmin = false;
    let isDoor = false;

    if (adminSession && ADMIN_SECRET) {
      const parts = adminSession.split(":");
      if (parts.length === 3) {
        const [timestamp, nonce, signature] = parts;
        const payload = `${timestamp}:${nonce}`;
        const expected = await signToken(payload, ADMIN_SECRET);
        if (signature === expected) {
          const age = Date.now() - parseInt(timestamp, 10);
          isAdmin = age < TOKEN_EXPIRY_MS;
        }
      }
    }

    if (doorSession && DOOR_SECRET && !isAdmin) {
      const parts = doorSession.split(":");
      if (parts.length === 3) {
        const [timestamp, nonce, signature] = parts;
        const payload = `${timestamp}:${nonce}`;
        const expected = await signToken(payload, DOOR_SECRET);
        if (signature === expected) {
          const age = Date.now() - parseInt(timestamp, 10);
          isDoor = age < TOKEN_EXPIRY_MS;
        }
      }
    }

    if (!isAdmin && !isDoor) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isDoor && !isAdmin && !isDoorAllowedRoute(pathname)) {
      return NextResponse.redirect(new URL('/admin/door', request.url));
    }

    requestHeaders.set('x-admin-role', isAdmin ? 'admin' : 'door');
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; connect-src 'self' https:; font-src 'self' data:; media-src 'self' https:; frame-src 'self' https://www.youtube.com https://youtube.com;"
  );

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
