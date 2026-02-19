# Bodega Sound RSVP System - Product Requirements Document

**Version:** 1.0  
**Date:** February 16, 2026  
**Status:** Draft - Ready for Development

---

## 1. Executive Summary

### Overview
Build a custom event RSVP and management system that replaces external tools like Partiful, keeping all guest data in-house while providing a seamless, branded experience for Bodega Sound events.

### Why Build Instead of Using Partiful?
- **Data ownership**: Keep all guest information in your database
- **Brand consistency**: Fully match Bodega Sound's dark, minimal aesthetic
- **Cost control**: No per-event fees or subscription costs
- **Flexibility**: Customize features specifically for DJ collective needs
- **Integration**: Connect with existing subscriber system and shop

### Success Metrics
- RSVP completion rate > 80%
- Check-in accuracy > 95%
- Page load time < 2 seconds
- Mobile-first experience (70%+ users on mobile)

---

## 2. User Stories

### Event Organizers (Admin)
- "As an organizer, I want to create events quickly so I can start promoting immediately"
- "As an organizer, I want to see who's coming in real-time so I can plan capacity"
- "As an organizer, I want to check guests in at the door without a clipboard"
- "As an organizer, I want to export guest lists so I can analyze attendance"
- "As an organizer, I want to manually add VIP guests so they don't need to RSVP"
- "As an organizer, I want to send mass communications so everyone gets updates"

### Guests (End Users)
- "As a guest, I want to RSVP in under 30 seconds so I can secure my spot"
- "As a guest, I want to see event details clearly so I know when/where to go"
- "As a guest, I want to receive confirmation so I know I'm registered"
- "As a guest, I want to check in quickly at the door so there's no line"
- "As a guest, I want to share the event easily so my friends can come"

---

## 3. Phase 1: Core Features (MVP)

### 3.1 Database Schema

#### Event Table
```prisma
model Event {
  id                String   @id @default(cuid())
  title             String
  description       String?
  eventDate         DateTime
  location          String
  locationUrl       String?  // Google Maps link
  flyerImage        String?  // Vercel Blob URL
  
  // Capacity & Pricing
  capacity          Int?     // null = unlimited
  ticketPrice       Decimal? // null = free
  currency          String   @default("PHP")
  
  // Status
  status            EventStatus @default(DRAFT)
  
  // Collection Settings
  collectInstagram  Boolean  @default(false)
  collectPhone      Boolean  @default(false)
  allowPlusOnes     Boolean  @default(false)
  showGuestList     Boolean  @default(false)
  
  // Relationships
  customQuestions   CustomQuestion[]
  rsvps             RSVP[]
  
  // Timestamps
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CLOSED
  COMPLETED
}
```

#### Custom Question Table
```prisma
model CustomQuestion {
  id          String         @id @default(cuid())
  eventId     String
  event       Event          @relation(fields: [eventId], references: [id], onDelete: Cascade)
  question    String
  type        QuestionType   @default(TEXT)
  options     String?        // JSON array for SELECT types
  required    Boolean        @default(false)
  sortOrder   Int            @default(0)
  createdAt   DateTime       @default(now())
}

enum QuestionType {
  TEXT
  SELECT
  MULTI_SELECT
}
```

#### RSVP Table
```prisma
model RSVP {
  id              String      @id @default(cuid())
  eventId         String
  event           Event       @relation(fields: [eventId], references: [id], onDelete: Cascade)
  
  // Guest Information
  name            String
  email           String
  phone           String?
  instagram       String?
  tiktok          String?
  
  // RSVP Details
  status          RSVPStatus  @default(GOING)
  plusOnes        Int         @default(0)
  plusOneNames    String?     // "John, Jane"
  
  // Custom Answers (JSON)
  customAnswers   String?     // {"questionId": "answer"}
  
  // Tracking & Referral
  referralSource  String      @default("DIRECT") // INSTAGRAM, WHATSAPP, SMS, EMAIL, QR_CODE
  qrCode          String      @unique           // For check-in
  
  // Check-in Status
  checkedIn       Boolean     @default(false)
  checkedInAt     DateTime?
  checkedInBy     String?     // Admin user ID
  
  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Indexes
  @@index([eventId])
  @@index([email])
  @@index([qrCode])
}

enum RSVPStatus {
  GOING
  MAYBE
  NOT_GOING
}
```

