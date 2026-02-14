# Technical Setup & Environment Guide

To make the site functional in production (Vercel), you must connect these services. Without these keys, orders will fail and emails won't send.

## 1. Environment Variables (.env)
Copy these to your Vercel Project Settings:

| Variable | Source | Purpose |
|----------|--------|---------|
| `DATABASE_URL` | Local/Neon/Vercel Postgress | Stores orders & subscribers. |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard | Permission to store receipt images. |
| `RESEND_API_KEY` | Resend.com | Sending order & marketing emails. |
| `ADMIN_EMAIL` | Yours/Client's Email | Where order notices are sent. |
| `PRISMIC_REPOSITORY_NAME` | Prismic.io | Connects the content editing suite. |
| `PRISMIC_ACCESS_TOKEN` | Prismic.io | Security token for fetching content. |

## 2. Vercel Blob Activation
1. Go to your **Vercel Project Dashboard**.
2. Click on the **Storage** tab.
3. Click **Connect Database** -> **Blob**.
4. Once connected, Vercel automatically adds the `BLOB_READ_WRITE_TOKEN` to your environment. **You don't need to do anything manually here.**

## 3. Resend Domain Verification
To send emails from `@bodegasound.com` instead of the generic `@resend.dev`:
1. Log into Resend.
2. Go to **Domains** -> **Add Domain**.
3. Add the DNS records (MX/TXT) to your domain registrar (GoDaddy/Namecheap).
4. Once "Verified", change the `from:` address in `src/server/actions/orders.ts` to your custom email.

## 4. Prismic Webhooks (Advanced)
To make the site update *instantly* when the client clicks "Publish" in Prismic:
1. In Prismic, go to **Settings** -> **Webhooks**.
2. Add your site URL: `https://your-site.com/api/revalidate`.
3. This clears the cache so the new event flyer appears immediately.
