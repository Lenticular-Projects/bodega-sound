# Marketing & Audience Strategy

This document explains how Bodega Sound builds an audience and how to communicate with them via Email and SMS/WhatsApp.

## 1. Subscriber Capturing
The site captures "The Collective" through two channels:
1. **Direct Sign-up**: The "JOIN THE LIST" button in the header.
2. **Customers**: Anyone who makes a purchase is automatically added to the subscriber list.

**Stored Data**:
- Email (Primary)
- Name (Optional)
- Phone Number (Optional - for SMS/WhatsApp)
- Source (Tells you if they came from a purchase or just a sign-up)

## 2. Email Marketing (Resend)
We use **Resend** for two types of emails:

### A. Transactional (Automated)
Order confirmations. These are "set and forget."

### B. Broadcasts (Newsletter/Invites)
To send a blast about a new party or merch drop:
1. Log into your **Resend Dashboard**.
2. Go to **Broadcasts**.
3. You can select your audience and send a styled email.
*Note: Because we use React Email, we can eventually build a "Party Invite Component" that looks exactly like the website flyer.*

## 3. SMS & WhatsApp Strategy (The Progressive Solution)
For Manila-based events, SMS is often ignored. The smartest move for Bodega Sound is **WhatsApp Business API via Twilio**.

### Why WhatsApp over SMS?
- **Rich Media**: You can send the actual flyer image, not just text.
- **High Open Rates**: Users in PH check WhatsApp/Telegram/Viber more than SMS.
- **Branding**: Includes a verified business profile photo and name.

### Implementation Setup:
- **Phone Number**: A virtual "WhatsApp Number" is rented via Twilio (usually a US number is easiest/cheapest to start with).
- **Automation**: When the client wants to send a "Party Alert", we can build a simple button in the Admin Dashboard that triggers a WhatsApp blast to the stored phone numbers.
