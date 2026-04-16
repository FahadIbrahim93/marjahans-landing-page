# Codebase Issue Audit: Proposed Tasks

This audit proposes one focused task each for typo cleanup, bug fixing, documentation alignment, and test quality improvement.

## 1) Typo / copy consistency task

**Task:** Standardize brand spelling (`Jewellery` vs `jewelry`) in user-facing copy, prioritizing pages where the brand name appears.

**Why this is needed:** The repository mixes both spellings in prominent user-facing/docs text. Even if both are valid English variants, this reads like inconsistent copy and appears typo-like in a single-brand product.

**Evidence:**

- British spelling in project title (`Marjahans Jewellery`).
- US spelling appears in product/marketing copy in multiple components and docs.

**Suggested acceptance criteria:**

- Agree on one canonical brand spelling.
- Apply that spelling consistently across README and UI copy.
- Keep technical terms unchanged where needed (e.g., external API field names).

## 2) Bug fix task

**Task:** Replace generic `Error` throws in `chatRouter` catch blocks with structured `TRPCError` responses (or preserve typed causes), so callers receive actionable error codes/messages.

**Why this is needed:** Current handlers log the root error then throw a new generic error string, which hides cause and makes handling/retries harder.

**Evidence:**

- `startConversation`, `getConversation`, `sendMessage`, and other procedures catch errors and throw generic messages like `Failed to ...`.

**Suggested acceptance criteria:**

- Use `TRPCError` with appropriate codes (`INTERNAL_SERVER_ERROR`, `NOT_FOUND`, etc.).
- Preserve the original cause for observability.
- Update tests to assert code + message shape.

## 3) Code comment / documentation discrepancy task

**Task:** Update stale testing claims in project docs (`16 tests passing`) to reflect the current suite and status.

**Why this is needed:** The TODO/docs indicate that a completed test suite has 16 passing tests, but the repository now contains many more tests; this can mislead contributors about project quality and scope.

**Evidence:**

- `todo.md` marks "Comprehensive test suite (16 tests passing)" as completed in multiple places.
- README also states "16+ unit tests".

**Suggested acceptance criteria:**

- Replace fixed test counts with either current accurate counts or a command-driven statement (e.g., "run `pnpm test` for current status").
- Ensure all docs use consistent phrasing for test coverage claims.

## 4) Test improvement task

**Task:** Make `server/chat-router.test.ts` deterministic by mocking the `chat-db` module or wiring an isolated test database fixture.

**Why this is needed:** The test suite currently assumes database availability through router callers, which makes tests fail when DB/environment is absent and mixes unit/integration concerns.

**Evidence:**

- Chat router tests call `appRouter.createCaller` and exercise DB-backed procedures directly without explicit db mocking/setup.
- The route implementation depends on `chat-db` functions that throw when DB is unavailable.

**Suggested acceptance criteria:**

- Unit tests run green without external DB/network.
- Integration tests (if kept) are isolated in a separate suite and gated by explicit env flags.
- CI defaults to deterministic unit tests.
