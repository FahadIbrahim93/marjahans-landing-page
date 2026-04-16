# Principal Engineering Audit Report (CTO Visibility)

Date: 2026-03-10  
Branch: `work`

## Stage 1 — Plan & Research (Evidence-first)

### Method
- Reviewed architecture, runtime entrypoints, and core business routers.
- Executed verification gates (`pnpm check`, `pnpm test -- --run`, `pnpm build`) and captured warnings/failures.
- Attempted security audit (`pnpm audit --prod`) and captured environment blocker.
- Performed browser smoke pass and screenshot artifact capture (`home-audit.png`) while noting runtime console/server errors.

### Hard evidence summary
- Test suite currently passes: 9 files / 82 tests.
- Build passes but emits critical warnings (undefined analytics env placeholders + oversized JS chunk).
- Security audit is currently blocked in this environment by npm audit endpoint 403.
- Home page runtime logs show malformed analytics URL requests and chat settings failure when DB is unavailable.

---

## Scorecard (Brutally Constructive)

| Dimension | Score (/10) | Why this score (factual) |
|---|---:|---|
| Code quality & structure | 7.0 | Strong TypeScript strict mode and layered tRPC structure; however, several server modules still use `any`, generic `Error` throws, and weakly typed payloads in payment/chat flows. |
| Readability & maintainability | 6.5 | Code is generally navigable, but duplicated docs/plans and stale claims create drift; multiple TODO placeholders remain in user-facing/runtime paths. |
| Performance & scalability | 5.5 | Production bundle emits >500kB chunk warning; no code-splitting strategy visible for heavy pages/components. |
| Security best practices | 5.0 | Webhook handler is exposed as a public tRPC mutation with no signature verification in router path; env validation is permissive and falls back silently in critical places. |
| Test coverage & reliability | 7.0 | Deterministic unit tests improved substantially and pass consistently; however, there is no enforced coverage threshold/reporting gate and limited integration/e2e coverage. |
| Architecture & modularity | 7.0 | Clear client/server/shared separation and composable routers; yet payment/auth/chat concerns still leak through public procedures and ad-hoc error contracts. |
| Compliance & standards readiness | 4.5 | README claims WCAG/PCI/Core Web Vitals compliance as completed, but there is no automated evidence pipeline (a11y/lighthouse/security scans) to support those assertions. |
| Team collaboration readiness | 8.0 | Taskboard, runbook, logbook, and collaboration docs are present and usable; branch governance and handoff model are explicit. |
| Business alignment (luxury e-commerce goals) | 7.0 | Product discovery/cart/checkout/chat/Facebook sync are present; biggest gap is production hardening for trust-critical payment and analytics reliability. |
| DevEx & CI maturity | 6.5 | `qa:sweep` exists and improves consistency; missing lint gate, coverage gate, dependency vulnerability gate, and release checklist automation. |
| Observability & operations | 4.5 | Heavy reliance on `console.*`, no structured logs/trace IDs/alerting standards documented; runtime warnings show noisy and avoidable operational failures. |

**Overall weighted posture:** **6.3 / 10** (functional and progressing, not yet CTO-safe for “10/10 production-grade” claims).

---

## High-priority findings (P0/P1)

### P0 — Payment webhook trust boundary is weak
- `stripe.handleWebhook` is a **publicProcedure** accepting arbitrary `{type, data}` payloads and updates order payment status from input event type without Stripe signature verification at this boundary.
- Impact: event spoofing risk, order/payment state corruption.
- Required: move webhook handling to a dedicated Express route with raw-body signature verification (`stripe.webhooks.constructEvent`) and make tRPC mutation internal-only or remove it.

### P0 — Analytics script placeholder can trigger malformed request path
- `client/index.html` injects `%VITE_ANALYTICS_ENDPOINT%/umami` directly; when env is missing, build/dev logs show unresolved placeholders and malformed URI sequence.
- Impact: noisy logs, potential 400/500 noise, observability pollution, avoidable runtime errors.
- Required: conditionally include analytics script at runtime only when env vars are valid.

