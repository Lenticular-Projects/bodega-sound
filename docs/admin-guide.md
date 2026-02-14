# Admin Dashboard & Management

The Admin Dashboard is the private "cockpit" for managing live data (not content, which is in Prismic).

## 1. Accessing the Dashboard
- **Current URL**: `/admin/orders`
- **Subscribers URL**: `/admin/subscribers`

Currently, these pages are "hidden" from the main navigation but accessible via the URL.

## 2. Managing Orders
In the **Inbound Orders** view, the client can:
- See a chronological list of all attempted purchases.
- View customer contact details for shipping.
- Click **"View Proof"** to see the GCash receipt image stored on Vercel Blob.
- Check the **Status** (default is PENDING).

## 3. Security & Password Protection (Roadmap)
For the final handoff, we will implement **Basic Admin Auth**:

### The Goal:
When someone tries to visit `/admin`, they are met with a "System Access" screen asking for a master password.

### Implementation Plan:
1. **Next-Auth/Middleware**: We will add a simple middleware that checks for a session.
2. **Environment Variable**: The password will be stored in the `.env` file (e.g., `ADMIN_PASSWORD=...`).
3. **Internal Use**: This prevents competitors or random visitors from seeing your customer list or sales data.

## 4. Prismic vs Admin Dashboard
**Use Prismic when you want to change:**
- Product Prices
- Event Photos
- Homepage Text
- Flyer links

**Use the Admin Dashboard when you want to see:**
- Who bought what today.
- Who just joined the email list.
- Verification of GCash payments.
