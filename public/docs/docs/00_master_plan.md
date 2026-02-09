# 2026-02-08: Master Implementation Plan - Bodega Sound

## Goal Description
Create a highly interactive, "artsy," and progressive web experience for **Bodega Sound**. The goal is to make users feel "wow, excited, interesting, and part of the movement."
We will integrate:
1.  **Kinetic Typography:** High-impact text reveals.
2.  **Atmospheric Backgrounds:** Fluid, neural-like motion (Canvas).
3.  **Interactive 3D Elements:** A spinning globe of "vinyls/photos" representing the community.
4.  **Premium Feel:** Smooth scrolling and playful micro-interactions.

## Component Architecture

### [NEW] `src/components/ui/neural-background.tsx`
- **Purpose**: The "Bass BCN" vibe. A canvas-based flow field animation.
- **Props**: `color`, `speed`, `density`.

### [NEW] `src/components/ui/flip-text-reveal.tsx`
- **Purpose**: "Blaed Agency" vibe. Kinetic text for the main Hero header ("BODEGA SOUND").
- **Features**: 3D character flipping, responsive sizing.

### [NEW] `src/components/ui/text-reveal.tsx`
- **Purpose**: Scroll-triggered text reveal for storytelling sections.

### [NEW] `src/components/custom/vinyl-globe.tsx`
- **Purpose**: "Becky Entertainment" vibe.
- **Implementation**: A React Three Fiber scene rendering a sphere of "Cards" or "Vinyls".
- **Interactivity**: Mouse drag to rotate, click to expand/view.

### [NEW] `src/components/custom/playful-button.tsx`
- **Purpose**: "Displaay" vibe.
- **Features**: variable border radius on hover, "squishy" click effect.

## Phases
1.  **Foundation**: Setup, Z-index architecture, Theme.
2.  **Atmosphere**: Neural Background, Smooth Scroll.
3.  **Typography**: Kinetic Text components.
4.  **The Star**: 3D Vinyl Globe.
