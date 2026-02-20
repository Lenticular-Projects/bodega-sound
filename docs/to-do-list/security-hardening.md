# Security Hardening To-Do List
**Project:** Bodega Sound — bodega-sound.vercel.app
**Created:** 2026-02-20
**Last Updated:** 2026-02-20
**Author:** Security audit conducted by Claude Code (Sonnet 4.6)

---

## How to Use This Document

Each item below has a status badge:
- `[ ]` = Not done
- `[x]` = Done — mark it yourself, then tell Claude Code "I completed [item name]" and it will update this file

When you want a status check, just ask: **"What's on my security to-do list?"**

---

## Status Overview

| Priority | Item | Status |
|----------|------|--------|
| 🔴 CRITICAL | Replace in-memory rate limiter with Upstash Redis | `[ ]` |
| 🟠 HIGH | Verify `ADMIN_EMAIL` env var is set in Vercel | `[ ]` |
| 🟠 HIGH | Confirm `.env` was never committed to git | `[ ]` |
| 🟡 MEDIUM | Add `Permissions-Policy` header to middleware | `[ ]` |
| 🟡 MEDIUM | Investigate adding RSVP email verification flow | `[ ]` |
| 🟢 LOW | Tighten Content-Security-Policy (remove `unsafe-eval`) | `[ ]` |

---

## 🔴 ITEM 1 — Replace In-Memory Rate Limiter with Upstash Redis

**Status:** `[ ]` Not done
**Effort:** ~30–45 minutes
**Cost:** Free (Upstash free tier covers your traffic levels)

### What this fixes

Right now, if someone tries to guess your admin password, your app is supposed to block them after 5 wrong attempts. But it doesn't actually work in production. Here's why — and the explanation goes deep enough that you'll understand it forever after reading this.

---

### The Plain-English Explanation: Cold Starts, Memory, and Why Your Rate Limiter Is Broken

#### What is a "server"?

Traditionally, a server is a computer that stays on 24/7, sitting in a data center, waiting for requests. When you visit a website, that same computer handles your request. Because it's always on, it can remember things between requests — like "this IP address has already tried 4 wrong passwords."

#### What is "serverless"?

Vercel (where Bodega Sound is deployed) does NOT use a traditional always-on server. Instead, it uses **serverless functions** — also called **lambda functions** or **edge functions**.

Here's how they work:

1. Nobody visits your site for a few minutes
2. Vercel **shuts down** the function — completely. It saves zero memory. It's gone.
3. Someone visits your site
4. Vercel **spins up a brand new function** from scratch in ~200ms (this is called a **"cold start"**)
5. The function handles the request
6. If nobody visits for a few more minutes, Vercel shuts it down again

Each time a new function spins up, it's like turning on a computer that was completely wiped. It has no memory of anything that happened before.

#### What is an "in-memory Map"?

In your codebase, the rate limiter looks like this (simplified):

```javascript
const store = new Map(); // This lives in RAM

function check(ipAddress) {
  const attempts = store.get(ipAddress) || 0;
  if (attempts >= 5) return { allowed: false };
  store.set(ipAddress, attempts + 1);
  return { allowed: true };
}
```

A `Map` is just a list stored in the computer's RAM (Random Access Memory — the "working memory" of the computer, distinct from the hard drive). It's fast, simple, and works perfectly on a traditional always-on server.

**The problem:** When Vercel shuts down the function after a cold start, the RAM is wiped. The `Map` disappears. Every attempt counter resets to zero.

#### How an attacker exploits this

Imagine your admin password is `bodega2026`. An attacker wants to guess it.