### P1 — Docs overclaim compliance/performance/testing evidence
- README states WCAG/PCI/Core Web Vitals “✅” and fixed test counts despite no automated compliance or current-count validation gate.
- Impact: credibility risk with stakeholders; auditability mismatch.
- Required: replace hard claims with measured CI artifacts and date-stamped reports.

### P1 — Chat settings path fails hard when DB unavailable
- `getChatSettings()` throws when DB is not available; router catches and returns INTERNAL error, causing repeated log noise during home loads.
- Impact: degraded UX resilience in preview/dev and operational noise.
- Required: explicit safe fallback path in server chat settings query for non-critical widget config.

### P1 — Bundle size regression risk
- Build output shows a minified JS chunk around ~584kB.
- Impact: poor initial load/interaction on low-end/mobile networks.
- Required: route-level dynamic imports and manual chunk strategy for feature-heavy pages.

---

## Technical debt register

1. Security: webhook verification boundary not enforced in router-level flow.
2. Observability: no structured logging contract; only console logging.
3. Quality gates: no lint script, no coverage threshold, no automated a11y/perf/security CI gates.
4. Documentation drift: duplicated strategy/audit docs with stale or unverifiable assertions.
5. Runtime resilience: analytics/chat behavior not robust under missing env/DB.
6. Typing debt: `any` usage in persistence and router edges weakens safety.

---

## Best possible plan to reach 10/10 (time-boxed)

### Week 1 (Stability + Trust)
1. **Harden Stripe webhook path (P0)**
   - Add `/api/stripe/webhook` raw-body route + signature verification.
   - Restrict/remove public tRPC webhook mutation.
   - Add replay and invalid-signature tests.
2. **Fix analytics injection (P0/P1)**
   - Replace HTML placeholder script with runtime-gated component.
   - Add tests for env-missing and env-present branches.
3. **Chat settings graceful degradation (P1)**
   - Return defaults when DB unavailable; lower noise severity.

### Week 2 (Performance + Quality Gates)
4. **Chunking/perf pass (P1)**
   - Split admin/chat/heavy feature modules via dynamic imports.
   - Set build budget check in CI.
5. **Quality gate expansion**
   - Add `lint` script + CI enforcement.
   - Enable coverage provider + threshold (start at 80%, ratchet upward).
   - Add baseline a11y smoke checks (axe/playwright).

### Week 3 (Compliance + Operational maturity)
6. **Evidence-driven compliance docs**
   - Replace static claims with generated artifacts and “last verified” dates.
7. **Observability baseline**
   - Structured logging utility with request IDs and error taxonomy.
8. **Release readiness checklist**
   - Rollback notes, env matrix validation, dependency audit policy.

---

## Risks / unknowns / blockers

- External vulnerability audit tooling currently blocked by npm endpoint policy (403); must run in CI runner with allowed egress.
- Production traffic profile unavailable; performance targets are inferred from static bundle warnings, not RUM.
- Stripe operational constraints (idempotency strategy, webhook retry policy) need explicit acceptance from product/ops owners.

---

## Visual scrutiny summary (UX/brand)

What is working:
- Hero visual direction is premium and distinctive; particle background adds modern ambience.
- Sections are coherent and brand-consistent with dark/luxury palette.

What is not production-ready:
- Runtime noise from analytics placeholder and chat settings failures harms perceived polish.
- Performance warning indicates potential first-load sluggishness, undermining luxury feel on mobile.
- No visual regression testing baseline; risk of unintended style regressions is high.

Recommended visual hardening:
- Add reduced-motion and frame-budget tests for particle hero.
- Add visual snapshot tests for key breakpoints and dark theme.
- Gate merges on screenshot diffs for hero/cart/product pages.

---

## Self-reflection (anti-LARP)

Assumptions made:
- Compliance claims are unverified unless backed by CI artifacts.
- Current passing tests represent unit confidence, not full production confidence.

Evidence that work is real:
- Typecheck/tests/build executed successfully in this environment.
- Browser run produced screenshot artifact and runtime error logs exposing real operational defects.
- Security audit command attempted and failed with explicit 403 response (recorded blocker).

