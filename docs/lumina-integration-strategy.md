# Lumina Integration Strategy

## 1. Component Overview
The [`LuminaInteractiveList`](../src/components/ui/lumina-interactive-list.tsx) is a premium, interactive React component that displays a vertical list of items. Hovering/clicking on items triggers a sophisticated WebGL distortion effect on the background image using `three.js` and `gsap`.

**Key Features:**
- **WebGL Distortion:** Liquid-like transitions between images.
- **Interactive List:** Hover states trigger text animations.
- **Responsive:** Adapts to viewport size (needs verification on mobile).

## 2. Current Implementation Status
- **Location:** `src/components/ui/lumina-interactive-list.tsx`
- **Demo Page:** `src/app/lumina-demo/page.tsx` (accessible at `/lumina-demo`)
- **Styling:** Custom CSS injected into `src/app/globals.css` under "Lumina Interactive List Styles".
- **Dependencies:** 
  - `gsap` (loaded via CDN in component)
  - `three.js` (loaded via CDN in component)
  - **Note:** Scripts are dynamically loaded to avoid heavy initial bundle size, but this valid React pattern requires `use client`.

## 3. Integration Plan for Main Site
The goal is to move this from a demo page to a core part of the **Bodega Sound** experience, likely replacing the current events list or serving as a hero feature.

### A. Content Strategy
- **Imagery:** 
  - Mix of **Real Event Photos** (crowds, DJs, vibes).
  - **AI-Generated Art** (abstract, futuristic, "Nano Banana Pro" style).
- **Text:**
  - **Title:** Event Name or Date.
  - **Description:** Short, punchy tagline or location.

### B. Aesthetic & Polish
- **Transition Smoothness:**
  - *Current Issue:* The animation can be "jerky" at the very end of the transition cycle.
  - *Fix:* Tuning the `gsap` easing functions and `three.js` distortion parameters in the component code.
- **Typography:**
  - Ensure headings use `Bebas Neue` (Display) and body text uses the site's default sans-serif.

## 4. Technical Handoff Notes for Next Agent
1. **Component Path:** `src/components/ui/lumina-interactive-list.tsx`
2. **Configuration:** The `SLIDER_CONFIG` object inside the `useEffect` controls all animation parameters (intensity, speed, distortion).
3. **Data Source:** Currently hardcoded in the `slides` array. This should be refactored to accept props:
   ```typescript
   interface Slide {
     title: string;
     description: string;
     media: string; // URL
   }
   interface LuminaProps {
     items: Slide[];
   }
   ```
4. **Performance:** Monitor memory usage with WebGL contexts. Ensure proper cleanup (`renderer.dispose()`) if the component unmounts (currently handled in cleanup function but verify).

## 5. Next Steps
1. Refactor component to accept `props`.
2. Tune animation parameters to fix "jerkiness".
3. Integrate into `src/app/page.tsx` or `src/app/events/page.tsx`.
