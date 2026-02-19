# Bodega Sound - Complete Setup Guide
## Email, Domain & Database Configuration

This guide explains everything step-by-step like you're 10 years old. We'll set up:
1. **Email forwarding** (people email hello@bodegasound.com → goes to owner's Gmail)
2. **Gmail alias** (owner can REPLY from hello@bodegasound.com)
3. **Resend** (website automatically sends emails like "Thanks for contacting us!")
4. **Domain connection** (bodegasound.com from Namecheap → your website)
5. **Prisma database** (where all the website data lives)

---

## Part 1: Email Setup with Improv MX

### What is Improv MX?
Think of Improv MX like a mail forwarding service. When someone sends an email to `hello@bodegasound.com`, Improv MX catches it and sends it to the owner's personal Gmail (like `owner@gmail.com`).

### Step 1: Sign Up for Improv MX
1. Go to **https://improvmx.com**
2. Click **"Get Started Free"**
3. Enter the domain: `bodegasound.com`
4. Enter the owner's personal email where you want emails forwarded (e.g., `owner@gmail.com`)
5. Verify the email address (check personal Gmail for verification email)

### Step 2: Add DNS Records in Namecheap
Now you need to tell the internet to use Improv MX. This happens in Namecheap (where the domain is registered).

1. Log into **Namecheap** account
2. Go to **Domain List** → Click **Manage** next to `bodegasound.com`
3. Click **Advanced DNS** tab
4. Delete any existing MX records (if there are any)
5. Add these new MX records:

```
Type: MX Record
Host: @
Value: mx1.improvmx.com
Priority: 10
TTL: Automatic

Type: MX Record
Host: @
Value: mx2.improvmx.com
Priority: 20
TTL: Automatic
```

6. Add this TXT record for verification:
```
Type: TXT Record
Host: @
Value: [Copy the exact value from Improv MX dashboard]
TTL: Automatic
```

### Step 3: Wait for DNS to Propagate
⏰ **This takes time!** DNS changes can take 24-48 hours to work everywhere, but usually it's much faster (1-4 hours).

You can check if it's working by going to **https://improvmx.com** and looking for a green checkmark next to your domain.

### Step 4: Test Email Forwarding
1. Send an email from a different email address (not the owner's personal one) to `hello@bodegasound.com`
2. Check the owner's personal Gmail - the email should appear!
3. The email will show it was forwarded from Improv MX

---

## Part 2: Gmail Alias Setup (Send AS hello@bodegasound.com)

Now the owner can REPLY to emails and they'll look like they came from `hello@bodegasound.com`, not their personal Gmail.

### Step 1: Open Gmail Settings
1. Go to **https://mail.google.com**
2. Click the **gear icon** (⚙️) → **See all settings**
3. Click the **"Accounts and Import"** tab
4. Look for **"Send mail as:"** section
5. Click **"Add another email address"**

### Step 2: Add the New Email Address
1. Name: `Bodega Sound` (this is what people see)
2. Email address: `hello@bodegasound.com`
3. Check **"Treat as an alias"** box
4. Click **Next Step**
5. Choose **"Send through Gmail"** (the easier option)
6. Click **Next Step**

### Step 3: Verify the Email Address
1. Google will send a verification email to `hello@bodegasound.com`
2. Since Improv MX forwards this to the owner's personal Gmail, check there!
3. Open the verification email and click the link OR copy the verification code
4. Enter the code in Gmail settings
5. Click **Verify**

### Step 4: Set as Default (Optional but Recommended)
1. In the "Send mail as" section
2. Click **"make default"** next to `hello@bodegasound.com`
3. Now all emails sent will automatically be from hello@bodegasound.com

### Step 5: How to Reply
When someone emails `hello@bodegasound.com`:
1. The email arrives in owner's Gmail (via Improv MX forwarding)
2. Owner clicks **Reply**
3. Gmail automatically chooses the correct "From" address
4. The reply looks like it came from `hello@bodegasound.com`

**Pro tip:** In Gmail compose window, you can click the "From" dropdown to manually choose which email address to send from.

---

## Part 3: Resend Setup (Automated Website Emails)

### What is Resend?
Resend is like a robot that sends emails automatically. When someone:
- Fills out the contact form → Resend emails the owner
- Places an order → Resend sends a confirmation email
- RSVPs to an event → Resend sends a ticket

### Step 1: Sign Up for Resend
1. Go to **https://resend.com**
2. Click **"Get Started"**
3. Sign up with the owner's personal Gmail
4. Verify the email address

### Step 2: Add Domain to Resend
1. In Resend dashboard, click **"Domains"**
2. Click **"Add Domain"**
3. Enter: `bodegasound.com`
4. Select your region (probably US)
5. Click **"Add"**

### Step 3: Verify Domain with DNS Records
Resend will give you 3 DNS records to add in Namecheap:

1. Go back to **Namecheap** → **Domain List** → **Manage** → **Advanced DNS**
2. Add these records (provided by Resend):

```
Type: TXT Record
Host: resend._domainkey
Value: [Long string from Resend]
TTL: Automatic

Type: TXT Record
Host: _dmarc
Value: v=DMARC1; p=quarantine;
TTL: Automatic

Type: TXT Record
Host: @
Value: v=spf1 include:spf.resend.com ~all
TTL: Automatic
```

**Important:** Don't delete existing TXT records! Just add new ones.

### Step 4: Wait for Verification
Resend will check if the DNS records are working. This can take 1-24 hours.

You'll see:
- 🔴 **Unverified** (means waiting)
- 🟡 **Pending** (propagating)
- 🟢 **Active** (ready to use!)

### Step 5: Create API Key
1. In Resend dashboard, click **"API Keys"**
2. Click **"Create API Key"**
3. Name it: `Bodega Sound Website`
4. Select **"Full Access"** (or at least "Sending Access")
5. Click **"Create"**
6. **COPY THE KEY IMMEDIATELY** - you can't see it again!

It looks like: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 6: Add API Key to Vercel
This is where the magic happens - connecting Resend to your website.

1. Go to **https://vercel.com** → Your project → **Settings**
2. Click **"Environment Variables"**
3. Add new variable:
   - Name: `RESEND_API_KEY`
   - Value: [Paste the key from Step 5]
   - Environment: Production (and Preview if you want)
4. Click **Save**

### Step 7: Configure "From" Email Address
In your website code, the from address needs to be verified in Resend:

1. In Resend dashboard, go to **"Domains"**
2. Your domain should show **"Active"**
3. The default "from" address will be something like `onboarding@resend.dev` (for testing)
4. Once domain is verified, you can use: `hello@bodegasound.com`

**Update the code** in `src/server/actions/contact.ts` and other email files:

```typescript
// Change from:
from: "Bodega Sound <onboarding@resend.dev>",

// To:
from: "Bodega Sound <hello@bodegasound.com>",
```

### Free Tier Limits
Resend gives you **3,000 emails per month** for free! That's plenty for a small business website.

---

## Part 4: Domain Connection (Namecheap → Vercel)

### What We're Doing
We need to tell Namecheap: "When someone types bodegasound.com, show them the website that's hosted on Vercel."

### Step 1: Get Vercel Nameservers
1. Go to **https://vercel.com** → Your project → **Settings**
2. Click **"Domains"**
3. Enter `bodegasound.com`
4. Click **"Add"**
5. Vercel will show you 2 nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

### Step 2: Update Nameservers in Namecheap
1. Log into **Namecheap**
2. Go to **Domain List** → Click **Manage** next to `bodegasound.com`
3. Look for **"Nameservers"** section
4. Change from "Namecheap BasicDNS" to **"Custom DNS"**
5. Enter the Vercel nameservers:
   - Nameserver 1: `ns1.vercel-dns.com`
   - Nameserver 2: `ns2.vercel-dns.com`
6. Click **Save** (or the green checkmark)

**⚠️ IMPORTANT:** Changing nameservers will REMOVE all your DNS records (MX, TXT, etc.). You'll need to re-add them after the domain connects!

### Step 3: Wait for Connection
- ⏰ Takes 24-48 hours (sometimes faster)
- Vercel dashboard will show status
- Namecheap will email when complete

### Step 4: Re-Add DNS Records (Critical!)
After nameservers switch, you must re-add ALL DNS records in Vercel:

1. In Vercel dashboard → **Settings** → **Domains** → `bodegasound.com`
2. Add all the DNS records from earlier:
   - Improv MX records (for email forwarding)
   - Resend verification records
   - Any other records

Vercel has a DNS manager, or you can add them in the dashboard.

### Alternative: Keep Namecheap DNS (Easier Method)
If you don't want to move DNS to Vercel, you can just add an A record:

1. In Namecheap, keep **BasicDNS**
2. Go to **Advanced DNS**
3. Add an **A Record**:
   - Host: `@`
   - Value: [Vercel's IP address - get this from Vercel settings]
   - TTL: Automatic

But nameservers method is recommended.

---

## Part 5: Prisma Database (Where Website Data Lives)

### What is Prisma?
Think of Prisma as a magic filing cabinet. It stores:
- Contact form submissions
- Event information
- Orders
- Subscribers
- RSVPs

### Database Location
The database is a file called `dev.db` in your project (SQLite). On Vercel, it's serverless and stores data automatically.

### For the Client: How to Access Data
The client will use the **Admin Panel** to update content. Here's how:

#### Accessing the Admin Panel
1. Go to `https://bodegasound.com/admin`
2. Log in with the admin password (set in Vercel environment variables)

#### What the Admin Panel Can Do

**Events Management:**
- Create new events (name, date, location, flyer)
- Edit existing events
- Delete events
- View RSVPs for each event

**Messages:**
- View contact form submissions
- Mark messages as read/unread
- Delete old messages

**Orders:**
- View merchandise orders
- Update order status (pending → shipped)
- Export order data

**Subscribers:**
- View email newsletter subscribers
- Export subscriber list
- Delete subscribers

**Check-in (Door Workers):**
- Scan QR codes at events
- Mark people as checked in
- View guest list

### How the Client Updates Content

**To Update Event Info:**
1. Log in to `/admin`
2. Click "Events" in sidebar
3. Click on an event
4. Edit the details
5. Click "Save"

**To Upload New Flyer:**
1. Go to event edit page
2. Click "Upload Flyer"
3. Select image file
4. Save

**To See Contact Messages:**
1. Log in to `/admin`
2. Click "Messages"
3. Read messages from website visitors
4. Reply using Gmail (see Part 2)

### Important: Database Persistence
- **Local development**: Data is in `prisma/dev.db` file
- **Vercel production**: Data persists automatically
- **Backups**: Vercel automatically backs up SQLite databases

**If you need to export data:**
1. Go to `/admin` → Subscribers (or Orders, etc.)
2. Click "Export CSV"
3. Download the file

---

## Part 6: Environment Variables Checklist

Make sure these are set in Vercel (Settings → Environment Variables):

```
RESEND_API_KEY=your_api_key_here
ADMIN_PASSWORD=your_secure_password
DATABASE_URL=file:./dev.db
```

Optional:
```
DOOR_PASSWORD=password_for_door_workers
```

---

## Quick Reference: DNS Records Summary

After everything is set up, your Namecheap/Vercel DNS should have:

### For Email (Improv MX):
```
MX @ mx1.improvmx.com 10
MX @ mx2.improvmx.com 20
```

### For Resend Verification:
```
TXT resend._domainkey [long_value_from_resend]
TXT _dmarc v=DMARC1; p=quarantine;
TXT @ v=spf1 include:spf.resend.com ~all
```

### For Domain Verification (if using Vercel DNS):
```
A @ [vercel_ip_address]
CNAME www bodegasound.com
```

---

## Troubleshooting

### Email not forwarding?
- Check MX records are correct
- Wait 24-48 hours for DNS propagation
- Check Improv MX dashboard for errors
- Make sure Improv MX email verification was clicked

### Gmail alias not working?
- Make sure to click the verification email
- Check spam folder for Gmail verification
- Try adding the alias again

### Resend emails not sending?
- Check API key is correct in Vercel
- Make sure domain is verified (green checkmark)
- Check Resend dashboard for "Failed" emails
- Verify "from" email address is from verified domain

### Website not loading?
- Check nameservers switched correctly
- Wait 24-48 hours after nameserver change
- Try clearing browser cache (Ctrl+Shift+R)
- Check Vercel dashboard for deployment errors

### Can't log into admin?
- Make sure ADMIN_PASSWORD is set in Vercel
- Try redeploying after adding environment variables
- Check that password doesn't have special characters that might be escaped

---

## Summary Timeline

**Day 1:**
1. Sign up for Improv MX
2. Add MX records in Namecheap
3. Sign up for Resend
4. Add domain to Resend
5. Add Resend DNS records
6. Change nameservers to Vercel (or add A record)

**Day 2-3:**
- Wait for DNS propagation
- Set up Gmail alias
- Verify Resend domain
- Add API key to Vercel

**Day 4+:**
- Test everything!
- Send test emails
- Verify contact form
- Test admin panel

---

## Need Help?

If something breaks:
1. Check each service's dashboard for error messages
2. Verify DNS records are correct
3. Wait longer (DNS is slow!)
4. Check the code in `src/server/actions/contact.ts` for email sending logic

Good luck! 🎉
