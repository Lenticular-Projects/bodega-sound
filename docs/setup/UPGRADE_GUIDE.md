# Bodega Sound — Comprehensive Upgrade Guide

This document explains every change made during the full codebase upgrade, why each change matters, and how to configure the new features.

---

## Table of Contents

1. [Phase 1: Foundation](#phase-1-foundation)
2. [Phase 2: Admin Auth & Server Actions](#phase-2-admin-auth--server-actions)
3. [Phase 3: Wiring Forms & Admin UI](#phase-3-wiring-forms--admin-ui)
4. [Phase 4: UI Refinements](#phase-4-ui-refinements)
5. [Phase 5: Page Metadata & SEO](#phase-5-page-metadata--seo)
6. [Admin Password Setup](#admin-password-setup)
7. [Email Setup (Resend)](#email-setup-resend)
8. [SMS Setup (Twilio)](#sms-setup-twilio)
9. [Deploying to Vercel](#deploying-to-vercel)

---

## Phase 1: Foundation

### What changed

1. **Deleted `src/lib/prisma.ts`** — There were two identical Prisma client files. Everything already imports from `@/server/db`, so the duplicate was dead code causing confusion.

2. **Updated Prisma schema** — Added two things:
   - `updatedAt` field on the `Order` model — Prisma now automatically tracks when an order was last modified (e.g. when you change its status from PENDING to SHIPPED)
   - New `ContactMessage` model — stores messages from the contact form in the database instead of just simulating a submission

3. **Fixed TypeScript `any` types** — The codebase rules ban `any`. Two components had them:
   - `text-reveal.tsx` had `progress: any` → now properly typed as `MotionValue<number>` (a Framer Motion type)
   - `vinyl-globe.tsx` had `(e: any)` on pointer handlers → now properly typed as `ThreeEvent<PointerEvent>` (a React Three Fiber type)

4. **Removed `vinyl-globe.tsx`** — This was an unused 3D vinyl record globe component that was never imported anywhere on the site. It was just an idea that didn't make it to production, so it was cleaned up.

### Why it matters

- Removes confusion (one Prisma client, not two)
- Contact form submissions are now stored in the database (previously they were fake — just a `setTimeout`)
- TypeScript errors are caught at build time instead of at runtime
- Less unused code = smaller bundle, clearer codebase

---

## Phase 2: Admin Auth & Server Actions

### What changed

**Admin Authentication System** — Before this upgrade, anyone who knew the URL `/admin/orders` could see all your orders, subscribers, etc. Now:

1. **Middleware protection** (`middleware.ts`) — Every request to `/admin/*` (except `/admin/login`) is intercepted. If there's no valid session cookie, you're redirected to the login page.

2. **Login flow** (`src/server/actions/auth.ts`):
   - You visit `/admin/orders` → middleware sees no cookie → redirects to `/admin/login`
   - You enter the password → server action compares it against `ADMIN_PASSWORD` environment variable
   - If correct → creates a signed token (HMAC-SHA256), stores it as an HttpOnly cookie, redirects to `/admin/orders`
   - The cookie expires after 24 hours, then you need to log in again
   - HttpOnly means JavaScript can't read the cookie (protects against XSS attacks)

3. **Logout** — There's now a "Logout" button in the admin sidebar that clears the cookie and sends you back to the login page.

4. **Admin CRUD Server Actions** (`src/server/actions/admin.ts`):
   - `updateOrderStatus()` — Change order status (PENDING → VERIFIED → SHIPPED → DELIVERED)
   - `deleteOrder()` / `deleteSubscriber()` / `deleteMessage()` — Remove records
   - `exportOrdersCsv()` / `exportSubscribersCsv()` — Generate CSV downloads
   - `markMessageRead()` — Mark contact messages as read

5. **Contact form server action** (`src/server/actions/contact.ts`):
   - Validates the form data with Zod (checks name, email format, message length)
   - Saves to the database
   - Optionally sends a notification email to `hello@bodegasound.ph` via Resend (if configured)

### How the auth works technically

```
User visits /admin/orders
    ↓
Middleware checks for "admin-session" cookie
    ↓
No cookie? → Redirect to /admin/login
    ↓
Has cookie? → Verify HMAC signature + check expiry (24h)
    ↓
Invalid/expired? → Redirect to /admin/login
    ↓
Valid? → Allow through to the page
```

The token format is: `timestamp:nonce:hmac_signature`
- The signature is created using your `ADMIN_PASSWORD` as the secret key
- Even if someone sees the cookie value, they can't forge a valid one without knowing the password

---

## Phase 3: Wiring Forms & Admin UI

### What changed

**Contact Form** (`src/components/contact/ContactForm.tsx`):
- Before: `await new Promise((resolve) => setTimeout(resolve, 1500))` — literally just waited 1.5 seconds and pretended it worked
- After: Actually calls `submitContactMessage()` server action → validates with Zod → saves to database → shows toast on error

**Newsletter Form** (`src/components/newsletter/NewsletterForm.tsx`):
- Before: Same fake `setTimeout` trick
- After: Calls `subscribeUser()` server action → upserts subscriber in database → shows toast on error

**Admin Orders Page** (`src/app/admin/orders/page.tsx` + `src/components/admin/OrdersTable.tsx`):
- Before: Static table, no actions, couldn't do anything
- After:
  - **Search** by customer name or email
  - **Filter** by status (ALL / PENDING / VERIFIED / SHIPPED / DELIVERED)
  - **Pagination** (20 per page)
  - **Inline status dropdown** — click the status badge to change it directly
  - **Delete** with confirmation dialog
  - **Export CSV** — downloads all orders as a CSV file

**Admin Subscribers Page** (`src/app/admin/subscribers/page.tsx` + `src/components/admin/SubscribersTable.tsx`):
- Same upgrade: search, filter by source, pagination, delete, export CSV

**Admin Messages Page** (NEW — `src/app/admin/messages/page.tsx` + `src/components/admin/MessagesTable.tsx`):
- Lists all contact form submissions
- Unread messages have a yellow dot indicator
- Click to expand and read the full message
- "Reply" button opens your email client with a pre-filled reply
- Delete with confirmation
- Unread count badge shows in the sidebar nav

---

## Phase 4: UI Refinements

### Hero "Breathe" Animation

Before: Used `element.animate()` (Web Animations API) inside a `useEffect` — this is an imperative approach that bypasses React's control.

After: Uses Framer Motion's `<motion.section animate={breathe.animate}>` — declarative, consistent with the rest of the site's animation system, and properly cleaned up by React.

The breathe effect is a subtle `scale(1) → scale(1.02) → scale(1)` over 4 seconds, looping forever. It gives the hero section a "living, breathing" feel.

### What `next/image` means

The `<img>` HTML tag loads images as-is — full resolution, no optimization, no lazy loading by default.

Next.js's `<Image>` component (`next/image`) does several things automatically:
- **Lazy loading** — Images below the fold only load when you scroll near them
- **Responsive sizing** — Generates multiple sizes (300px, 600px, 1200px etc.) and serves the right one based on the user's screen
- **Format optimization** — Converts to WebP/AVIF (smaller file sizes) on the fly
- **Prevents layout shift** — Reserves space before the image loads so content doesn't jump around

Components updated: ProductCard, YouTubeSection, NextEventSection, PastEventsSection, ArchiveEventGrid, Header (logo), Footer (logo), Admin layout (logo).

For YouTube thumbnails specifically, we added `img.youtube.com` to `next.config.ts` `remotePatterns` so Next.js is allowed to optimize those external images.

### Error Boundaries

Two new error boundary files:
- `src/app/error.tsx` — Catches errors anywhere on the public site, shows a "SOMETHING BROKE" message with a "Try Again" button
- `src/app/admin/error.tsx` — Catches errors in the admin panel specifically

Without these, a runtime error shows Next.js's default error page (ugly, no branding).

### Favicon

Generated from your Bodega Sound logo (`public/images/logo/bdg-yellow.png`):
- `src/app/icon.png` (32x32 with padding) — used as the browser tab icon
- `src/app/apple-icon.png` (180x180 with padding) — used when someone adds your site to their iPhone home screen
- `public/favicon.ico` — fallback for older browsers

Next.js automatically detects these files by convention (no configuration needed).

---

## Phase 5: Page Metadata & SEO

### What changed

Every page now has a unique `<title>` and `<meta description>` tag:

| Page | Title |
|------|-------|
| `/events` | Events \| Bodega Sound |
| `/about` | About \| Bodega Sound |
| `/contact` | Contact \| Bodega Sound |
| `/shop` | Shop \| Bodega Sound |
| `/archive` | Archive \| Bodega Sound |
| `/links` | Links \| Bodega Sound |

### Why it matters

- **Google Search** uses the title and description to display your site in search results
- **Social sharing** (Instagram link preview, iMessage preview, WhatsApp preview) uses the OpenGraph title and description
- Without unique metadata, every page showed "Bodega Sound | Underground Collective" — Google sees that as duplicate content

### How it was done

For pages that were already server components (events, about, contact), we just added a `metadata` export.

For pages that were client components (`"use client"` — shop, archive, links), we had to:
1. Extract the client code into a separate `*PageContent.tsx` component
2. Make the page file a server component that exports metadata and renders the content component

This is because Next.js only allows `metadata` exports from server components.

---

## Admin Password Setup

### Local Development

The password is already set in `.env`:
```
ADMIN_PASSWORD=bodega2026
```

To change it, edit that value and restart the dev server.

### On Vercel (Production)

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add a new variable:
   - Key: `ADMIN_PASSWORD`
   - Value: (choose a strong password)
   - Environment: Production, Preview, Development
4. Click **Save**
5. **Redeploy** your site (the new env var only takes effect after a new deployment)

**Important**: Choose a strong password for production. The local default `bodega2026` is just for dev convenience.

### How auth protects your pages

```
/admin/orders       → Protected (requires login)
/admin/subscribers  → Protected (requires login)
/admin/messages     → Protected (requires login)
/admin/login        → Public (this is the login page itself)
```

The middleware (`middleware.ts`) runs on EVERY request before your page code. It's the bouncer — if you don't have a valid cookie, you can't get past it.

---

## Email Setup (Resend)

### What Resend does

Resend is an email API service. When someone fills out the contact form, you can optionally get a notification email sent to `hello@bodegasound.ph`.

### Can you send emails from the admin dashboard?

Currently, the "Reply" button on the Messages page opens your default email client (Gmail, Apple Mail, etc.) with a pre-filled recipient. This means you reply from YOUR email, not from the website.

To send emails directly from the website/dashboard, you would need:
1. A Resend account with a verified domain (`bodegasound.ph`)
2. Add a "Send Reply" action that calls the Resend API from a server action

### Setup Steps

1. Go to [resend.com](https://resend.com) and create a free account (100 emails/day free)
2. Add and verify your domain (`bodegasound.ph`) by adding DNS records they provide
3. Create an API key
4. Add to your environment:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   ```
5. On Vercel: Add `RESEND_API_KEY` in Settings → Environment Variables
6. Redeploy

Once configured, the contact form will automatically send notification emails. No code changes needed — it's already wired up in `src/server/actions/contact.ts`.

---

## SMS Setup (Twilio)

### Can you send texts from the website?

Not currently built in, but it would be straightforward to add. Here's how it would work:

### What you'd need

1. A [Twilio account](https://www.twilio.com) ($15 to start, then ~$0.0079 per SMS in the Philippines)
2. A Twilio phone number
3. Three environment variables:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### How it would be built

A new server action like:
```typescript
// src/server/actions/sms.ts
"use server";
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSms(to: string, body: string) {
  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
}
```

Then you could:
- Send order status update texts from the admin dashboard
- Send event announcement blasts to subscribers who gave their phone number
- Send order confirmation texts

### Cost estimate

- Philippines SMS: ~$0.0079/message (~₱0.45)
- 500 subscribers × 1 event announcement = ~$3.95

This is NOT currently implemented — it would need to be built as a separate feature.

---

## Deploying to Vercel

### Environment Variables to Set on Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Your database connection string |
| `ADMIN_PASSWORD` | Yes | Password for admin login |
| `RESEND_API_KEY` | No | For email notifications on contact form |
| `GOOGLE_GENERATIVE_AI_API_KEY` | No | For AI features |

### Steps

1. Push your code to GitHub
2. On Vercel dashboard, import the repo (or it auto-deploys if already connected)
3. Go to Settings → Environment Variables and add the variables above
4. Redeploy

The `ADMIN_PASSWORD` is the most important one — without it, the admin login will show "Admin password not configured" when you try to log in.
