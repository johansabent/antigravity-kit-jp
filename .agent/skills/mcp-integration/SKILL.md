---
name: mcp-integration
description: Guidelines for MCP Server routing and tool deduplication between GitHub and GitKraken.
allowed-tools: Read, Write, Edit, Run Command
---

# MCP Integration Strategy

> Deduplication and precise routing strategy for Git and GitHub workflows.

---

## 1. Core Principle

We use **both** the official GitHub MCP server and the GitKraken MCP server, but with strictly segregated responsibilities to avoid AI hallucination or duplicated capabilities.

| Domain | Provider | Reason |
|--------|----------|--------|
| **Remote Git (GitHub)** | `github-mcp-server` | Official, reliable, feature-rich API for Issues, PRs, and Search without needing a local clone. |
| **Local Git (GitKraken)** | `GitKraken` | Superior local operations (structured status/log/blame) and unique AI hand-off tools via GitLens. |

---

## 2. Tool Routing (What stays enabled)

### `github-mcp-server` (The Social/Remote Layer)
**Enabled:**
- `search_code`, `search_repositories`, `search_issues`, `search_users`
- All PR lifecycle: `get_pull_request`, `list_pull_requests`, `create_pull_request`, `create_pull_request_review`, `merge_pull_request`, `update_pull_request_branch`, etc.
- All Issue lifecycle: `get_issue`, `list_issues`, `create_issue`, `update_issue`, `add_issue_comment`.
- Repo setup: `fork_repository`, `create_repository`

**Disabled (Optional local enforcement):**
- `create_or_update_file`
- `push_files`
*(Disable these if you want the agent to strictly modify files locally and test before pushing via `git_push` rather than bypassing local checks).*

### `GitKraken` (The Local/GitLens Layer)
**Enabled:**
- Local state: `git_status`, `git_log_or_diff`, `git_blame`, `git_branch`, `git_worktree`, `git_checkout`, `git_stash`, `gitkraken_workspace_list`
- Local mutate: `git_add_or_commit`, `git_push`
- GitLens Exclusives: `gitlens_commit_composer`, `gitlens_launchpad`, `gitlens_start_review`, `gitlens_start_work`

**Disabled (The Duplicates):**
- `issues_add_comment`
- `issues_assigned_to_me`
- `issues_get_detail`
- `pull_request_create`
- `pull_request_create_review`
- `pull_request_get_comments`
- `pull_request_get_detail`
- `pull_request_assigned_to_me`
- `repository_get_file_content`

> 🔴 **CRITICAL:** If an agent tries to use an issue or PR tool from GitKraken, they have failed to read this routing document.

---

## 3. When to Update Configuration

The `mcp_config.json` must be updated under the following conditions:

| Trigger | Action |
|---------|--------|
| New tool added to GitHub or GitKraken MCP | Update this document + `disabledTools` in `mcp_config.reference.json` |
| Adding a new AI IDE (Cursor, Windsurf, Zed) | Check its custom MCP path; ensure references use standard format |
| Migrating from Windows → Linux/macOS | Update `GK_BINARY` parsing in IDE or use PATH in reference config |
| GitKraken releases a new GitLens tool | Enable it in the reference config + document it here |
| Adding a new MCP server (e.g. Supabase) | Add its role to this document |

---

## 4. Cross-Platform Path Notes

**Windows (GitKraken / GitLens Ext):**
```json
"command": "%APPDATA%\\User\\globalStorage\\eamodio.gitlens\\gk.exe"
```
*(Or the explicit `C:\\Users\\<user>\\AppData\\Roaming\\...` path depending on IDE support for variables).*

**macOS:**
```json
"command": "/Applications/GitKraken.app/Contents/MacOS/GitKraken"
```
*(Or via path if using the generic `gitkraken` CLI).*

---

## 5. Reference Configuration

See `mcp_config.reference.json` in this folder for the canonical, variable-driven JSON template. Ensure your local or IDE-specific `mcp_config.json` disables the duplicate tools listed above.
