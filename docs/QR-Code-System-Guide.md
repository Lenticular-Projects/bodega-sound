# Bodega Sound QR Code Check-In System

**End-to-End Guide for Admins, Guests, and Door Workers**

---

## Overview

The Bodega Sound QR code system replaces paper guest lists with a digital check-in flow. When guests RSVP for an event, they receive a unique QR code. At the door, a worker scans the QR code with their phone, which instantly marks the guest as checked in and updates the admin dashboard in real-time.

---

## 1. Admin Perspective (Event Organizer)

### Creating an Event

1. Log in to the admin dashboard at `/admin`
2. Navigate to **Events** in the sidebar
3. Click **+ New Event**
4. Fill in the event details:
   - **Title** (required) — e.g. "CONTRABANDA V"
   - **Date & Time** (required) — when the event starts
   - **Location** (required) — venue name/address
   - **Location URL** — Google Maps link for easy navigation
   - **Flyer Image URL** — poster/flyer image
   - **Capacity** — leave empty for unlimited, or set a number
   - **Ticket Price** — leave empty for free events
   - Collection settings: phone, Instagram, +1s, public guest list
5. Click **Create Event** — the event is immediately published and you're redirected to the management page

### Managing an Event

The event management page (`/admin/events/[id]`) has three tabs:

