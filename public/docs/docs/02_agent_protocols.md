# 2026-02-08: Agent Swarm Protocols

This document defines the protocols for the 4 Autonomous Agents working on Bodega Sound.

## GLOBAL SWARM RULES
1.  **Read First:** You must read `docs/progress_log.md` to see what previous agents have built.
2.  **Strict Layers:** Respect the Z-index architecture defined by Agent 1.
3.  **No Hallucinations:** If a dependency isn't installed, ask to install it.
4.  **Log Work:** When finished, append your status to `docs/progress_log.md`.

---

## AGENT 1: THE ARCHITECT (Foundation)
**Mission:** Build the rock-solid stage for the others to perform on.
**Inputs:** None (Greenfield/Repair).
**Outputs:**
-   `src/app/globals.css` (Z-index layers, Theme vars).
-   `src/components/layout/*` (Header, Footer).
-   `tailwind.config.ts` (Bodega Colors).
**Protocol:**
-   **Z-Index Definition:** You are the *only* one allowed to define z-indices. Everyone else uses your classes (`z-background`, `z-overlay`).
-   **Theme:** Define `bodega-black` (#09090b) and `bodega-accent` (#6366f1) in Tailwind.

---

## AGENT 2: THE ATMOSPHERE (Vibe)
**Mission:** Create the "air" we breathe. Neural, fluid, dark.
**Inputs:** `docs/00_master_plan.md` -> Neural Background specs.
**Outputs:**
-   `src/components/ui/neural-background.tsx`
-   Smooth Scroll provider.
**Protocol:**
-   **Performance First:** Your canvas code *must* check for `prefers-reduced-motion`.
-   **Integration:** Your component goes into `z-background` layer (defined by Agent 1).
-   **CPU Budget:** Do not use >10% CPU on idle.

---

## AGENT 3: THE HYPE MAN (Typography)
**Mission:** Announce the brand content with aggression and confidence.
**Inputs:** `docs/00_master_plan.md` -> Kinetic Text specs.
**Outputs:**
-   `src/components/ui/flip-text-reveal.tsx`
-   `src/components/ui/text-reveal.tsx`
**Protocol:**
-   **Mobile First:** If the text overflows on iPhone SE, you have failed. Use `clamp()`.
-   **Accessibility:** All split-text headers must have an `aria-label` with the full text.

---

## AGENT 4: THE STAR (3D Globe)
**Mission:** The Viral Feature. A 3D interactive archive.
**Inputs:** `docs/01_risk_analysis.md` -> Physics constraints.
**Outputs:**
-   `src/components/custom/vinyl-globe.tsx`
**Protocol:**
-   **Data Driven:** Props: `items: { id, url, title }[]`. No hardcoded images.
-   **Layering:** You live in `z-overlay`. You must capture mouse events but let clicks through if they aren't on a vinyl.
-   **Physics:** High inertia. It should feel like a heavy physical object, not a fidget spinner.
