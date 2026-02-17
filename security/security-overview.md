# Bodega Sound — Security Overview

This document explains every security layer protecting the Bodega Sound application, what each layer defends against, and how they fit together.

---

## The Problem We Solved

Before this hardening, the admin panel was **completely open to the public**. Anyone could:

- Visit `/admin/events` and see all event data
- Call server actions like `deleteEvent()` from the browser console
- Upload files to Vercel Blob storage without authenticating
- Spam RSVP, contact, and order forms with no limits
- Brute-force the admin password with unlimited attempts

All of this was possible because the authentication middleware existed in code but was never activated by Next.js.

---

## Security Layers

### 1. Middleware — The Front Gate

**File:** `middleware.ts` (project root) + `src/proxy.ts`

Every HTTP request to the site passes through middleware before reaching any page or API route. The middleware:

- **Redirects unauthenticated users** away from `/admin/*` pages to `/admin/login`
- **Restricts door workers** to check-in pages only (`/admin/door`, `/admin/events/[id]/checkin`)
- **Adds security headers** to every response (see below)

This is the first line of defense. Even if someone guesses an admin URL, they can't reach the page.

### 2. Server Action Authorization — The Vault Door

**Files:** `src/server/actions/auth.ts`, `events.ts`, `admin.ts`

Middleware protects pages, but server actions (the functions that actually read/write data) needed their own protection. A `requireRole()` function now guards every admin action:

| Action | Who Can Use It |
|--------|---------------|
| Create/update/delete events | Admin only |
| View RSVPs, check in guests | Admin + Door workers |
| Export CSVs, manage orders | Admin only |
| Delete subscribers, messages | Admin only |

If an unauthorized user tries to call any of these functions (even from the browser console), they get an "Unauthorized" error and the action does nothing.

### 3. Upload Endpoint Protection

**File:** `src/app/api/upload/route.ts`

The file upload API now verifies the `admin-session` cookie before accepting any upload. Without a valid admin session, the endpoint returns 401 Unauthorized.

### 4. Session Expiry

**File:** `src/server/actions/auth.ts`

Sessions now properly expire after 24 hours. The timestamp embedded in each session token is checked every time `getSessionRole()` runs. Expired sessions are automatically cleared.

### 5. Login Rate Limiting

**File:** `src/server/actions/auth.ts`

Failed login attempts are tracked by IP address:
- **5 attempts** allowed per **15-minute window**
- After exceeding the limit, all attempts from that IP are blocked until the window resets
- Successful login resets the counter

### 6. Public Form Rate Limiting

**Files:** `events.ts`, `contact.ts`, `subscribers.ts`, `orders.ts`

Every public-facing form is rate-limited by IP:

| Form | Max Submissions | Window |
|------|----------------|--------|
| RSVP | 5 | 15 minutes |
| Contact | 3 | 15 minutes |
| Subscribe | 3 | 15 minutes |
| Order | 3 | 15 minutes |

This prevents spam bots from flooding the database or burning through email sending credits.

### 7. Timing-Safe Password Comparison

**File:** `src/server/actions/auth.ts`

Password comparison now uses Node.js `timingSafeEqual()` instead of `===`. This prevents attackers from learning password characters by measuring response time differences (a "timing attack").

### 8. Cryptographic QR Codes

**File:** `src/server/actions/events.ts`

QR codes for event check-in now use UUID v4 (122 bits of randomness) instead of timestamp + random characters. This makes them impossible to guess or brute-force.

### 9. Security Headers

**File:** `src/proxy.ts`

Every response includes:

| Header | Purpose |
|--------|---------|
| `X-Frame-Options: DENY` | Prevents clickjacking (embedding site in iframes) |
| `X-Content-Type-Options: nosniff` | Prevents MIME type sniffing attacks |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limits referrer information leakage |
| `Strict-Transport-Security` | Forces HTTPS for 1 year, including subdomains |
| `Content-Security-Policy` | Controls which scripts, styles, images, and connections are allowed |

### 10. Input Validation

All Zod schemas now include `.max()` limits on string fields to prevent oversized payloads:

- Names: 200 characters
- Emails: 320 characters
- Phone numbers: 30 characters
- Shipping addresses: 500 characters
- Messages: 5,000 characters

---

## Rate Limiter Implementation

The rate limiter (`src/lib/rate-limit.ts`) uses an in-memory Map, which is appropriate for Vercel's single-instance serverless deployment. It automatically cleans up expired entries every 5 minutes to prevent memory growth.

---

## What We Deliberately Did NOT Change

- **Password hashing**: The site uses environment variable passwords, which is appropriate for a single-admin site. Rate limiting + timing-safe comparison make brute-force impractical.
- **CAPTCHA**: Rate limiting by IP is sufficient. CAPTCHA adds friction for real users.
- **2FA**: Disproportionate for a single-password admin panel.
- **Audit logging**: Valuable but not a vulnerability. Can be added later.
