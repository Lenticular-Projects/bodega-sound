# Web Security Education Guide

A learning guide for the security concepts used in the Bodega Sound application.

---

## Authentication vs Authorization

**Authentication** answers: "Who are you?"
**Authorization** answers: "What are you allowed to do?"

In our app:
- **Authentication** happens at login — you prove your identity by entering the correct password, and you get a session cookie.
- **Authorization** happens on every request — the middleware checks your session cookie and decides if you can access the page (admin pages vs door-worker pages vs public pages). Server actions check your role before performing operations.

A common vulnerability is having authentication without authorization — the user is logged in, but the app doesn't check *what* they're allowed to do. Our `requireRole()` function prevents this.

**Further reading:** [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## Middleware

Middleware is code that runs *between* the user's request and your application's response. In Next.js, middleware runs at the edge (before any page or API route is processed).

Our middleware (`src/proxy.ts`) does three things:
1. Checks authentication for admin routes
2. Enforces role-based access (admin vs door worker)
3. Adds security headers to every response

**Why it matters:** Without middleware, every page and API route would need its own auth check — and missing even one creates a vulnerability. Middleware is a single chokepoint that protects everything.

**Key lesson from this project:** We had middleware code written but it was in the wrong file (`src/proxy.ts`). Next.js only runs middleware from `middleware.ts` at the project root. The fix was a single-line re-export. Always verify your security code is actually being executed.

**Further reading:** [Next.js Middleware docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## Rate Limiting

Rate limiting restricts how many requests a user can make in a given time window. It protects against:

- **Brute-force attacks**: Trying thousands of passwords
- **Spam**: Flooding forms with fake submissions
- **Resource exhaustion**: Burning through email sending credits or storage

Our implementation uses IP-based tracking with an in-memory Map. Each IP gets a counter that resets after the time window expires.

**Trade-offs:**
- In-memory storage is simple but doesn't persist across deployments or scale across multiple servers
- IP-based limiting can affect users behind the same NAT/proxy
- For Vercel's serverless model (single instance per function invocation), in-memory is sufficient

**Further reading:** [OWASP Rate Limiting](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)

---

## Timing Attacks

When you compare two strings with `===`, the comparison stops at the first different character. An attacker can measure response times to figure out how many characters they got right.

Example:
- `"aaaa" === "abcd"` — fails at character 2 (fast)
- `"abca" === "abcd"` — fails at character 4 (slower)

`timingSafeEqual()` always takes the same amount of time regardless of where strings differ. This is called "constant-time comparison."

**Important detail:** `timingSafeEqual` requires both buffers to be the same length. We check length first (which does leak whether the lengths match, but this is acceptable — an attacker learning the password *length* is far less useful than learning individual characters).

**Further reading:** [Node.js crypto.timingSafeEqual](https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b)

---

## HMAC Signatures

HMAC (Hash-based Message Authentication Code) lets you verify that a piece of data hasn't been tampered with, using a secret key.

Our session tokens work like this:
1. Create a payload: `{timestamp}:{random_nonce}`
2. Sign it with HMAC-SHA256 using the admin password as the key
3. Store as cookie: `{timestamp}:{nonce}:{signature}`

To verify:
1. Split the cookie into parts
2. Re-sign `{timestamp}:{nonce}` with the same secret
3. Compare signatures — if they match, the token is authentic

**Why not just store the password in a cookie?** Because cookies are visible to the user (and any JavaScript on the page). HMAC lets us prove the user authenticated without exposing the secret.

**Further reading:** [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## CSRF (Cross-Site Request Forgery)

CSRF tricks a logged-in user's browser into making requests to your site from a malicious page. Example: a hidden form on `evil.com` that POSTs to `bodegasound.com/api/delete-event`.

**Our defenses:**
- `sameSite: "lax"` on cookies — the browser won't send our cookies with cross-origin POST requests
- Next.js Server Actions include built-in CSRF protection via origin checking

**Further reading:** [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

## XSS (Cross-Site Scripting)

XSS happens when an attacker injects JavaScript into your page. If they can run JS in a user's browser, they can steal session cookies, redirect users, or modify page content.

**Our defenses:**
- React automatically escapes all rendered content (no raw HTML injection)
- Content-Security-Policy header restricts which scripts can execute
- `httpOnly: true` on session cookies — JavaScript can't read them

**Further reading:** [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

---

## IDOR (Insecure Direct Object Reference)

IDOR happens when an app exposes internal IDs in URLs or API calls, and doesn't check if the requester is authorized to access that object.

Example: Changing `/admin/events/123/rsvps` to `/admin/events/456/rsvps` to see another event's guest list.

**Our defense:** Every server action that accesses sensitive data calls `requireRole()` first. Even if you know the event ID, you can't access RSVPs without a valid admin or door session.

**Further reading:** [OWASP IDOR](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html)

---

## Security Headers

### Strict-Transport-Security (HSTS)
Tells browsers to *only* connect via HTTPS for 1 year. Even if a user types `http://`, the browser upgrades to HTTPS automatically. Prevents SSL-stripping attacks.

### Content-Security-Policy (CSP)
A whitelist of allowed content sources. Our policy:
- Scripts: only from our domain (plus inline for Next.js hydration)
- Styles: only from our domain (plus inline for Tailwind)
- Images: our domain, blob URLs, data URIs, and any HTTPS source
- Connections: our domain and any HTTPS API
- Frames: only YouTube (for embedded videos)

### X-Frame-Options: DENY
Prevents any site from embedding ours in an iframe. Stops clickjacking attacks where an attacker overlays invisible buttons on our pages.

### X-Content-Type-Options: nosniff
Prevents browsers from guessing the MIME type of responses. Stops attacks where a file uploaded as `.jpg` is actually JavaScript.

**Further reading:** [MDN HTTP Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

---

## UUID v4 for QR Codes

The old QR code format was `qr_{timestamp}_{9chars}`, which was predictable:
- The timestamp narrows the search space
- 9 alphanumeric characters = ~46 bits of entropy

UUID v4 provides **122 bits of randomness** — that's 5.3 x 10^36 possible values. At 1 billion guesses per second, it would take 168 trillion years to brute-force.

**Further reading:** [RFC 4122 — UUID](https://datatracker.ietf.org/doc/html/rfc4122)

---

## Input Validation

We use Zod schemas to validate all user input before it reaches the database. Key principles:

1. **Validate at the boundary**: Check data where it enters your system (server actions), not deep inside
2. **Whitelist, don't blacklist**: Define what's allowed (max 200 chars, email format) rather than what's forbidden
3. **Set maximum lengths**: Without `.max()`, a single form field could contain megabytes of data, causing database bloat or denial of service

**Further reading:** [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
