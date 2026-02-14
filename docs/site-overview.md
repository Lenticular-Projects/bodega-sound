# Bodega Sound: Site Overview & Purpose

## The Vision
Bodega Sound is a premium, "vibe-first" digital platform for a creative collective based in Manila. It serves as an archive of past events, a hub for upcoming gatherings, and a low-friction shop for exclusive merchandise ("Drops").

## Core Objectives
1. **Archive**: Preserve the history of events through photography and media.
2. **Community**: Capture and manage a direct line of communication with "The Collective" (Subscribers).
3. **Commerce**: Enable "drop-style" shopping where payment is verified manually (GCash) while data is stored securely.

## Technical Architecture
Unlike generic template sites, Bodega Sound is built using a modern, high-performance stack:
- **Framework**: [Next.js](https://nextjs.org/) (React) for a smooth, app-like experience.
- **Styling**: Industrial/Premium aesthetic using Vanilla CSS and Framer Motion for high-end animations.
- **Content Management**: [Prismic CMS](https://prismic.io/) – allowing the client to edit flyers, text, and product prices without touching code.
- **Database**: [Prisma](https://www.prisma.io/) + SQLite – storing the "Live Data" (Orders, Subscribers).
- **File Storage**: [Vercel Blob](https://vercel.com/storage/blob) – hosting the GCash receipt images securely in the cloud.
- **Email**: [Resend](https://resend.com/) – delivering transaction receipts and marketing broadcasts.

## User Journeys
### The Visitor
- Lands on a high-energy hero section.
- Browses high-quality archives and upcoming event flyers.
- Can "Join the List" (Subscriber logic) to stay updated.

### The Customer
- Selects a product, fills out shipping details.
- Contextual payment: Shown a GCash QR code for immediate payment.
- Uploads a screenshot of the receipt (Stored in Vercel Blob).
- Receives a styled "Order Secured" email confirmation.
