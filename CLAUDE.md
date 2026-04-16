# CLAUDE.md – Decision Log & Lessons Learned

## Project: Marjahans Jewellery – 2026 Production Audit

### Decisions Made

#### 1. Architecture Choice

- **Decision**: Full e-commerce with Stripe integration (not lead-gen only)
- **Rationale**: User requirement: "E-commerce flow: clean cart, Stripe/PayPal, inventory alerts, wishlist, upsell"
- **Implication**: Requires backend database (will upgrade to web-db-user)
- **Date**: 2026-02-26

#### 2. Backend Upgrade

- **Decision**: Upgrade from web-static to web-db-user feature
- **Rationale**: Need persistent storage for cart, orders, reviews, products
- **Implication**: Enables Stripe integration, database, backend API routes
- **Date**: 2026-02-26

#### 3. Image Optimization Strategy

- **Decision**: Use CDN-hosted images with WebP + AVIF formats, lazy-loading
- **Rationale**: Core Web Vitals requirement: LCP <2.5s
- **Implication**: All product images must be optimized before upload
- **Date**: 2026-02-26

#### 4. Accessibility Approach

- **Decision**: WCAG 2.2 AA compliance (not AAA)
- **Rationale**: AA is standard for e-commerce; AAA is excessive for MVP
- **Implication**: Alt text, color contrast, keyboard nav, ARIA labels required
- **Date**: 2026-02-26

#### 5. Social Integration

- **Decision**: Instagram Graph API for live feed, Facebook Pixel for retargeting
- **Rationale**: User requirement: "Social: Instagram feed embed, TikTok video carousel, share buttons, Facebook Pixel"
- **Implication**: Requires Instagram Business Account + Pixel setup
- **Date**: 2026-02-26

#### 6. AR Try-On

- **Decision**: Placeholder UI for MVP (functional WebGL later)
- **Rationale**: Full AR requires significant dev time; placeholder proves concept
- **Implication**: Will add "Coming Soon" label, collect feedback for Phase 2
- **Date**: 2026-02-26

#### 7. Review Source

- **Decision**: Manual input for MVP (can auto-pull from Facebook later)
- **Rationale**: Facebook Graph API for reviews requires additional permissions
- **Implication**: Will create admin panel for review management
- **Date**: 2026-02-26

#### 8. SEO Keywords

- **Decision**: Target keywords: "affordable luxury jewelry", "gold necklaces online", "diamond rings Bangladesh", "handcrafted jewelry", "luxury jewelry Dhaka"
- **Rationale**: Align with brand positioning + geographic targeting
- **Implication**: Will optimize meta tags, structured data, content
- **Date**: 2026-02-26

#### 9. GDPR Compliance

- **Decision**: Full GDPR compliance enabled (cookie consent, privacy policy, data handling)
- **Rationale**: User may have EU visitors; better to be compliant from start
- **Implication**: Cookie banner required, privacy policy template needed
- **Date**: 2026-02-26

#### 10. Performance Budget

- **Decision**: LCP <2.5s, CLS <0.1, FID <100ms (Core Web Vitals targets)
- **Rationale**: Google ranking signal + user experience
- **Implication**: Strict image optimization, code splitting, lazy-loading required
- **Date**: 2026-02-26

---

## Lessons Learned (Do Not Repeat)

### ❌ Mistake 1: Placeholder Components

**What Happened**: Initial design had emoji icons in service cards (placeholder).
**Problem**: Looked unprofessional, didn't showcase product quality.
**Fix**: Replaced with real product images from Facebook + AI-generated luxury photography.
**Lesson**: Do not ship placeholders. Always use real assets or generate high-quality ones.

### ❌ Mistake 2: No Accessibility Consideration

**What Happened**: Hero section had white text on light background (contrast issue).
**Problem**: Failed WCAG contrast requirements, hard to read.
**Fix**: Switched to dark background with white text (4.5:1+ contrast).
**Lesson**: Accessibility is not optional. Test contrast ratios early.

