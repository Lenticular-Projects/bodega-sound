# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # ESLint
npx prisma migrate dev   # Run database migrations (PostgreSQL)
```

No test runner is configured.

## Architecture

**Next.js 16 App Router** project for Bodega Sound, a DJ collective/event brand in Manila. Uses React 19, TypeScript strict mode, Tailwind CSS 3.

### Page composition pattern

Page files in `src/app/` are **composition only** (max 50 lines). They import and arrange section components — no state or logic. See `src/app/page.tsx` for the canonical example: Hero → TextReveal → SpinningLogo → NextEvent → PartyGallery → PastEvents → YouTube → Merch → Newsletter → AudioPlayer.

### Key directories

- `src/components/ui/` — Primitives (Button, Card, Tabs, plus WebGL `lumina-interactive-list.tsx`)
- `src/components/{feature}/` — Domain sections organized by feature (hero, gallery, archive, events, media, shop, newsletter, audio, contact)
- `src/lib/animations.ts` — Framer Motion presets. **All animation timing must be imported from here**, never inline.
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `src/types/events.ts` — Shared `EventData` interface
- `src/components/icons.tsx` — Carbon icon re-exports. **Only icon source allowed.**
- `src/data/events.ts` — Event definitions + derived `gallerySlides` for the Lumina component
- `src/server/actions/` — Next.js Server Actions

### Path alias

`@/*` maps to `src/*`

## Strict Design Rules (`rules.md`)

The project follows "VIBE BASE CONSTITUTION v1.3". These are **hard constraints**, not suggestions:

### Icons: Carbon only
- Import exclusively from `@/components/icons` (which re-exports `@carbon/icons-react`)
- **Banned**: lucide-react, @heroicons, react-icons, or any other icon library

### Typography
- `font-sans` (Geist Sans) for UI text, `font-mono` (Geist Mono) for code/data, `font-display` (Bebas Neue) for headlines
- Never use serif, system-ui, or Arial

### Styling: Tailwind only
- **No CSS modules**, no inline `style={{}}` props
- Use semantic color names (`text-foreground`, `bg-card`, `text-muted-foreground`) — never raw hex in className
- Corner radius: `rounded-sm` or `rounded-none` for cards, `rounded-md` max for buttons. No `rounded-xl`/`rounded-full`.
- No neon glows or colored shadows. Use `shadow-sm` or `shadow-elevation-{1,2,3}`.
- Merge classes with `cn()` from `@/lib/utils`

### Animation: "Languid Luxury"
- Micro-interactions: 300ms ease-out
- Entrances: 800ms ease-out or cubic-bezier [0.23, 1, 0.32, 1]
- Stagger: 100ms between children
- **Never**: durations under 200ms, linear easing
- Always import presets from `src/lib/animations.ts` — no inline `transition={{ duration: ... }}`

### Type safety
- **Banned**: `any`, `as any`, `@ts-ignore`, `@ts-expect-error`
- Explicit return types on exported functions
- Prefer `interface` over `type` for object shapes
- Zod validation for all API/AI responses before UI use

### AI integration
- Never import `GoogleGenerativeAI` in `.tsx` files
- Never expose `process.env.GOOGLE_API_KEY` outside `lib/gemini.ts` or server actions
- All AI outputs must pass Zod schema validation

### Theme
- Light mode default via next-themes
- Primary accent: bodega-yellow (#E5FF00)

### Component sizing
- Page files: max 50 lines
- Components: split at 250+ lines
- Functions: extract at 50+ lines
- Props drilling past 3 levels → use Context or Server Action

## Key Components

**Lumina Interactive List** (`src/components/ui/lumina-interactive-list.tsx`) — WebGL shader-based image slider using Three.js + GSAP. Accepts `slides: LuminaSlide[]`, `mode: "full" | "minimal"`, and optional `config`. Uses IntersectionObserver to pause when off-screen. Main page uses `mode="minimal"`, demo page at `/lumina-demo` uses `mode="full"`.

## Environment

```
DATABASE_URL=...                        # PostgreSQL (Neon/Prisma)
RESEND_API_KEY=...                      # Email via Resend
BLOB_READ_WRITE_TOKEN=...               # Vercel Blob storage
ADMIN_PASSWORD=...                      # Admin session secret
DOOR_PASSWORD=...                       # Door worker session secret
NEXT_PUBLIC_APP_URL=...                 # Public app URL
```

## To-Do List & Outstanding Work

A living to-do list lives at `docs/to-do-list/`. **Always check this folder when starting a session.**

- `docs/to-do-list/security-hardening.md` — Security items from the 2026-02-20 audit. Items marked `[ ]` are not yet done. When the user says they completed something, update the checkbox to `[x]` and note the date.

**Pending critical item:** The rate limiter in `src/lib/rate-limit.ts` uses an in-memory `Map` which resets on every Vercel cold start, making it ineffective. It must be replaced with Upstash Redis (`@upstash/ratelimit` + `@upstash/redis`). Do not claim rate limiting is functional until this is done. Env vars needed: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## Z-Index Hierarchy

Defined as CSS custom properties in `globals.css`: background (-10) → base (0) → content (10) → overlay (20) → header (50) → popover (100) → grain (9999). Use Tailwind classes like `z-content`, `z-header`, `z-overlay`.