### 3.2 Admin Interface

#### Event Creation Flow
**Page:** `/admin/events/new`

**Form Fields:**
1. **Event Title** (required)
   - Text input
   - Max 200 characters
   - Placeholder: "Warehouse Party Vol. 3"

2. **Description** (optional)
   - Textarea
   - Rich text or markdown
   - Max 2000 characters

3. **Date & Time** (required)
   - Date picker
   - Time picker (24h format for PH)
   - Timezone: Asia/Manila (auto-set)

4. **Location** (required)
   - Text input with autocomplete
   - "Open in Google Maps" preview button
   - Location URL field (auto-populated)

5. **Flyer Image** (optional)
   - Upload to Vercel Blob
   - Drag & drop support
   - Preview with crop option
   - Max 5MB
   - Formats: JPG, PNG, WebP
   - Recommended: 1080x1350px (4:5 ratio for Instagram)

6. **Capacity Settings**
   - Toggle: "Limited capacity?"
   - If yes: Number input (min 1)
   - Show: "X spots available" on event page

7. **Pricing** (Phase 2)
   - Toggle: "Paid event?"
   - If yes: Amount input + currency selector

8. **Information Collection**
   - Checkbox: "Collect phone number"
   - Checkbox: "Collect Instagram handle"
   - Checkbox: "Allow +1s"
   - Checkbox: "Show public guest list"

9. **Custom Questions**
   - "Add custom question" button
   - Question text input
   - Type: Text / Single Select / Multi Select
   - Required toggle
   - Reorder via drag/drop

10. **Generate Event**
    - "Create Event" button
    - Validation before submit
    - Success: Redirect to event management page with RSVP link

#### Event Management Dashboard
**Page:** `/admin/events/[eventId]`

**Tabs:**

**Tab 1: Overview**
- Event details card (read-only)
- RSVP link with copy button
- QR code for sharing
- Edit event button
- Duplicate event button
- Archive/delete event

**Tab 2: Guest List** (Primary)
- Statistics header:
  - Total RSVPs
  - Going / Maybe / Not Going breakdown
  - Capacity: "78/100 spots filled"
  - Checked in: "45 attended"

- Action bar:
  - Search by name/email
  - Filters: All, Going, Maybe, Not Going, Checked In, Not Checked In
  - Export CSV button
  - "Add Guest" button (manual entry)

- Data table columns:
  - Name
  - Email
  - Phone (if collected)
  - Status (pill badge: green/gray/red)
  - +1s
  - Checked In (toggle switch)
  - Actions: Edit, Delete, View QR Code

- Bulk actions:
  - Select multiple guests
  - Bulk delete
  - Bulk mark as checked in

**Tab 3: Communications**
- "Compose Message" section
- Recipient selector:
  - All guests
  - Going only
  - Maybe only
  - Not checked in
  - Custom selection
- Email composition:
  - Subject line
  - Message body (rich text)
  - Variable preview: {{name}}, {{event_title}}, {{event_date}}
  - Send test to yourself
  - "Send to X recipients" button
- WhatsApp/SMS composition:
  - Message textarea (character counter)
  - Warning: "Only guests with phone numbers will receive"
  - Cost estimate
  - "Send to X recipients" button

**Tab 4: Check-In** (Mobile optimized)
- Large camera view for QR scanning
- Manual search fallback
- Real-time guest list
- Stats: "Checked in: X/Y"
- Sound feedback on successful scan
- "Undo check-in" option
- Export check-in report

#### Manual Add Guest Modal
**Trigger:** "Add Guest" button on Guest List tab

**Form:**
- Name (required)
- Email (required)
- Phone (if event collects it)
- Instagram (if event collects it)
- Status: Going/Maybe/Not Going
- +1 count (if enabled)
- +1 names (if count > 0)
- Custom questions (if configured)
- Referral source: "MANUAL_ADD"
- Submit button

