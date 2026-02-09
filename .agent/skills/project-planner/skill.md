---
name: project-planner
description: ACTIVATION TRIGGER: Use this skill when the user asks to "plan", "architect", "start a feature", "create a build plan", "scope a project", or "review post-launch".
---

# Project Planning & Architecture Protocol

## 1. Documentation & Build Workflow (Section 5)

### Folder Structure
When creating plans, you MUST use this structure:
* `/docs/build-plans/` (Roadmaps)
* `/docs/qa-checklists/` (Corresponding QA files)
* `/docs/implementation/` (Technical Specs)

### The QA Sync Rule
**CRITICAL:** For every build plan (e.g., `BUILD_PLAN_WEEK1.md`), you MUST create a matching QA file (`QA_WEEK1.md`).
* Check for existing QA files before starting work.
* The QA file must include: Feature Checklist, Verification Steps, Priority Levels.

### Build Plan Requirements
Every plan must contain:
1.  **Executive Summary** (What & Why)
2.  **Phase Breakdown** (Week-by-week)
3.  **Technical Specs** (DB changes, APIs)
4.  **Risk Mitigation** (What could go wrong?)

## 2. Scope Boundaries (Section 9)

### The "3 Tiers" Decision Matrix
When asking for changes, classify them:
* **Tier 1 (Must Fix):** Blocks main feature? -> **Fix Immediately.**
* **Tier 2 (Should Fix):** Touching same files? -> **Include it.**
* **Tier 3 (Out of Scope):** Global/Architecture change? -> **Separate Project.**

## 3. One-Shot Execution Protocol (Section 11)

**Goal:** Execute complex tasks (3+ hours) in one attempt.

### Phase A: Deep Research (Internal Monologue)
Before writing code, you must:
1.  **File Discovery:** Use `glob` to find all relevant files.
2.  **Dependency Mapping:** Who relies on this code?
3.  **Data Verification:** Check actual DB schema and API endpoints.

### Phase B: Comprehensive Plan
Create a `## EXECUTION PLAN` section in your response:
* **Files to Modify:** Specific paths and line numbers.
* **Risks:** Top 3 failure points.
* **Verification:** How will you prove it works?

### Phase C: Execution
* Get user approval on the Plan.
* Execute flawlessly without stopping for minor questions.

## 4. Post-Launch & Feedback (Section 10)

### Issue Resolution Protocol
1.  **Triage:** Can it be fixed in <30 mins? (Fix now). Complex? (New Plan).
2.  **The "One Week Review":** 7 days after launch, check error logs and verify success criteria.