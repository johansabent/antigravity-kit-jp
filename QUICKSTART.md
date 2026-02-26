# AntigravityKIT — Quick Start

> **What is this?** A portable AI agent toolkit. Clone it, drop `.agent/` into your project, and get structured workflows for coding, PR reviews, testing, and deployment.

## Setup

1. **Clone this repo:**
   ```bash
   git clone https://github.com/<your-org>/AntigravityKIT.git
   ```

2. **Copy `.agent/` into your project:**
   ```bash
   cp -r AntigravityKIT/.agent/ /path/to/your-project/.agent/
   ```

3. **Configure bots (first time):**
   ```bash
   cp .agent/config/bot_preferences.example.json .agent/config/bot_preferences.json
   ```
   Edit `bot_preferences.json` to list only the bots installed on your repo.

4. **Configure environment (if needed):**
   ```bash
   cp .env.example .env
   ```

5. **Start working:**
   Type `/start` in your AI editor to begin a session.

## What's Inside

| Folder | Purpose |
|--------|---------|
| `.agent/workflows/` | Slash commands (`/start`, `/end`, `/review`, etc.) |
| `.agent/skills/` | Specialist knowledge modules (clean-code, security, etc.) |
| `.agent/agents/` | Agent personas (frontend, backend, debugger, etc.) |
| `.agent/config/` | Local configuration (bot prefs, not tracked in Git) |

## Command Reference

See [`.agent/WORKFLOWS.md`](.agent/WORKFLOWS.md) for the full command table.

## Key Principle

> **No hardcoded repo names.** All workflows resolve `$REPO_OWNER` and `$REPO_NAME` from `git remote` at runtime, so the toolkit works in any project.
