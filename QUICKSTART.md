# AntigravityKIT — Quick Start

> A portable, security-hardened AI agent toolkit. One command installs structured workflows, specialist agents, and skills into any project.

## Install

```bash
npx @jpsabent/ag-kit
```

Or install globally and reuse across projects:

```bash
npm install -g @jpsabent/ag-kit
ag-kit
```

This downloads only the `.agent/` folder from this repo into your current directory. No other files are touched.

> **Windows note:** Requires Git Bash, WSL, or a shell with `tar` available (bundled with Git for Windows).

---

## First Session — Required

After install, paste this prompt into your AI editor (Gemini, Cursor, Windsurf, Copilot, etc.):

```
Read .agent/rules/GEMINI.md and all referenced files.
Then create every editor config file needed for this editor
(e.g. .cursorrules, .windsurfrules, .clinerules) so all
workflows and agents are active from your next response. Also ask me which languages should you talk to me, comment, and post on github, so you can update the workflows and files
```

The agent will read the framework, create the appropriate hook files, and confirm which agents and workflows are loaded.

---

## What's Inside

| Folder | Purpose |
|---|---|
| `.agent/workflows/` | Slash commands (`/start`, `/end`, `/review`, `/debug`, etc.) |
| `.agent/skills/` | Specialist knowledge modules (security, clean-code, testing, etc.) |
| `.agent/agents/` | Agent personas (frontend, backend, debugger, PM, etc.) |
| `.agent/rules/` | Core protocol (`GEMINI.md`) — the AI reads this first |
| `.agent/config/` | Local configuration (not tracked in Git) |

## Key Principle

> **No hardcoded repo names.** All workflows resolve `$REPO_OWNER` and `$REPO_NAME` from `git remote` at runtime — the toolkit works in any project out of the box.
