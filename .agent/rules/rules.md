---
trigger: always_on
---

# AI Core Governance Rules

> [!IMPORTANT]
> **READ THIS FIRST.** These rules apply to EVERY action you take.

## 1. Zero-Trust Verification
* **Never assume code works.** After every edit, you must explicitly verify it.
* **Backend:** Run a relevant test or script to prove functionality.
* **Frontend:** You cannot rely on "it should work." Verify the build or component render.
* **No Placeholders:** Do not leave "TODO" or placeholder code unless explicitly instructed.

## 2. Visual Proof (UI/UX)
* **Screenshots Required:** If you modify the UI (CSS, Layout, Components), you MUST provide a visual proof (screenshot).
* **Design Quality:** Changes must match the existing "Premium/Industrial" aesthetic. No generic browser-default styles.

## 3. Code Quality Standards
* **TypeScript:** No `any` types. Use proper interfaces.
* **Error Handling:** All async operations must have try-catch blocks.
* **Safety:** Ensure database types match Prisma schema exactly.

## 4. Communication & Honesty
* **Be Honest:** If a tool fails, admit it. Do not hallucinate success.
* **Show Your Work:** When reporting "Done," explain *how* you verified it.
* **Progress Tracking:** Use checkboxes (`[ ]` vs `[x]`) for all task lists.