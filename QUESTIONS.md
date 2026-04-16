# Clarification Questions – Marjahans 2026 Production Audit

## Critical Business Questions

1. **E-commerce Scope**: Should the site have a full shopping cart + checkout, or is this a lead-gen landing page with "Contact for Order" flow?
   - Assumption: Full e-commerce with Stripe (can be adjusted)

2. **Product Catalog**: How many products will be in the initial catalog? (Affects database schema decision)
   - Assumption: 20-50 products (can start with mock data, migrate to backend later)

3. **Inventory Management**: Do you need real-time inventory tracking, or is this manual?
   - Assumption: Manual for MVP (can add automated later)

4. **Shipping**: Will you handle shipping calculations, or is this a "contact for quote" model?
   - Assumption: Contact for quote (simpler MVP)

---

## Technical Questions

5. **Backend Requirement**: The current project is static (no backend). Should I:
   - a) Keep it static and use third-party APIs (Stripe, Instagram) only?
   - b) Upgrade to `web-db-user` feature for backend database + Stripe integration?
   - Recommendation: Upgrade to `web-db-user` for production-grade e-commerce

6. **Image Assets**: Do you have 4K+ product photos? If not, should I:
   - a) Generate more via AI?
   - b) Use placeholder high-res images?
   - Assumption: Use existing + generate where needed

7. **Instagram Integration**: Do you have a Business Account with Graph API access?
   - Assumption: Yes (or can set up during implementation)

8. **AR Try-On**: Should this be:
   - a) Placeholder UI (visual mockup)?
   - b) Functional WebGL ring overlay?
   - Assumption: Placeholder for MVP (functional later)

9. **Reviews Source**: Should reviews come from:
   - a) Facebook comments (auto-pull)?
   - b) Manual input?
   - c) Third-party review platform (Trustpilot)?
   - Assumption: Manual input for MVP

10. **SEO Keywords**: What are your top 5 target keywords?
    - Examples: "affordable luxury jewelry", "gold necklaces online", "diamond rings Bangladesh"
    - Assumption: Will use generic luxury jewelry keywords

---

## Compliance & Legal Questions

11. **GDPR Scope**: Are you targeting EU users?
    - Assumption: Yes (cookie consent required)

12. **Certifications**: Do you have gemstone/purity certifications to display?
    - Assumption: Yes (will add placeholder badges)

13. **Return Policy**: What's your return window (30/60/90 days)?
    - Assumption: 30-day returns

14. **Privacy Policy**: Do you have one? Should I create a template?
    - Assumption: Will create template

---

## Performance & Scale Questions

15. **Expected Traffic**: What's your target monthly visitors?
    - Assumption: <10k/month (static site sufficient)

16. **Mobile-First Priority**: Is mobile conversion more important than desktop?
    - Assumption: Yes (jewelry shopping is increasingly mobile)

17. **Accessibility Audience**: Do you have users with disabilities?
    - Assumption: Yes (WCAG 2.2 AA is standard)

---

## Timeline & Budget Questions

18. **Launch Date**: When do you need this live?
    - Assumption: ASAP (17-hour implementation)

19. **Maintenance**: Who will manage content updates (products, reviews, images)?
    - Assumption: You will (will create admin guide)

20. **Ongoing Support**: Will you need monitoring/alerts for downtime?
    - Assumption: Basic (can add Sentry later)

---

## Answers to Proceed (Required)

Please confirm or clarify:

- [ ] Full e-commerce (cart + Stripe) or lead-gen landing page?
- [ ] Upgrade to `web-db-user` backend feature?
- [ ] Do you have Instagram Business Account?
- [ ] Target keywords for SEO?
- [ ] Do you have product certifications/badges?
- [ ] EU users (GDPR required)?

**Default Assumptions (if no response):**

- Full e-commerce with Stripe
- Upgrade to web-db-user
- Instagram API integration
- Generic luxury jewelry keywords
- GDPR compliance enabled
- 30-day return policy

---

## Notes for Implementation

- All decisions will be logged in CLAUDE.md
- If ambiguity arises during coding, will pause and ask for clarification
- Prioritizing user safety, data privacy, and accessibility over feature count
- Will deliver production-ready code (no stubs, no TODOs)
