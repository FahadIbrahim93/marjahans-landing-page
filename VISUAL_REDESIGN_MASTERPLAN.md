# Visual Redesign Masterplan (Support Branch Plan for Manus Integration)

## Context
This plan focuses on **visual modernization only** while keeping all data/API/business logic untouched, so work can safely complement Manus-managed main-branch engineering.

## Reference-Inspired Direction
Based on the two v0 templates provided (Lenis-style modern landing + shader-heavy hero), the target visual language is:
- cinematic gradients and depth layering,
- premium motion (subtle, not noisy),
- bold typography with high contrast,
- immersive hero with ambient interactive background,
- smooth section-to-section visual continuity.

## Non-Negotiables
1. No breaking changes to tRPC procedures, DB contracts, auth, or payments.
2. Visual changes must be additive/isolated in UI components and CSS tokens.
3. Reduced-motion users get a calm fallback experience.
4. Every visible iteration includes screenshots + build/typecheck validation.

## Execution Phases

### Phase 1 — Foundation (Completed in this branch)
- Keep existing interactive particle hero background.
- Introduce reusable "cinematic surface" section treatments (glow, blur, border, depth).
- Apply cohesive visual rhythm to core sections (Hero, Collections, Social Proof, Contact, Footer).

### Phase 2 — Motion System
- Add unified motion timings/easings tokens in CSS.
- Replace ad-hoc per-component animation snippets with shared classes.
- Add scroll reveal only where it doesn't cause layout shift.

### Phase 3 — Layout Polish
- Add premium spacing scale and section transitions.
- Improve card hierarchy, hover affordances, and content emphasis.
- Tighten responsive behavior for mobile-first consistency.

### Phase 4 — Visual QA + Hardening
- Lighthouse + Core Web Vitals check.
- Accessibility contrast and reduced-motion verification.
- Bundle impact review for all visual additions.

## Taskboard (Visual Track)
- [x] Add immersive animated hero background.
- [x] Define visual governance and branch workflow docs.
- [x] Build section-level cinematic styling primitives.
- [ ] Standardize animation utilities across all major components.
- [ ] Improve product listing/detail visual consistency with home page language.
- [ ] Add micro-interactions for cart/wishlist/state transitions.
- [ ] Performance pass (animation/frame budget + bundle warnings).
- [ ] Accessibility pass (contrast/focus/motion preferences).

## Handoff to Manus
- These changes are UI-only and intended for low-risk merge.
- Data flow, API calls, and business logic behavior are intentionally unchanged.
