# Marjahans Jewellery – 2026 Production Architecture Plan

## Executive Summary

Transform landing page into a production-grade luxury jewelry e-commerce platform meeting 2026 standards: high-res imagery with 360° zoom, AR try-on, mobile-first Core Web Vitals (<2.5s LCP), WCAG 2.2 AA accessibility, trust signals, SEO optimization, social integration, and secure e-commerce flow.

---

## 1. Current State vs. Target State

### ✅ Already Good

- Dark luxury aesthetic (gold/black/minimal)
- Responsive grid layout
- Service cards with product images
- Contact form
- Footer with social links

### ❌ Critical Gaps (Must Fix)

| Feature            | Current           | Target                          | Priority |
| ------------------ | ----------------- | ------------------------------- | -------- |
| Image Quality      | 1024px static     | 4K+ with zoom/360°              | P0       |
| Mobile Performance | Not optimized     | LCP <2.5s, CLS <0.1             | P0       |
| Accessibility      | No WCAG audit     | WCAG 2.2 AA full                | P0       |
| Trust Signals      | None              | Reviews, badges, certifications | P0       |
| SEO                | Basic meta        | Structured data, keywords       | P0       |
| Social Integration | Links only        | Live feeds, pixel, share        | P1       |
| E-commerce         | Contact form only | Cart, Stripe, wishlist          | P1       |
| AR                 | None              | Ring try-on placeholder         | P1       |
| Security           | Basic             | HTTPS, GDPR, validation         | P0       |

---

## 2. Data Flow & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser (Client)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Hero Section │  │ Product Grid │  │ Trust Badges │       │
│  │ (Optimized)  │  │ (Zoom/360)   │  │ (Reviews)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ AR Try-On    │  │ Social Feed   │  │ Cart/Checkout│      │
│  │ (Placeholder)│  │ (Instagram)   │  │ (Stripe)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Analytics: Core Web Vitals, Accessibility, Security  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         ↓ API Calls ↓                    ↓ CDN ↓
┌─────────────────────────────────────────────────────────────┐
│                  External Services                           │
├─────────────────────────────────────────────────────────────┤
│  • Stripe API (payments)                                    │
│  • Instagram Graph API (feed)                               │
│  • Facebook Pixel (retargeting)                             │
│  • CDN (image optimization)                                 │
│  • Google Analytics 4 (Core Web Vitals)                     │
│  • Accessibility Scanner (WCAG audit)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Component Responsibilities

### Phase 2: Core Features

| Component              | Responsibility                        | Tech Stack            |
| ---------------------- | ------------------------------------- | --------------------- |
| `ProductZoom.tsx`      | 360° spin, pinch zoom, lazy load      | React + Framer Motion |
| `ImageOptimizer`       | WebP, AVIF, responsive srcset         | Next-gen formats      |
| `AccessibilityWrapper` | ARIA labels, keyboard nav, focus mgmt | Radix UI + custom     |
| `MetaTags.tsx`         | SEO, structured data (JSON-LD)        | React Helmet          |
| `PerformanceMonitor`   | Core Web Vitals tracking              | Web Vitals library    |

### Phase 3: Trust & Conversion

| Component            | Responsibility                        | Tech Stack       |
| -------------------- | ------------------------------------- | ---------------- |
| `ReviewCarousel.tsx` | Verified reviews, star ratings        | Embla Carousel   |
| `TrustBadges.tsx`    | Certifications, "As seen on", returns | Static + dynamic |
| `SocialProof.tsx`    | Live Instagram feed, TikTok embed     | Instagram API    |
| `FacebookPixel.tsx`  | Retargeting, conversion tracking      | Meta Pixel       |

### Phase 4: E-commerce & AR

| Component            | Responsibility                       | Tech Stack    |
| -------------------- | ------------------------------------ | ------------- |
| `ShoppingCart.tsx`   | Add/remove items, quantity, totals   | Zustand state |
| `CheckoutFlow.tsx`   | Stripe integration, order summary    | Stripe.js     |
| `ARTryOn.tsx`        | Ring placement overlay (placeholder) | Canvas API    |
| `WishlistButton.tsx` | Save for later, localStorage         | React hooks   |

---

## 4. Non-Functional Requirements

### Performance (Core Web Vitals)

- **LCP (Largest Contentful Paint)**: <2.5s
  - Strategy: Image lazy-loading, critical CSS, font optimization
- **FID (First Input Delay)**: <100ms
  - Strategy: Code splitting, debounce handlers
- **CLS (Cumulative Layout Shift)**: <0.1
  - Strategy: Fixed image dimensions, skeleton loaders

### Accessibility (WCAG 2.2 AA)

- Alt text on all images (descriptive, not "image")
- Color contrast ≥4.5:1 for text on gold/black
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels for interactive elements
- Screen reader tested (NVDA, VoiceOver)

### Security

- HTTPS enforced (no mixed content)
- Input validation (contact form, search)
- GDPR cookie consent banner
- CSP headers (no inline scripts)
- No sensitive data in localStorage

### SEO

- Meta titles/descriptions with keywords
- Structured data (Product, Review, Organization)
- Sitemap + robots.txt
- Fast indexing (Core Web Vitals signal)
- Open Graph tags for social sharing

---

## 5. Folder Structure Proposal

