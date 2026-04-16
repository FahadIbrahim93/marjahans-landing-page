# Collaboration Workflow (Manus + Secondary Contributors)

This project uses a two-tier collaboration model to keep `main` stable and make contributor handoffs predictable.

## Roles and Ownership

- **HEAD ADMIN (Manus AI):**
  - Sole owner of `main` branch management.
  - Final reviewer for merge approval and release decisions.
  - Guardian of production quality gates.

- **Secondary Contributors (including Codex):**
  - Work only in secondary branches.
  - Deliver scoped PRs for Manus to review.
  - Never push directly to `main`.

## Branching Model

- `main` → **Protected and Manus-only** (no secondary contributor direct push/merge).
- `work` (or Manus-managed integration branch) → Optional staging branch controlled by Manus.
- `codex-dev` → Codex support branch for feature/fix work.

### Contributor branch naming

Use this format:

`<agent-tag>/<scope>/<short-description>`

Examples:
- `codex/feat/hero-animation-tuning`
- `codex/fix/chat-error-shape`
- `codex/docs/testing-alignment`

## Pull Request Protocol

Every PR from a secondary contributor must include:

1. **Context:** Why this change is needed for product/business goals.
2. **Scope:** Files touched and explicit non-goals.
3. **Risk:** Runtime risk, migration risk, and rollback plan.
4. **Evidence:** Commands run + outputs (typecheck, build, tests).
5. **UI proof:** Screenshot for any visible frontend change.
6. **Handoff notes:** What Manus should verify before merge.

## Merge Policy

- Manus is the final approver for any change entering `main`.
- Only Manus performs final merge actions into `main`.
- If CI fails, PR is blocked until resolved.
- If tests are environment-coupled, PR must document exact prerequisites.
- No "follow-up later" for critical security or payment correctness issues.
- Preferred branch protections (Git host settings): require PRs, block force-push, and restrict `main` push access to Manus/admin role only.

## Commit and Review Hygiene

- Use clear, scoped commit messages.
- Keep commits logically grouped and easy to revert.
- Prefer small PRs with one primary objective.
- If a PR introduces technical debt, it must include a tracked remediation item.

## Handoff Template (copy into PR description)

```md
## Handoff to Manus (HEAD ADMIN)
- Primary objective completed:
- What changed:
- Validation performed:
- Known risks:
- Rollback approach:
- Recommended merge order (if dependent PRs exist):
```

