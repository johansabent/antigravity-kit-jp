---
description: Review and resolve PR comments, threads, and bot feedback systematically. Includes automated bot re-trigger.
---

# /review - PR Review & Resolution

$ARGUMENTS

---

## Purpose

Systematically read, analyze, and resolve all comments, threads, and CI feedback on a Pull Request. This is the single command for the full PR review lifecycle.

> [!NOTE]
> This workflow handles both **read-only** summaries and **active resolution** of PR feedback.

---

## Prerequisites

- GitHub MCP authenticated (`gh auth status`)
- Bot preferences configured (`.agent/config/bot_preferences.json`)
  - If missing, the agent will prompt: "Which bots do you use?" and create the config.

---

## Phase 1: Fetch & Summarize

1. **Get PR details** using GitHub MCP `get_pull_request`.
2. **Get all review comments** via `get_pull_request_comments`.
3. **Get reviews** (approvals, change requests) via `get_pull_request_reviews`.
4. **Get CI status** via `get_pull_request_status`.
5. **Present a summary** using emoji tagging:
   - 🔴 **BLOCKING**: Issues that prevent merge
   - 🟡 **SUGGESTION**: Improvements worth considering
   - 🟢 **NIT**: Minor style/naming suggestions
   - ❓ **QUESTION**: Clarifications needed

---

## Phase 2: Resolve (if requested)

When the user says "resolve", "fix", or "address":

1. **Analyze each unresolved thread**:
   - Understand the suggested change.
   - Apply the fix locally in the codebase.
2. **Run local verification**:
   - Lint check (`npm run lint` or project-specific).
   - Test check (`npm test` or project-specific).
3. **Commit & Push**:
   - Use GitKraken `gitlens_commit_composer` for structured commits.
   - Use GitKraken `git_push`.
4. **Reply to threads** on GitHub:
   - Use `add_issue_comment` or PR review reply to confirm resolution.

---

## Phase 3: Re-trigger Bot Reviews

After pushing fixes, automatically re-trigger configured bots:

1. **Read bot config** from `.agent/config/bot_preferences.json`.
2. **Post trigger comment** on the PR using `add_issue_comment`.
3. **Only mention bots listed in the config** — never guess.

> [!IMPORTANT]
> If `.agent/config/bot_preferences.json` does not exist, **stop and ask the user**:
> "Which AI review bots do you have installed on this repo? (e.g., gemini-code-assist, copilot)"
> Then create the config file before proceeding.

---

## Output Format

```markdown
## 📋 PR Review Summary — PR #<number>

**Status:** <CI status>
**Reviews:** <count> reviews, <unresolved> unresolved threads

### 🔴 Blocking (must fix)
- [ ] <description> — File: `path/to/file.ts:L42`

### 🟡 Suggestions (should fix)
- [ ] <description> — File: `path/to/file.ts:L18`

### 🟢 Nits (nice to fix)
- [ ] <description>

### ❓ Questions (need answer)
- [ ] <question> — by @reviewer

### 🤖 Bot Re-trigger
- Mentioned: @gemini-code-assist /review
```

---

## Next Steps

### ✅ On Success

All threads resolved, CI passing, bots re-triggered.

**Recommended:**

- `/git push` if not already pushed.
- Wait for bot re-review results.
- Merge when all checks pass.

### ❌ On Failure

Cannot resolve a specific thread or CI keeps failing.

**Troubleshooting:**

- Check if the PR is targeting the correct base branch.
- Run `/debug` on failing tests.
- Manually respond to threads that require human judgment.
