# Bodega Sound - Website Audit & Build Plan

**Date:** 2026-02-08  
**Auditor:** Code Review  
**Status:** Functional but incomplete - needs refinement

---

## 1. CURRENT STATE OVERVIEW

### What's Working Well:

- **Hero Section**: The flip-text reveal on "BODEGA SOUND" is impactful and on-brand
- **Smooth Scroll**: Lenis integration provides premium feel
- **Color System**: Bodega yellow (#E5FF00) against dark backgrounds is strong
- **Typography**: Bebas Neue for headlines creates the right "underground" vibe
- **Section Structure**: Clear hierarchy with good spacing
- **Motion**: Framer Motion implementations are smooth

### What's Missing/Problematic:

- **TextReveal Component**: Currently has broken implementation with line breaks causing issues
- **No Neural Background**: Missing the "Bass BCN" atmosphere planned in master docs
- **Placeholder Content**: Multiple sections show "Image coming soon" placeholders
- **Non-functional Buttons**: CTA buttons don't navigate anywhere
- **No Actual Content**: Events are static data, no real images loaded
- **Missing 3D Globe**: Agent 4 component was removed (user decision)
- **Audio Player**: Present but unclear if functional

---

## 2. VIBE ASSESSMENT

### Current Vibe Score: 6/10

**What captures the vibe:**

- Dark, moody aesthetic
- Yellow accent pops
- Typography hierarchy
- Smooth animations

**What's missing the vibe:**

- Too much empty placeholder space
- Static content feels generic
- No ambient atmosphere (missing neural background)
- Feels like a template, not a living collective

### Brand Alignment:

**Target:** "Manila's underground dance music collective. Secret locations. 2 AM energy."  
**Current:** Professional but safe. Needs more grit, more mystery, more exclusivity.

---

## 3. CRITICAL ISSUES

### A. TextReveal Component (BROKEN)

**Location:** `src/components/ui/text-reveal.tsx:20-23`  
**Issue:** The manifesto text has mixed types (strings and objects) causing TypeScript/runtime errors  
**Fix:** Standardize to string array or handle href separately

### B. Missing Navigation Pages

**Missing routes:**

- `/archive` - Linked in header but doesn't exist
- `/events` - Linked in header but doesn't exist
- `/about` - Linked in header but doesn't exist

### C. Non-functional CTAs

**Buttons that do nothing:**

- "ENTER THE VOID" - Hero CTA
- "VIEW ARCHIVE" - Hero secondary
- "SECURE YOUR SPOT" - Event ticket
- All "ADD TO CART" - Merch buttons
- "JOIN THE LIST" - Header button

### D. Image Placeholders Everywhere

**Sections with no real images:**

- Next Event ("COMING SOON" placeholder)
- Past Events (gradient backgrounds only)
- YouTube (gradient backgrounds only)
- Merch (yellow placeholder boxes)

---

## 4. IMPROVEMENT RECOMMENDATIONS

### Phase 1: Fix Critical Issues (High Priority)

#### 1. Fix TextReveal

```tsx
// Remove mixed types, use simple strings
lines={[
  "WE ARE THE VIBRATION OF THE STREETS.",
  "A COLLECTIVE OF SOUND ARCHITECTS",
  "BUILDING THE FUTURE OF BASS CULTURE.",
  "JOIN THE MOVEMENT."
]}
```

#### 2. Create Missing Pages

- `/about` - Story of the collective, founders, mission
- `/events` - All events listing (not just next)
- `/archive` - Full past events with photos/videos

#### 3. Wire Up CTAs

- "ENTER THE VOID" → Scroll to NextEventSection
- "VIEW ARCHIVE" → Navigate to /archive
- "SECURE YOUR SPOT" → External ticket link (Eventbrite/Typeform)
- "ADD TO CART" → Google Form or Shopify integration

### Phase 2: Content & Polish (Medium Priority)

#### 4. Add Real Content

**Immediate needs:**

- Event photos from Contrabanda I-IV
- YouTube video embeds (not placeholders)
- Merch product photos
- Team/founder photos for About page

#### 5. Implement Neural Background

**Reference:** Master plan calls for "Bass BCN" atmosphere  
**Implementation:** Canvas-based flow field or particle system  
**Location:** Behind hero or as ambient background  
**Performance:** Must respect `prefers-reduced-motion`

#### 6. Add Micro-interactions

- Button hover states (currently basic)
- Page transitions
- Loading states for forms
- Cursor effects on interactive elements

### Phase 3: Experience Enhancements (Low Priority)

#### 7. Exclusivity Elements

- Password-protected archive section
- "Secret location" reveal on ticket purchase
- Members-only content area
- Newsletter exclusive tracks/mixes

#### 8. Mobile Optimization

- Test TextReveal on mobile (scroll container issues)
- Simplify animations on low-power devices
- Touch-friendly interactions

#### 9. SEO & Performance

- Add OpenGraph images
- Lazy load images below fold
- Add structured data for events
- Optimize font loading (Bebas Neue)

---

## 5. BUILD PLAN

### Sprint 1: Foundation (Week 1)

- [ ] Fix TextReveal component
- [ ] Create /about, /events, /archive pages
- [ ] Wire up all CTA buttons
- [ ] Add basic routing

### Sprint 2: Content Injection (Week 2)

- [ ] Collect and add event photos
- [ ] Embed real YouTube videos
- [ ] Add merch product images
- [ ] Write About page copy

### Sprint 3: Atmosphere (Week 3)

- [ ] Implement neural background (Agent 2 feature)
- [ ] Add ambient sound (optional)
- [ ] Refine animations
- [ ] Add loading states

### Sprint 4: Polish (Week 4)

- [ ] Mobile testing & fixes
- [ ] SEO optimization
- [ ] Performance audit
- [ ] Accessibility review

---

## 6. VIBE RECOMMENDATIONS (Quick Wins)

### To Make It Feel More "Underground":

1. **Grain overlay** - Subtle film grain on dark backgrounds
2. **VHS effects** - On video thumbnails, slight distortion
3. **Secret text** - Hidden messages in negative space
4. **Glitch effects** - Occasional text glitches on hover
5. **Noise texture** - Background noise instead of pure black

### To Make It Feel More Exclusive:

1. **Counter** - "XXX people on the list" counter
2. **Sold out badges** - On past events
3. **Limited drops** - Countdown timers for merch
4. **Member testimonials** - Quotes from attendees
5. **Behind the scenes** - Candid photos, not just pro shots

### To Make It Feel More Alive:

1. **Instagram feed** - Live embed of recent posts
2. **Now playing** - What track is currently playing in the office
3. **Weather** - Manila weather widget (irrelevant but adds life)
4. **Live counter** - "XX people viewing this page"
5. **Recent activity** - "Someone just joined from Tokyo"

---

## 7. TECHNICAL NOTES

### Dependencies to Consider:

- `next-cloudinary` - For image optimization
- `@studio-freight/lenis` - Already installed, ensure latest
- `framer-motion` - Already installed, good coverage
- `three` + `@react-three/fiber` - For 3D if revisited

### Performance Concerns:

- TextReveal component uses 400vh scroll container (heavy)
- No image optimization currently
- No lazy loading on sections
- Canvas animations need CPU budget monitoring

### Accessibility Issues:

- Missing alt text on decorative elements
- No skip navigation link
- Form inputs need better labeling
- Color contrast on warm-400 text

---

## 8. CONCLUSION

**Verdict:** The foundation is solid but the site feels like a sophisticated prototype rather than a living, breathing collective. The design system is strong, but content is the missing piece.

**Priority:** Focus on content first (Phase 2), then atmosphere (Phase 3). Don't add more features until the existing ones work properly.

**Risk:** Without real photos and stories, the site will continue to feel generic regardless of how many animations are added.

**Recommendation:** Get real content (photos, videos, stories) before implementing neural background or advanced features. Content is king; everything else is decoration.

---

## 9. NEXT ACTIONS

1. **Immediate** (Today): Fix TextReveal, test all buttons
2. **This Week**: Create /about page with real copy
3. **This Month**: Source and add all event photos
4. **Next Month**: Implement neural background if budget allows

**Budget estimate:** 2-3 weeks of focused work to reach "production-ready" status.