### ❌ Mistake 3: Static Image Sizes

**What Happened**: All images were 1024px (same size for all devices).
**Problem**: Wasted bandwidth on mobile, slow LCP on slow networks.
**Fix**: Implement responsive images with srcset, WebP, lazy-loading.
**Lesson**: Optimize images for device size and network speed from the start.

### ❌ Mistake 4: No SEO Meta Tags

**What Happened**: Landing page had no meta descriptions or structured data.
**Problem**: Search engines couldn't understand product details.
**Fix**: Added JSON-LD structured data, meta tags with keywords.
**Lesson**: SEO is not an afterthought. Implement from day 1.

### ❌ Mistake 5: No Security Considerations

**What Happened**: Contact form had no input validation.
**Problem**: Vulnerable to XSS, injection attacks.
**Fix**: Added input validation, sanitization, GDPR consent.
**Lesson**: Security is not optional. Validate all user input.

---

## Assumptions & Gotchas

### Assumption 1: Instagram Business Account

- **Assumption**: User has Instagram Business Account with Graph API access
- **Gotcha**: If not, will need to set up (takes 24-48 hours for API approval)
- **Mitigation**: Will provide setup guide if needed

### Assumption 2: Stripe Account

- **Assumption**: User has Stripe account (or will create one)
- **Gotcha**: Stripe requires business verification (takes 1-2 days)
- **Mitigation**: Will use Stripe test keys for development

### Assumption 3: Product Images

- **Assumption**: 4K+ product photos available
- **Gotcha**: If not, AI-generated images may not match real products
- **Mitigation**: Will use AI-generated luxury jewelry photos as placeholder

### Assumption 4: EU Users

- **Assumption**: User may have EU visitors (GDPR applies)
- **Gotcha**: GDPR violations can result in fines
- **Mitigation**: Implementing full GDPR compliance from start

### Assumption 5: Mobile-First Priority

- **Assumption**: Mobile traffic is primary (jewelry shopping is mobile-heavy)
- **Gotcha**: Desktop features might be overlooked
- **Mitigation**: Testing on real devices (not just browser DevTools)

---

## Production Readiness Checklist

- [ ] Phase 1: Architecture & Planning ✅
- [ ] Phase 2: Core Features (images, zoom, accessibility, performance)
- [ ] Phase 3: Trust & Conversion (reviews, badges, social, pixel)
- [ ] Phase 4: E-commerce & AR (cart, Stripe, wishlist, AR placeholder)
- [ ] Phase 5: Code Quality (refactor, remove slop, optimize)
- [ ] Phase 6: Real-world Testing (edge cases, accessibility, integration)
- [ ] Phase 7: Production Gate (security, performance, observability)
- [ ] Phase 8: Final Verification (zero-defect close)

---

## Known Issues & TODOs

### P0 (Blocking)

- [ ] Upgrade project to web-db-user feature (required for backend)
- [ ] Implement image optimization (WebP, AVIF, lazy-load)
- [ ] Add WCAG 2.2 AA accessibility fixes
- [ ] Implement Core Web Vitals optimization

### P1 (High Priority)

- [ ] Set up Stripe integration
- [ ] Add Instagram Graph API integration
- [ ] Implement shopping cart + checkout flow
- [ ] Add review carousel with real data

### P2 (Medium Priority)

- [ ] AR try-on placeholder UI
- [ ] Facebook Pixel setup
- [ ] TikTok video carousel
- [ ] Wishlist feature

### P3 (Nice to Have)

- [ ] Admin panel for content management
- [ ] Email notifications
- [ ] Loyalty program
- [ ] Product recommendations

---

## Next Steps

1. Confirm with user: Full e-commerce vs. lead-gen?
2. Upgrade to web-db-user feature
3. Begin Phase 2: Core Features implementation
4. Track all changes in this file
5. Deliver production-ready code (zero slop policy)