**Overview Tab:**
- See event details at a glance
- Copy the **RSVP Link** to share with potential guests (via Instagram, WhatsApp, email, etc.)
- See collection settings (what info you're gathering)
- Export guest list as CSV
- Delete the event if needed

**Guests Tab:**
- Real-time stats: Total RSVPs, Going, Maybe, Not Going, Checked In
- Full guest table with name, email, RSVP status, +1s, source, check-in status, registration date
- Search guests by name or email
- Filter by status (Going, Maybe, Not Going, Checked In, Not Checked In)
- Click **Check In** / **Checked In** buttons to toggle check-in status manually
- Export the full list as CSV at any time

**Add Guest Tab:**
- Manually add VIP guests or walk-ins who didn't RSVP online
- Fill in name, email, phone, Instagram, status, +1 count
- Manually added guests get referral source "MANUAL_ADD"
- A QR code is automatically generated for them too

### Sharing the RSVP Link

On the event management page, copy the RSVP link and share it through:
- Instagram Stories / DMs
- WhatsApp groups or broadcasts
- Email invitations
- Physical flyers with a QR code linking to the RSVP page

The RSVP link format is: `https://bodegasound.com/events/[eventId]`

### Monitoring Attendance

- The **Guests tab** shows real-time check-in status
- The stats bar shows `X / Y checked in` at a glance
- The **Check-In Mode** button at the top takes you to the dedicated QR scanning page
- After the event, export the final CSV for records

---

## 2. Guest Perspective

### Receiving an Invitation

Guests receive the event RSVP link through Instagram, WhatsApp, email, or other channels. The link takes them to a branded event page.

### RSVPing

1. Open the RSVP link (`/events/[eventId]`)
2. See the event details: flyer image, title, date/time, location, description, capacity remaining
3. Fill in the RSVP form:
   - **Name** (required)
   - **Email** (required)
   - **Phone** (if the organizer enabled it)
   - **Instagram** (if the organizer enabled it)
   - **Status**: Going / Maybe / Can't Go
   - **Plus ones** (if the organizer enabled it): select 0-5 guests
4. Click **RSVP**

### After RSVPing

After submitting, the guest sees:
- A success confirmation screen
- Their **QR code** displayed on screen (large, scannable)
- Instructions: "Show this QR code at the door for check-in"

The QR code is also:
- Available at `/api/qr/[qrCode]` as a downloadable PNG image
- Sent via email if the organizer has Resend configured (with event details + QR code link)

**Important:** Guests should screenshot or save their QR code for easy access at the door.

### Updating an RSVP

If a guest RSVPs again with the same email:
- Their existing RSVP is updated (not duplicated)
- Their QR code stays the same
- They see the updated confirmation

---

## 3. Door Worker Perspective (Check-In Staff)

### Getting Set Up

1. Open the check-in page on your phone: `/admin/events/[eventId]/checkin`
2. You need to be logged into the admin dashboard (ask the organizer for the password)
3. The page shows: QR Scanner section + Manual Search section + stats

### Scanning QR Codes

1. Tap **Start Scanning** to activate the camera
2. Point the phone camera at the guest's QR code (on their phone screen or printed)
3. The scanner automatically detects and reads the QR code
4. On success:
   - Green toast notification: "Checked in: [Guest Name]"
   - The "Last Check-in" card shows the guest's name and email
   - The stats bar updates: "X / Y checked in"
5. On error:
   - "QR code not found" — the code doesn't match any RSVP
   - "[Name] already checked in" — duplicate scan

### When QR Scanning Doesn't Work

If the guest's phone screen is too bright, too dark, cracked, or they don't have their QR code:

1. Use **Manual Check-In** (always visible below the scanner)
2. Type the guest's name or email in the search bar
3. The guest list filters in real-time
4. Tap the **Check In** button next to their name
5. Green toast confirms the check-in

### Undoing a Check-In

Made a mistake? Two options:
- Click **Undo** on the "Last Check-in" card (appears right after scanning)
- Find the guest in the manual list and click **Undo** next to their "Checked In" status

### What Door Workers See

The check-in page is optimized for mobile and shows:
- **Stats**: "X / Y checked in" (e.g. "45 / 100 checked in")
- **Last Check-in**: most recent guest checked in with Undo button
- **QR Scanner**: camera viewfinder with Start/Stop button
- **Manual Check-In**: searchable list of all guests with status badges (Going/Maybe/Not Going) and check-in buttons

### Tips for Door Workers

- Keep the phone charged — QR scanning uses the camera continuously
- If WiFi/cellular is spotty, use manual check-in (the guest list loads when you open the page)
- For large crowds, two workers can check in simultaneously on different phones — both see the same real-time data
- Each guest's status badge (Going/Maybe/Not Going) helps prioritize — "Going" guests are confirmed, "Maybe" guests should be let in but noted

---

## 4. Technical Flow (How It All Connects)

```
RSVP Flow:
Guest → /events/[eventId] → fills form → submitRSVP() server action
  → Creates RSVP record with unique qrCode (format: qr_[timestamp]_[random])
  → Sends confirmation email with QR code image link
  → Shows QR code on screen

QR Code Generation:
/api/qr/[qrCode] → Looks up RSVP by qrCode → Generates PNG image
  → QR encodes URL: /admin/checkin?code=[qrCode]

Check-In via QR Scan:
Door worker scans QR → Decoded URL: /admin/checkin?code=[qrCode]
  → checkInByQRCode() server action
  → Finds RSVP by qrCode
  → Sets checkedIn=true, checkedInAt=now, checkedInBy="QR_SCAN"
  → Shows success, redirects to /admin/events/[eventId]/checkin

Check-In via Manual Search:
Door worker searches by name/email → clicks "Check In"
  → checkInGuest(rsvpId) server action
  → Sets checkedIn=true, checkedInAt=now

Admin Monitoring:
/admin/events/[eventId] → Guests tab
  → getEventRSVPs(eventId) → shows real-time table
  → Export CSV for post-event analysis
```

---

## 5. Database Schema

### Event Table
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Unique event ID |
| title | String | Event name |
| description | String? | Event description |
| eventDate | DateTime | When the event happens |
| location | String | Venue name/address |
| locationUrl | String? | Google Maps link |
| flyerImage | String? | Poster image URL |
| capacity | Int? | Max guests (null = unlimited) |
| status | String | DRAFT, PUBLISHED, CLOSED, COMPLETED |
| collectPhone | Boolean | Collect phone numbers? |
| collectInstagram | Boolean | Collect Instagram handles? |
| allowPlusOnes | Boolean | Allow +1 guests? |
| showGuestList | Boolean | Show public guest count? |

### RSVP Table
| Field | Type | Description |
|-------|------|-------------|
| id | String (cuid) | Unique RSVP ID |
| eventId | String (FK) | Links to Event |
| name | String | Guest's full name |
| email | String | Guest's email |
| phone | String? | Phone number (if collected) |
| instagram | String? | Instagram handle (if collected) |
| status | String | GOING, MAYBE, NOT_GOING |
| plusOnes | Int | Number of +1 guests |
| plusOneNames | String? | Names of +1 guests |
| qrCode | String (unique) | Unique QR identifier |
| checkedIn | Boolean | Has the guest checked in? |
| checkedInAt | DateTime? | When they checked in |
| checkedInBy | String? | Who checked them in (QR_SCAN or admin) |
| referralSource | String | DIRECT, INSTAGRAM, WHATSAPP, MANUAL_ADD |

---

## 6. Key URLs

| URL | Purpose | Who Uses It |
|-----|---------|-------------|
| `/admin/events` | Event list dashboard | Admin |
| `/admin/events/new` | Create new event | Admin |
| `/admin/events/[id]` | Event management (guests, stats, CSV) | Admin |
| `/admin/events/[id]/checkin` | QR scanner + manual check-in | Door Worker |
| `/admin/checkin?code=[qrCode]` | QR code redirect (auto check-in) | System (scanned by door worker) |
| `/events/[id]` | Public RSVP page | Guest |
| `/api/qr/[qrCode]` | QR code PNG image | System (embedded in emails, shown to guest) |

---

## 7. Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot read properties of undefined (reading 'findMany')" | Run `npx prisma generate` to regenerate the Prisma client |
| QR scanner not opening | Check browser camera permissions; HTTPS required in production |
| Guest can't find their QR code | They can re-RSVP with the same email to see it again |
| Door worker's phone dies | Another worker can use their phone; the system works on any device with a browser |
| Guest not in the list | Use "Add Guest" tab on the management page to add them manually |
| Duplicate RSVPs | The system prevents duplicates — same email updates the existing RSVP |
| Check-in page slow | The guest list loads once on page open; search filters locally (no network needed) |
