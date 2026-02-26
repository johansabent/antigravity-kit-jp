---
description: End a work session. Run quality gates, push work, and generate a final report.
---

# /end - Session Close

$ARGUMENTS

---

## Purpose

Cleanly wrap up a session by running quality checks, pushing all work, and producing a summary report.

---

## Steps

1. **Quality Gate**:
   - Run `npm run lint` (or project-equivalent) — fix errors.
   - Run `npm test` (or project-equivalent) — ensure tests pass.
   - Remove temporary `console.log` / debug statements.

2. **Git Cleanup**:
   - `git_status` (GitKraken) — check for uncommitted changes.
   - If dirty: `gitlens_commit_composer` (GitKraken) — structured commit.
   - `git_push` (GitKraken) — push to remote.

3. **PR Update** (if a PR exists for current branch):
   - Fetch PR status via GitHub MCP.
   - If no PR exists, ask: "Would you like to create a PR?"

4. **Final Report**:
   ```markdown
   ## ✅ Session Complete

   **Branch:** `<branch>`
   **Commits this session:** <n>
   **PR:** #<number> (<status>) or "No PR"

   ### Summary
   - <bullet list of work done>

   ### Quality
   - Lint: ✅ Pass
   - Tests: ✅ Pass
   - Push: ✅ Synced
   ```

---

## Next Steps

- Review the PR on GitHub if created.
- `/start` to begin a new session.
