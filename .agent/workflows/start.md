---
description: Initialize a work session. Read context, fetch assigned issues, and setup branch.
---

# /start - Session Initialization

$ARGUMENTS

---

## Purpose

Bootstrap a work session by loading project context, checking for assigned work, and preparing the local environment.

---

## Steps

1. **Read Project Context**:
   - Read `GEMINI.md` / `ARCHITECTURE.md` for project rules.
   - Check `.agent/config/bot_preferences.json` exists (prompt setup if missing).

2. **Check Git State**:
   - `git_status` (GitKraken) — ensure clean working tree.
   - `git_log_or_diff` (GitKraken, action="log") — show recent commits.

3. **Fetch Assigned Work**:
   - `list_issues` (GitHub MCP) — filter by assignee `@me`, state `open`.
   - `gitlens_launchpad` (GitKraken) — show PRs needing attention.

4. **Present Summary**:
   ```markdown
   ## 🚀 Session Ready

   **Branch:** `<current-branch>`
   **Status:** Clean / Dirty (<n> uncommitted changes)

   ### 📋 Assigned Issues
   - #<n> — <title> (priority: <label>)

   ### 🔄 PRs Needing Attention
   - PR #<n> — <title> (<status>)

   ### 🤖 Configured Bots
   - gemini-code-assist, copilot
   ```

5. **Ask**: "What would you like to work on?"

---

## Next Steps

- `/git work <issue_url>` — Start working on an issue.
- `/review <pr_number>` — Review a PR.
- `/plan` — Plan a new feature.
