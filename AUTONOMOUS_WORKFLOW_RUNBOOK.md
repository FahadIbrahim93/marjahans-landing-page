# Autonomous Workflow Runbook (Codex Support Branch)

This runbook operationalizes the project's autonomous execution policy in a deterministic, repeatable sequence.

## External Skill Source Status

Attempted source: `https://github.com/obra/superpowers/issues`

Result in this environment:

- GitHub access is blocked (`CONNECT tunnel failed, response 403`).
- Automatic install via `skill-installer` and git fallback both failed.

Action taken:

- Applied the same workflow principles locally through this runbook + executable QA sweep script.
- Continue using built-in skills and repository-native standards until external access is restored.

## Stage Pipeline (Mandatory Order)

1. **Plan & Risk Framing**
   - Define tasks in `AGENTS_TASKBOARD.md` with dependencies and acceptance criteria.
   - Record assumptions and unknowns before implementation.

2. **Implement in Small, Atomic Slices**
   - One objective per commit.
   - No placeholders/TODO-only diffs for critical paths.

3. **Verification Gate (Execution Required)**
   - Run all three commands in order:
     - `pnpm check`
     - `pnpm test -- --run`
     - `pnpm build`
   - Persist outcomes in `EXECUTION_LOGBOOK.md`.

4. **Refactor + De-slop**
   - Remove dead/commented code and duplicate patterns.
   - Tighten naming and error semantics.

5. **Production Readiness Sweep**
   - Confirm no secrets hardcoded.
   - Confirm no environment-coupled test assumptions in default suite.
   - Confirm rollback-safe commit boundaries.

6. **Handoff to Manus (Main Branch Owner)**
   - Provide risk summary, evidence, and merge sequencing notes.

## Non-Negotiable Rules

- Never merge directly to `main` from support branches.
- No environment-coupled tests in default CI run.
- Every change must include executable evidence in terminal output.
- Frontend visual changes require screenshot artifacts.

## Fast Execution Command

Use:

```bash
pnpm qa:sweep
```

This command executes typecheck, tests, and build in one strict sequence.
