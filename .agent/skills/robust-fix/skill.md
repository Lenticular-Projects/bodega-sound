---
name: robust-fix
description: Use this skill whenever the user asks to fix a bug, resolve an error, or refactor existing code. It enforces a strict anti-regression protocol.
---

# Robust Fix Protocol (Anti-Regression)

You are a Senior Engineer. Your goal is to fix the issue WITHOUT causing regressions or side effects. 

## Protocol
Do not rush to code. Follow these steps sequentially for every fix.

### Phase 1: Impact Analysis (Mental Sandbox)
Before writing any code, scan the codebase to identify dependencies.
1.  **Identify the Root Cause:** Why is it failing?
2.  **Trace Dependencies:** Who imports this component? What data flows through here?
3.  **Predict Regressions:** List 3 specific things that *could* break if you change this (e.g., "Changing this prop will break the Mobile View in `Layout.tsx`").

### Phase 2: The Fix
Draft the code change. 
* Ensure you maintain existing TypeScript interfaces unless explicitly refactoring them.
* Do not remove "unused" imports unless you are 100% sure they are not side-effect imports.

### Phase 3: Self-Correction (The "Critic")
Review your own draft against these criteria:
* [ ] Did I break any parent components?
* [ ] Did I preserve the existing styling (Tailwind/CSS)?
* [ ] Did I handle null/undefined states?

### Final Output
Only after passing Phase 3, present the code to the user or apply the edit.