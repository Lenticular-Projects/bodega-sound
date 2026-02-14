# E-Commerce & Order Flow

This document breaks down how the shop works, where the images go, and how the "Manual Verification" model is handled.

## 1. The Purchase Journey
Because many transactions in PI (Philippines) happen via GCash rather than standard credit cards, we use an **Evidence-Based Order Flow**:

1. **Information Entry**: User provides Name, Email, Phone, and shipping address.
2. **Contextual Payment**: The system displays the **Bodega Sound GCash QR Code** and the total price (including shipping logic).
3. **Evidence Upload**: The user uploads a photo/screenshot of their GCash success screen.
4. **Order Logging**: 
   - The screenshot is uploaded to **Vercel Blob Storage**.
   - A record is created in the database with the user's info + the **Direct URL** to that image.
   - The user is automatically added to the **Subscriber List**.

## 2. Vercel Blob (Receipt Storage)
### What it is:
Vercel Blob is a cloud "hard drive" for the website. When a user pushes "Submit Order," the image doesn't stay on their phone—it moves to Vercel's global servers.

### How it works with the site:
- **Automatic**: You don't need to manually move files. The code handles the upload.
- **Permanent**: These links do not expire. They are stored in your database so you can look up a sale from 6 months ago and see the receipt.
- **Connection**: To see these images, you must have the `BLOB_READ_WRITE_TOKEN` in your environment variables.

## 3. Order Confirmations (React Emails)
When an order is submitted, two things happen via **Resend**:

### A. Customer Receipt
The user gets a premium, branded email (using `react-email`). It uses the same fonts and colors as the website, making the brand feel professional and established.
- **Subject**: `Order Secured: [Product Name]`
- **Content**: Details of what they bought, their unique Order ID, and a note that the team is verifying their payment.

### B. Admin Notification
You (or the client) receive a notification:
- **Subject**: `NEW ORDER: [Product Name] - [Customer Name]`
- **Content**: All customer details + a **Direct Link** to the GCash receipt image so you can verify the transaction immediately.
