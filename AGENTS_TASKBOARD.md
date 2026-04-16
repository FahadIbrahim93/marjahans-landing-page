# AGENTS + TASKBOARD (Execution Source of Truth)

## Vision
Ship a premium, reliable full-stack e-commerce experience while keeping Manus as main-branch owner and support work isolated in secondary branches.

## Execution Rules
- No direct support-branch merge to `main`.
- No UI-only changes that break auth/API/data flows.
- No env-coupled tests in default unit suite.

## Taskboard

| ID | Task | Owner | Depends On | Status | Acceptance Criteria |
|---|---|---|---|---|---|
| T-001 | Stabilize auth URL fallback for local/dev rendering | codex | none | completed | Home page renders without OAuth env crash |
| T-002 | Introduce deterministic chat router unit tests | codex | none | completed | Chat tests pass without DB |
| T-003 | Replace env-coupled Facebook tests with mocked API tests | codex | none | completed | Facebook tests pass without real token/network |
| T-004 | Standardize chat router error surface to TRPCError | codex | none | completed | Router throws typed errors + preserves cause |
| T-005 | Run typecheck + full tests and capture evidence | codex | T-002/T-003/T-004 | completed | `pnpm check` and `pnpm test` both green |
| T-006 | Handoff summary for Manus merge review | codex | T-005 | completed | PR message includes risk + verification evidence |
| T-007 | Implement Stripe webhook order-status persistence | codex | none | completed | Webhook events map to DB status updates by payment intent |
| T-008 | Add Stripe webhook unit coverage for event mapping | codex | T-007 | completed | Webhook tests pass without external Stripe/DB |
| T-009 | Operationalize autonomous workflow runbook + single-command sweep | codex | none | completed | `pnpm qa:sweep` executes check/test/build sequentially |
| T-010 | Attempt external skill source installation (obra/superpowers) | codex | none | blocked | Install succeeds or blocker documented with fallback |
| T-011 | Harden Stripe webhook trust boundary (signature verification + non-public handler) | codex | T-007/T-008 | pending | Verified Stripe signature path with negative tests for spoofed payloads |
| T-012 | Replace analytics HTML placeholders with runtime-gated injection | codex | none | pending | No malformed analytics URL logs when env vars are missing |
| T-013 | Add CI quality gates (lint + coverage threshold + audit fallback) | codex | T-009 | pending | CI fails on lint/coverage/security policy violations |
| T-014 | Build performance optimization (route-level chunking + budget gate) | codex | none | pending | Main JS bundle below agreed budget and build check enforced |

## Open Risk Register
- Bundle size warnings remain; visual work should include chunking pass in separate PR.
- External GitHub skill source currently blocked by network policy (403 tunnel).