### 3.3 Public Interface

#### Event Landing Page
**URL:** `/events/[slug]` or `/e/[eventId]`

**Layout:**
- Full-width dark background (#0A0A08)
- Max-width content: 680px centered (mobile-first)

**Sections:**

**1. Event Header**
- Flyer image (full width, aspect ratio maintained)
- Event title (font-display, 4xl-6xl responsive)
- Date/Time (font-mono, neon yellow accent)
- Location with map link
- Capacity indicator: "Limited spots: 22 remaining"

**2. Event Description**
- Rendered markdown/rich text
- Links styled with hover effects

**3. RSVP Form**
- Card with subtle border
- Form fields:
  ```
  Name* ..........................
  Email* .........................
  [ ] Phone ...................... (if enabled)
  [ ] Instagram @ ................ (if enabled)
  
  Are you going?*
  [ ] Going  [ ] Maybe  [ ] Can't Go
  
  Bringing guests?* (if enabled)
  [0] [1] [2] [3] [4] [5]
  
  Guest names......................
  (if +1s > 0)
  
  [Custom Questions]
  
  [Submit RSVP] (full width, neon yellow)
  ```

**4. Public Guest List** (if enabled)
- "Who's Going" section
- Avatars or initials grid
- Count: "47 people going"
- "See all" link (opens modal)

**5. Footer**
- "Questions? Contact hello@bodegasound.com"
- Social links

**States:**
- **Before RSVP**: Show form
- **After RSVP**: Show confirmation card
- **Event Full**: "Join waitlist" button
- **Event Past**: "Event completed" message

#### RSVP Confirmation Page
**Content:**
- Success animation (checkmark with confetti option)
- "You're on the list!"
- Event details recap
- QR code (large, scannable)
- "Add to Calendar" buttons (Google, Apple, Outlook .ics)
- "Share Event" buttons:
  - Copy link
  - Share to WhatsApp
  - Share to Instagram Stories (deep link)
- "Your QR Code" section with download button

**Actions:**
- "Edit my RSVP" (change status)
- "Cancel my RSVP"

### 3.4 Check-In Interface

#### Mobile Check-In Page
**URL:** `/admin/checkin/[eventId]`

**Layout (Mobile Optimized):**
- Full-screen camera view
- Overlay: Scanner frame + instructions
- Bottom sheet: Recent check-ins + stats

**Features:**
1. **QR Scanning**
   - Auto-detect QR codes
   - Green overlay + sound on success
   - Red overlay + vibrate on error
   - "Checking in: [Guest Name]" toast

2. **Manual Entry**
   - Search bar (always visible)
   - Type to filter guest list
   - Tap to check in
   - Quick "Undo" button

3. **Stats Bar**
   - "Checked in: X/Y"
   - "Last check-in: Guest Name (2 min ago)"

4. **Offline Support** (Optional)
   - Cache guest list locally
   - Sync when reconnected

#### QR Code Display
**Guest View:**
- Large QR code (min 300x300px)
- Event name below
- Guest name below
- Download as PNG button
- "Screenshot this for easy check-in"

---

## 4. Phase 2: Enhanced Features (Post-MVP)

### 4.1 Animated Invitations

**Concept:** Transform static event pages into immersive experiences

**Options:**

**A. Shader Backgrounds**
- Three.js particle systems
- Noise-based backgrounds
- Color themes: Purple Haze, Neon City, Deep Space
- Performance: 60fps on mobile

**B. GSAP Animations**
- Text reveal on scroll
- Parallax flyer effects
- Micro-interactions on form elements
- Success celebration animations

**C. Interactive Elements**
- Mouse-following glow effects
- Hover-responsive flyer
- Audio visualization (if music playing)

**Implementation:**
- Toggle in event settings: "Enable animations"
- Theme selector if multiple options
- Fallback to static for low-power mode

**Time Estimate:** 2-3 days

### 4.2 Playlist Collaboration

**Features:**
- "Add to Playlist" section on event page
- Spotify integration (OAuth)
- Display requested songs
- Vote up/down on songs
- Export playlist to Spotify before event

**Use Case:**
- "What songs do you want to hear?"
- Crowdsourced playlist curation

### 4.3 Waitlist System

**When capacity reached:**
- "Event is at capacity" message
- "Join waitlist" button
- Collect: Name, Email, Phone
- Auto-promote when spots open
- Email notification: "A spot opened up!"

### 4.4 Photo Gallery

**Post-Event:**
- "Share your photos" upload section
- Grid layout with masonry
- Lightbox viewer
- Moderation in admin
- Download all photos (admin)

### 4.5 Payment Integration

**Stripe Integration:**
- Paid ticket flow
- Ticket generation with QR
- Payment status tracking
- Refund capability
- Receipt emails

---

## 5. Communication Strategy

### 5.1 Email (Resend)

**Setup:**
- From: `hello@bodegasound.com`
- Free tier: 3,000 emails/month

**Email Types:**

**1. RSVP Confirmation**
- Subject: "You're on the list! 🎉"
- Content: Event details, QR code, calendar links
- Template: React component with Bodega branding

**2. Event Reminder**
- Trigger: 24 hours before event
- Subject: "Tomorrow night: [Event Title]"
- Content: Last-minute details, what to bring

**3. Mass Updates**
- Compose in admin
- Send to filtered lists
- Track delivery/open rates

**4. Cancellation**
- If event cancelled
- Refund instructions (if paid)

### 5.2 WhatsApp Strategy

**Why WhatsApp over SMS:**
- 90%+ penetration in Philippines
- Free messages (within app)
- Rich media support (images, locations)
- Group broadcast capability

**Implementation Options:**

**Option A: WhatsApp Business API** (Formal)
- Requires Meta approval
- Official business account
- ~$0.005-0.01 per conversation
- Good for 1000+ messages

**Option B: WhatsApp Groups** (Manual)
- Create event-specific groups
- Invite guests to join
- Manual updates
- Free but time-intensive

**Option C: Click-to-WhatsApp** (Recommended for MVP)
- "Share on WhatsApp" buttons
- Pre-filled message: "Hey! I'm going to Bodega Sound..."
- Guests forward to friends
- Not true mass messaging, but viral sharing

**Phase 1 Recommendation:**
- Use WhatsApp click-to-share for viral spread
- Build WhatsApp Business API for Phase 2 if needed
- Focus on email for official communications

### 5.3 Communication Templates

**Variables Available:**
- `{{guest_name}}`
- `{{event_title}}`
- `{{event_date}}`
- `{{event_time}}`
- `{{event_location}}`
- `{{rsvp_qr_code}}`
- `{{event_url}}`

**Sample Messages:**

**Email Confirmation:**
```
Subject: You're on the list! 🎉

Hi {{guest_name}},

You're confirmed for {{event_title}}!

📅 {{event_date}} at {{event_time}}
📍 {{event_location}}

Show this QR code at the door:
[QR CODE IMAGE]

Add to calendar: [Google] [Apple]
See you on the dance floor!

— The Bodega Sound Team
```

**WhatsApp Share:**
```
I'm going to {{event_title}} on {{event_date}}! 

Join me: {{event_url}}

#BodegaSound #ManilaParties
```

---

## 6. Design System

### 6.1 Visual Identity

**Colors:**
- Background: `#0A0A08` (near black)
- Surface: `#121210` (card backgrounds)
- Border: `#27272a` (subtle dividers)
- Primary: `#E5FF00` (neon yellow)
- Primary Hover: `#F0FF4D` (lighter yellow)
- Text Primary: `#fafafa` (white)
- Text Secondary: `#a1a1aa` (muted)
- Text Muted: `#71717a` (very muted)
- Success: `#22c55e` (green)
- Error: `#ef4444` (red)

**Typography:**
- Display: Bebas Neue (headings, titles)
- Body: Geist Sans (UI text, paragraphs)
- Mono: Geist Mono (data, dates, times)

**Spacing:**
- Mobile padding: 16px
- Desktop padding: 24px
- Section gaps: 32px-64px
- Component gaps: 16px-24px

### 6.2 Components

**Buttons:**
```
Primary: bg-bodega-yellow text-black font-bold uppercase tracking-widest
Hover: scale-105 transition-transform
Disabled: opacity-50 cursor-not-allowed

Secondary: border border-zinc-700 bg-transparent text-white
Hover: bg-zinc-800
```

**Inputs:**
```
Container: bg-zinc-900 border-2 border-zinc-800 rounded-sm
Focus: border-bodega-yellow outline-none
Placeholder: text-zinc-600
Error: border-red-500
```

**Cards:**
```
Container: bg-zinc-900/50 border border-zinc-800 rounded-sm p-6
Hover: border-zinc-700 transition-colors
```

**Status Badges:**
```
Going: bg-green-500/20 text-green-400 border-green-500/30
Maybe: bg-yellow-500/20 text-yellow-400 border-yellow-500/30
Not Going: bg-red-500/20 text-red-400 border-red-500/30
```

### 6.3 Animations

**Page Load:**
- Fade in + slide up (200ms, ease-out)
- Stagger children (100ms delay)

**Interactions:**
- Hover: 150ms transition
- Focus: 200ms transition
- Click: Scale 0.98 on active
- Success: Confetti burst (optional)

**Micro-animations:**
- Form submit: Spinner rotation
- Check-in: Green flash + checkmark pop
- QR scan: Scanner line animation
- Copy link: "Copied!" toast slide in

---

## 7. Technical Implementation

### 7.1 File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── events/
│   │   │   ├── page.tsx              # Event list
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create event
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Event management
│   │   │       └── checkin/
│   │   │           └── page.tsx      # Check-in interface
│   │   └── layout.tsx
│   ├── events/
│   │   └── [slug]/
│   │       └── page.tsx              # Public event page
│   └── api/
│       ├── events/
│       │   ├── route.ts              # CRUD events
│       │   └── [id]/
│       │       ├── route.ts          # Get/update event
│       │       ├── rsvp/
│       │       │   └── route.ts      # Submit RSVP
│       │       └── checkin/
│       │           └── route.ts      # Check-in endpoint
│       └── checkin/
│           └── [rsvpId]/
│               └── route.ts          # QR check-in validation
├── components/
│   ├── events/
│   │   ├── EventForm.tsx             # Create/edit event
│   │   ├── GuestList.tsx             # Admin guest table
│   │   ├── RSVPCard.tsx              # RSVP form card
│   │   ├── CheckInScanner.tsx        # QR scanner
│   │   └── MassEmailComposer.tsx     # Email composition
│   └── ui/
│       └── qr-code.tsx               # QR display component
├── server/
│   └── actions/
│       └── events.ts                 # Server actions
└── lib/
    └── qr.ts                         # QR code generation
```

### 7.2 API Endpoints

**Events:**
```
GET    /api/events              # List all events (admin)
POST   /api/events              # Create event (admin)
GET    /api/events/[id]         # Get event details
PUT    /api/events/[id]         # Update event (admin)
DELETE /api/events/[id]         # Delete event (admin)
```

**RSVPs:**
```
POST   /api/events/[id]/rsvp           # Submit RSVP
GET    /api/events/[id]/rsvps         # List RSVPs (admin)
PUT    /api/events/[id]/rsvps/[rsvpId] # Update RSVP
DELETE /api/events/[id]/rsvps/[rsvpId]  # Delete RSVP
```

**Check-in:**
```
POST   /api/checkin/[rsvpId]    # Check in guest
PUT    /api/checkin/[rsvpId]    # Undo check-in
```

**Communications:**
```
POST   /api/events/[id]/email    # Send mass email
POST   /api/events/[id]/sms      # Send mass SMS
```

### 7.3 QR Code System

**Generation:**
- Library: `qrcode` (npm package)
- Format: SVG or PNG
- Content: `https://bodegasound.com/checkin/[rsvpId]`
- Size: 300x300px minimum
- Error correction: Medium

**Check-in Flow:**
1. Admin opens `/admin/checkin/[eventId]`
2. Camera scans QR
3. Decode rsvpId from URL
4. Validate RSVP exists
5. Mark as checkedIn: true
6. Return guest name
7. Show success feedback

**Backup:**
- Manual search by name/email
- List view with "Check In" buttons
- "Undo" within 30 seconds

### 7.4 File Uploads

**Vercel Blob:**
```typescript
import { put } from '@vercel/blob';

const blob = await put(`events/${eventId}/flyer.jpg`, file, {
  access: 'public',
  contentType: file.type,
});
// blob.url for storage
```

**Validation:**
- Max size: 5MB
- Types: image/jpeg, image/png, image/webp
- Dimensions: Min 600x600px, recommended 1080x1350px

### 7.5 Security

**Authentication:**
- Admin pages: Check ADMIN_PASSWORD cookie
- API routes: Validate session
- Public pages: No auth required

**Rate Limiting:**
- RSVP submissions: 5 per IP per hour
- Email sending: 100 per hour per event
- API requests: Standard Next.js limits

**Validation:**
- Zod schemas for all inputs
- Email format validation
- Phone format (Philippine: +63XXXXXXXXXX)
- XSS protection via React

**Data Protection:**
- Don't expose full guest lists publicly
- Hash sensitive data if needed
- GDPR-compliant data export/deletion

---

## 8. Testing Strategy

### 8.1 Test Scenarios

**Event Creation:**
- [ ] Create event with all fields
- [ ] Upload flyer image
- [ ] Add custom questions
- [ ] Generate RSVP link

**RSVP Flow:**
- [ ] Submit valid RSVP
- [ ] Submit with missing required fields
- [ ] Duplicate email prevention
- [ ] Capacity limit enforcement
- [ ] +1s collection
- [ ] Custom questions answered

**Admin Management:**
- [ ] View guest list
- [ ] Export CSV
- [ ] Manually add guest
- [ ] Edit guest details
- [ ] Delete guest
- [ ] Mark as checked in

**Check-in:**
- [ ] Scan valid QR code
- [ ] Scan invalid QR code
- [ ] Manual check-in
- [ ] Undo check-in
- [ ] Mobile camera access

**Communications:**
- [ ] Send test email
- [ ] Send mass email
- [ ] Email variables render correctly
- [ ] WhatsApp share link works

### 8.2 Device Testing

**Must Test On:**
- iPhone Safari
- Android Chrome
- Desktop Chrome
- Tablet (iPad)

**Mobile-First:**
- Touch targets min 44px
- No horizontal scroll
- Readable text (16px+)
- Fast load on 3G

---

## 9. Deployment Checklist

### Pre-Launch
- [ ] Database migrations run
- [ ] Vercel Blob configured
- [ ] Resend API key set
- [ ] Environment variables configured
- [ ] Admin password set
- [ ] Test events created
- [ ] QR scanning tested on real devices
- [ ] Email templates styled
- [ ] Mobile responsiveness verified
- [ ] Load testing (100 concurrent RSVPs)

### Launch
- [ ] Deploy to Vercel production
- [ ] Create first real event
- [ ] Test end-to-end flow
- [ ] Monitor error logs
- [ ] Check analytics

### Post-Launch
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Document known issues
- [ ] Plan Phase 2 features

---

## 10. Cost Analysis

### Infrastructure (Monthly)

| Service | Cost | Usage |
|---------|------|-------|
| Vercel Pro | $20 | Hosting (optional, free tier works) |
| Neon PostgreSQL | $0 | Free tier sufficient |
| Vercel Blob | $0 | Free tier (250MB) |
| Resend | $0 | Free tier (3,000 emails/month) |
| **Total** | **$0** | **All free tier sufficient!** |

### Usage Estimates

**Scenario: Monthly Party with 200 Guests**
- Emails: 200 RSVP confirmations + 1 reminder = 400 emails
- Storage: 5 event flyers × 500KB = 2.5MB
- Database: 200 RSVPs × 2KB = 400KB

**Well within free limits!**

### Scaling Costs

If you grow beyond free tiers:

| Tier | Cost | Includes |
|------|------|----------|
| Resend | $20/month | 50,000 emails |
| Vercel Blob | $5/month | 1TB storage |
| Neon | $0/month | Still free up to 500MB |

**Affordable even at scale!**

---

## 11. Success Metrics & Analytics

### Track These KPIs:

**Conversion:**
- Event page views → RSVPs rate (target: >15%)
- Form completion rate (target: >80%)
- Abandonment rate (target: <20%)

**Engagement:**
- Average time on event page
- +1s rate (% of guests bringing +1s)
- Referral source breakdown
- Social shares per event

**Operations:**
- Check-in speed (target: <5 seconds per guest)
- Manual check-in rate (should be <10%)
- No-show rate (RSVP vs attended)

**Growth:**
- New vs returning guests
- Email open rates (target: >40%)
- Subscriber conversion (RSVP → newsletter)

### Analytics Implementation:

**Built-in:**
- Database query for all metrics
- Admin dashboard with charts
- Export reports (CSV)

**Optional:**
- Google Analytics for page views
- Resend dashboard for email metrics

---

## 12. Future Roadmap

### Phase 2 (Months 2-3)
- [ ] Animated invite themes
- [ ] Playlist collaboration
- [ ] Waitlist system
- [ ] Photo gallery
- [ ] WhatsApp Business API integration

### Phase 3 (Months 4-6)
- [ ] Payment integration (Stripe)
- [ ] Ticket generation
- [ ] VIP tiers
- [ ] Multi-day events
- [ ] Recurring events (weekly series)

### Phase 4 (Ongoing)
- [ ] Mobile app (PWA)
- [ ] AI-powered capacity forecasting
- [ ] Automated marketing campaigns
- [ ] Integration with ticketing platforms
- [ ] White-label for other collectives

---

## 13. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| QR scanning failures | High | Manual fallback, clear instructions |
| Email deliverability | Medium | Use Resend (good reputation), SPF/DKIM |
| Mobile performance | Medium | Optimize images, lazy load, test on devices |
| Data privacy | High | Clear privacy policy, GDPR compliance, secure storage |
| Abuse/spam RSVPs | Medium | Rate limiting, email verification, CAPTCHA if needed |
| Server overload | Low | Vercel auto-scales, database connection pooling |

---

## 14. Appendices

### A. Sample CSV Export Format

```csv
Name,Email,Phone,Instagram,Status,PlusOnes,PlusOneNames,CheckedIn,ReferralSource,RegistrationDate
John Doe,john@email.com,+639171234567,@johndoe,GOING,2,"Jane Doe,Mike Smith",Yes,INSTAGRAM,2024-03-15T14:30:00Z
```

### B. Email Template Variables

**Available in all templates:**
- `{{guest_name}}` - Full name
- `{{event_title}}` - Event title
- `{{event_date}}` - Formatted date (e.g., "March 15, 2024")
- `{{event_time}}` - Formatted time (e.g., "9:00 PM")
- `{{event_location}}` - Venue name/address
- `{{event_url}}` - Link to event page
- `{{qr_code_url}}` - Direct link to QR code image
- `{{calendar_google}}` - Google Calendar link
- `{{calendar_ics}}` - iCal file download

### C. WhatsApp Deep Link Format

```
https://wa.me/?text=I'm+going+to+Bodega+Sound+on+March+15!+Join+me:+https%3A%2F%2Fbodegasound.com%2Fe%2Fabc123
```

### D. QR Code Specification

- **Format:** URL to check-in endpoint
- **Example:** `https://bodegasound.com/checkin/clk123xyz456`
- **Size:** 300×300px minimum
- **Error Correction:** Level M (15%)
- **Format:** SVG or PNG

---

## 15. Approval & Sign-off

**Ready for Development:** ⏳ Pending Review

**Reviewed By:**
- [ ] Product Owner
- [ ] Lead Developer
- [ ] Designer

**Approved for Implementation:**
- [ ] Phase 1 (Core Features)
- [ ] Phase 2 (Enhanced Features)
- [ ] Phase 3+ (Future)

---

**Document Owner:** Bodega Sound Team  
**Last Updated:** February 16, 2026  
**Next Review:** After Phase 1 Completion