**On a traditional server (what you'd want):**
- Attempt 1: wrong
- Attempt 2: wrong
- Attempt 3: wrong
- Attempt 4: wrong
- Attempt 5: wrong → **BLOCKED for 15 minutes**
- Attacker is stuck. 5 attempts every 15 minutes = 480 attempts per day maximum

**On Vercel with an in-memory rate limiter (what you actually have):**
- Attempt 1–5: wrong (rate limiter counts them in RAM)
- Attacker waits ~60 seconds (Vercel's function goes cold, RAM is wiped)
- Attempt 6–10: wrong (rate limiter thinks this is a fresh IP)
- Attacker waits ~60 seconds again
- Repeat forever

The "rate limit" resets itself every time the function goes cold. The attacker is effectively never blocked.

How many passwords can they try per hour? With 60-second waits between batches of 5: **300 attempts per hour, or 7,200 per day.** If your password is common or short, it will be cracked.

#### What is "brute force"?

Brute forcing a password means trying thousands of combinations systematically until one works. Tools like Hydra and Burp Suite automate this. An attacker feeds in a "wordlist" — a file containing millions of common passwords — and the tool hammers your login endpoint automatically.

The only defenses are:
1. A strong password (long, random, unique)
2. Rate limiting that actually works
3. Multi-factor authentication

Right now you only have #1 (hopefully). The rate limiting is broken.

---

### What is Upstash Redis? The Full History

#### Redis — the database behind it

**Redis** (Remote Dictionary Server) was created in 2009 by Salvatore Sanfilippo, an Italian developer who was frustrated that traditional databases were too slow for counting things in real time. He wrote Redis in C and released it open source.

Redis is a **key-value store** — think of it like a giant dictionary (or JavaScript `Map`) that lives on its own dedicated server, not inside your app's RAM. Because it runs separately, it survives cold starts. Multiple function instances can all read and write to the same Redis instance simultaneously.

It became extremely popular for:
- Rate limiting (exactly your use case)
- Caching (storing frequently-read data to avoid slow database hits)
- Session storage
- Real-time leaderboards and counters

Companies like Twitter, GitHub, Snapchat, and Stack Overflow all use Redis.

#### Upstash — serverless Redis

The problem with traditional Redis is that you need to run it on a server 24/7. For serverless apps on Vercel, that's expensive and complicated.

**Upstash** was founded in 2021 by Enes Akar (Turkish developer, previously at AWS) specifically to solve this problem. Their tagline: *"Serverless data for the serverless world."*

Upstash Redis works over HTTP — meaning your Vercel functions can reach it with a simple web request. There's no persistent connection to maintain (which doesn't work with serverless). Each function call makes an HTTP call to Upstash, reads/writes the counter, and disconnects. The data survives.

**Upstash free tier (as of 2026):**
- 10,000 requests per day
- 256MB storage
- Always free, no credit card required for the free tier

For Bodega Sound's admin panel (which maybe has 10–50 login attempts per day), you'll use a fraction of the free tier. You will not pay a cent.

---

### Step-by-Step Fix (do this when ready)

**Step 1: Create an Upstash account**
- Go to upstash.com
- Sign up with GitHub (easiest)
- Click "Create Database"
- Name it `bodega-sound-ratelimit`
- Select region: `us-east-1` or the closest to your users (Manila → `ap-southeast-1`)
- Click Create

**Step 2: Get your credentials**
- On the database page, click "REST API"
- Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

**Step 3: Add to Vercel**
- Go to your Vercel project dashboard → Settings → Environment Variables
- Add `UPSTASH_REDIS_REST_URL` = (paste the URL)
- Add `UPSTASH_REDIS_REST_TOKEN` = (paste the token)

**Step 4: Install packages**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Step 5: Tell Claude Code**
When you're ready, just say: *"I've set up Upstash. The env vars are in Vercel. Please replace the rate limiter."* Claude Code will rewrite `src/lib/rate-limit.ts` to use the Upstash sliding window algorithm, which is production-grade and works across all Vercel instances.

---

## 🟠 ITEM 2 — Verify `ADMIN_EMAIL` in Vercel Environment Variables

**Status:** `[ ]` Not done
**Effort:** 5 minutes
**Cost:** Free

### What this is

When someone places an order on your merch page, the server sends a notification email to the admin. The email address it sends to is controlled by an environment variable called `ADMIN_EMAIL`.

If that variable isn't set in Vercel, your code falls back to a hardcoded value: `orders@bodegasound.com`. If that inbox isn't monitored, you'll miss orders silently.

### How to check

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Look for `ADMIN_EMAIL`
3. If it's not there, add it: `ADMIN_EMAIL` = `your-real-email@gmail.com` (or wherever you want order notifications)
4. Redeploy

---

## 🟠 ITEM 3 — Confirm `.env` Was Never Committed to Git

**Status:** `[ ]` Not done
**Effort:** 2 minutes
**Cost:** Free

### Why this matters

If your `.env` or `.env.local` file (which contains your database password, API keys, and admin password) was ever accidentally committed to git, it's stored in your git history forever — even if you deleted it later. Anyone who clones the repo or finds it on GitHub can read those secrets.

### How to check

Run this in your terminal from the project folder:

```bash
git log --all --oneline -- .env .env.local
```

If this command outputs **nothing**, you're safe. The files were never committed.

If it shows commit hashes, come back and tell Claude Code — there's a procedure to scrub secrets from git history using `git filter-branch` or BFG Repo Cleaner, and you'd also need to rotate all your secrets (change your database password, generate new API keys, etc.).

---

## 🟡 ITEM 4 — Add `Permissions-Policy` Header

**Status:** `[ ]` Not done
**Effort:** 10 minutes
**Cost:** Free

### What this is

`Permissions-Policy` is an HTTP header that tells browsers which browser features your site is allowed to use. It prevents attackers from abusing features like the camera, microphone, geolocation, or payment APIs even if they somehow inject malicious code.

### The fix

When ready, tell Claude Code: *"Add a Permissions-Policy header to middleware."* It will add one line to `middleware.ts` that restricts unnecessary browser features.

---

## 🟡 ITEM 5 — RSVP Email Verification

**Status:** `[ ]` Not done
**Effort:** Several hours
**Cost:** Included in Resend free tier (100 emails/day)

### What this is

Currently, anyone can RSVP to your events with a fake email address. There's no verification step. This means:
- Someone could fill up your event capacity with fake RSVPs
- Your guest list would have bad data
- Attendees don't get a confirmation email they've verified

The fix is a "confirm your email" flow: after RSVP submission, send a verification email. The RSVP isn't confirmed until they click the link.

This is a **feature build**, not a quick fix. Worth doing before your next big event with a capacity limit.

---

## 🟢 ITEM 6 — Tighten Content-Security-Policy

**Status:** `[ ]` Not done
**Effort:** 1–2 hours (requires testing)
**Cost:** Free

### What this is

Your current CSP (Content Security Policy) includes `'unsafe-inline'` and `'unsafe-eval'` in the `script-src` directive. These are required today because Next.js and Three.js (WebGL) need them. However, they weaken XSS protection.

The proper fix uses **nonces** — random tokens generated per request that tell the browser "only run scripts that have this nonce, even if they're inline." This is complex to implement with Next.js and requires testing to make sure Three.js/WebGL/Framer Motion still work.

This is low priority because you have no user-generated HTML content that renders unsanitized, so the XSS surface is minimal right now.

---

## Already Fixed ✅

These were identified in the audit and patched on 2026-02-20:

- [x] Admin pages accessible without login (bfcache bypass) — server-side `verifyAdminSession()` added to all pages
- [x] Logout didn't actually lock pages — fixed via `Cache-Control: no-store` on all `/admin` routes
- [x] HMAC signature comparison used `===` — replaced with constant-time comparison
- [x] `x-forwarded-for` IP header was attacker-spoofable — switched to `x-real-ip`
- [x] Draft events visible on public RSVP pages — `publicOnly: true` filter added
- [x] No file size/type limit on payment proof uploads — 5MB cap + MIME allowlist added
- [x] CSV exports vulnerable to formula injection — `csvField()` escaping applied to all exports
- [x] Admin error boundary leaked Prisma error messages — replaced with generic message + digest
- [x] `Math.random()` used for slug generation — replaced with `randomBytes` (crypto)
- [x] Missing `.trim()` on subscriber name/phone schema fields — added
- [x] Raw `error.message` in admin error boundary — removed
