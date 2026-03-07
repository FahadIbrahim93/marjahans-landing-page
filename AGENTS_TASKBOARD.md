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

## Open Risk Register
- Stripe webhook lifecycle remains partially TODO in business flow.
- Bundle size warnings remain; visual work should include chunking pass in separate PR.