```
client/src/
├── components/
│   ├── ProductZoom.tsx          (NEW)
│   ├── ReviewCarousel.tsx        (NEW)
│   ├── TrustBadges.tsx           (NEW)
│   ├── ShoppingCart.tsx          (NEW)
│   ├── CheckoutFlow.tsx          (NEW)
│   ├── ARTryOn.tsx               (NEW)
│   ├── SocialFeed.tsx            (NEW)
│   ├── AccessibilityWrapper.tsx  (NEW)
│   ├── MetaTags.tsx              (NEW)
│   ├── PerformanceMonitor.tsx    (NEW)
│   ├── CookieConsent.tsx         (NEW)
│   ├── ServiceCards.tsx          (UPDATED)
│   ├── Hero.tsx                  (UPDATED)
│   └── Footer.tsx                (UPDATED)
├── hooks/
│   ├── useProductZoom.ts         (NEW)
│   ├── useCart.ts                (NEW)
│   ├── useWishlist.ts            (NEW)
│   └── useAccessibility.ts       (NEW)
├── lib/
│   ├── seo.ts                    (NEW)
│   ├── analytics.ts              (NEW)
│   ├── stripe.ts                 (NEW)
│   ├── instagram-api.ts          (NEW)
│   └── validation.ts             (NEW)
├── types/
│   ├── product.ts                (NEW)
│   ├── cart.ts                   (NEW)
│   └── review.ts                 (NEW)
├── styles/
│   ├── accessibility.css         (NEW)
│   └── performance.css           (NEW)
└── pages/
    ├── Home.tsx                  (UPDATED)
    ├── ProductDetail.tsx         (NEW)
    └── Checkout.tsx              (NEW)
```

---

## 6. Implementation Sequence (Shaw Walters Workflow)

### Phase 1: Plan & Research ✅ (Current)

- [x] Identify gaps
- [x] Create architecture
- [ ] Research libraries (see QUESTIONS.md)

### Phase 2: Core Features (Next)

1. Image optimization (WebP, AVIF, lazy-load)
2. Product zoom/360° component
3. Accessibility audit + fixes
4. Core Web Vitals optimization
5. SEO meta tags + structured data

### Phase 3: Trust & Conversion

1. Review carousel (mock data → real)
2. Trust badges + certifications
3. Social feed integration (Instagram API)
4. Facebook Pixel setup

### Phase 4: E-commerce & AR

1. Shopping cart (Zustand state)
2. Stripe integration
3. AR try-on placeholder
4. Wishlist feature

### Phase 5: Code Quality

1. Refactor for clarity
2. Remove redundancy
3. Optimize bundle size

### Phase 6-8: Testing, Security, Production Gate

1. Real-world testing (edge cases, accessibility)
2. Security audit (HTTPS, GDPR, CSP)
3. Performance benchmarks
4. Final verification

---

## 7. Known Risks & Mitigation

| Risk                      | Mitigation                            |
| ------------------------- | ------------------------------------- |
| Image loading delays      | Lazy-load + WebP + CDN caching        |
| Mobile layout shift       | Fixed aspect ratios, skeleton loaders |
| Accessibility failures    | WCAG audit tool + manual testing      |
| Stripe integration bugs   | Sandbox testing, error handling       |
| Instagram API rate limits | Cache feed for 1 hour                 |
| SEO indexing delays       | Sitemap + structured data             |
| GDPR compliance gaps      | Cookie consent + privacy policy       |

---

## 8. Success Criteria

- [ ] Core Web Vitals: LCP <2.5s, CLS <0.1, FID <100ms
- [ ] Accessibility: WCAG 2.2 AA pass (axe DevTools)
- [ ] SEO: All meta tags, structured data, fast indexing
- [ ] E-commerce: Cart → Stripe checkout working
- [ ] Trust: Reviews, badges, social proof visible
- [ ] Security: HTTPS, GDPR consent, input validation
- [ ] Performance: <3MB total bundle, images optimized
- [ ] Mobile: Responsive on all breakpoints, touch-friendly

---

## 9. Timeline Estimate

| Phase     | Tasks              | Est. Time |
| --------- | ------------------ | --------- |
| 1         | Plan & Research    | 1h ✅     |
| 2         | Core Features      | 4h        |
| 3         | Trust & Conversion | 3h        |
| 4         | E-commerce & AR    | 4h        |
| 5         | Code Quality       | 2h        |
| 6-8       | Testing & Gate     | 3h        |
| **Total** |                    | **17h**   |

---

## 10. Dependencies & Versions

**Frontend:**

- React 19.2.1
- Tailwind CSS 4.1.14
- Framer Motion 12.23.22 (animations)
- Zustand 4.x (state management)
- Stripe.js (payments)
- Instagram Graph API (social feed)
- Embla Carousel 8.6.0 (reviews)

**Observability:**

- Google Analytics 4 (Core Web Vitals)
- Sentry (error tracking)
- axe DevTools (accessibility)

---

## 11. Assumptions & Gotchas

1. **Stripe Account**: Assumes business has Stripe account (sandbox for testing)
2. **Instagram Business Account**: Required for Graph API access
3. **Image Assets**: Assumes 4K+ product photos available
4. **GDPR Scope**: Applies if users from EU (cookie consent required)
5. **Mobile Testing**: Must test on real devices (not just browser DevTools)
6. **AR Limitations**: Full AR requires WebGL + device camera permissions

---

## Next Steps

1. Confirm architecture with user
2. Create QUESTIONS.md for ambiguities
3. Begin Phase 2 implementation
4. Track all decisions in CLAUDE.md
