---
description: Unified Git operations routing to GitHub MCP and GitKraken MCP server.
---

# /git - Git & GitHub Operations

$ARGUMENTS

---

## Purpose

The `/git` slash command routes Git and GitHub operations to the correct MCP provider to ensure reliability, avoid duplicates, and utilize powerful AI-handoff tools like GitLens.

> 🔴 **CRITICAL ROUTING RULE:**
> - Local Git mutate/state = **GitKraken** `git_*`
> - AI Worktree/Commits = **GitKraken** `gitlens_*`
> - Remote Issue/PR/Search = **GitHub MCP** `*_pull_request` / `*_issue`

---

## Sub-commands & Routing

### Local Git (GitKraken provider)

Use these commands for local repository state and mutations. The agent should call the specified GitKraken MCP tool.

```
/git status     → git_status (Returns structured tree state)
/git diff       → git_log_or_diff (action="diff")
/git commit     → gitlens_commit_composer (AI-assisted chunking)
/git push       → git_push
```

### AI Developer Handoffs (GitKraken GitLens provider)

Use these for rich AI interactions via GitLens inside VS Code / environments supporting the extension protocol.

```
/git work <issue_url>  → gitlens_start_work (creates branch + linked worktree)
/git review <pr_url>   → gitlens_start_review (creates dedicated review worktree)
/git launchpad         → gitlens_launchpad (prioritizes PRs needing attention)
```

### Remote GitHub (GitHub MCP provider)

Use these commands for social/remote platform integration. DO NOT use GitKraken's issue or PR tools for these.

```
/git pr         → Pre-validate + create_pull_request (see below)
/git issues     → list_issues (GitHub MCP)
/git fork       → fork_repository (GitHub MCP)
```

### `/git pr` — Pre-Validated Pull Request

When `/git pr` is invoked, run this sequence **before** opening the PR:

1. **Collect changed files**: `git_log_or_diff` (GitKraken, action="diff").
2. **Run lint**: Execute the project's lint command (e.g., `npm run lint`).
3. **Run tests**: Execute the project's test command (e.g., `npm test`).
4. **Gate check**:
   - If lint or tests fail → **STOP**. Show errors and ask user to fix.
   - If all pass → proceed.
5. **Push**: `git_push` (GitKraken).
6. **Create PR**: `create_pull_request` (GitHub MCP) with a generated description.
7. **Re-trigger bots**: Read `.agent/config/bot_preferences.json` and post a comment mentioning each configured bot.

---

## Execution Flow Example

When you receive a complex prompt like "Fix issue 12 and open a PR", follow this exact tool chain:

1. **Context:** `get_issue` (GitHub MCP) to understand the issue.
2. **Setup:** `gitlens_start_work` (GitKraken) to link a local branch.
3. **Write Code:** Edit files locally using standard filesystem tools.
4. **Commit:** `gitlens_commit_composer` (GitKraken) for structured commits.
5. **Sync:** `git_push` (GitKraken).
6. **PR:** `create_pull_request` (GitHub MCP).

---

## Output Format

The agent should summarize the actions clearly after execution.

```markdown
## 📝 Git Workflow Complete

**Action:** Created Pull Request
**Status:** ✅ Successfully pushed local branch and opened PR #42.

### Steps
1. Mapped issue context (GitHub)
2. Started worktree `fix/issue-42` (GitKraken GitLens)
3. Chunked commits automatically (GitKraken GitLens)
4. Opened PR (GitHub)

[View PR on GitHub](https://github.com/...)
```
