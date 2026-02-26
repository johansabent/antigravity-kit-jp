# Antigravity Kit JP

> AI Agent templates with Skills, Agents, and Workflows — **johansabent's fork** of [vudovn/antigravity-kit](https://github.com/vudovn/antigravity-kit)

[![Release](https://img.shields.io/github/v/release/johansabent/antigravity-kit-jp?style=flat-square&label=release)](https://github.com/johansabent/antigravity-kit-jp/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![CodeQL](https://img.shields.io/badge/CodeQL-passing-brightgreen?style=flat-square)](https://github.com/johansabent/antigravity-kit-jp/actions/workflows/codeql.yml)
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-blue?style=flat-square)](docs/security/AUDIT_REPORT.md)

## What's Different in This Fork

This fork adds a **professional security layer** on top of the upstream project:

- 🔒 **Security fixes** for CWE-78 (command injection), CWE-693 (missing HTTP security headers), CWE-200 (secrets in repo), CWE-798 (hardcoded credentials)
- 🤖 **GitHub Actions CI/CD** — CodeQL, dependency review, secret scanning, lint, and automated releases
- 📋 **Dependabot** — weekly automated dependency updates
- 📄 **Security policy & audit docs** — full vulnerability disclosure process and remediation log

See [CHANGELOG.md](CHANGELOG.md) for the full release notes.

## Quick Install

```bash
npx @vudovn/ag-kit init
```

Or install globally:

```bash
npm install -g @vudovn/ag-kit
ag-kit init
```

> **Note:** The CLI tool is provided by the upstream project. This fork focuses on security hardening and CI/CD additions rather than publishing its own npm package.

This installs the `.agent` folder containing all templates into your project.

### ⚠️ Important Note on `.gitignore` and AI Editors
All major AI-powered editors (**Cursor**, **Windsurf**, **VS Code + Gemini/Copilot**, **JetBrains AI**) respect `.gitignore` when indexing your repository for AI context.

If you add the `.agent/` folder to your `.gitignore`, the AI IDE will **not** be able to index the included workflows, agents, and skills. This will result in slash commands (like `/plan`, `/debug`) failing to appear or function correctly.

**Recommended Solution:**
To maintain AI functionality across all editors, you must keep `.agent/` **tracked in Git**:
1. Ensure `.agent/` is **NOT** in your project's root `.gitignore` or any subfolder `.gitignore`.
2. Keep your secrets (like API keys) exclusively in `.env`, which is already ignored.

*(Note: Older versions of this document recommended using `.git/info/exclude`. This is **incorrect**, as AI editors do not read Git's exclude files for indexing. If you truly need to keep local-only customizations to tracked agent files without committing them, use `git update-index --skip-worktree .agent/` instead.)*

## What's Included

| Component     | Count | Description                                                        |
| ------------- | ----- | ------------------------------------------------------------------ |
| **Agents**    | 20    | Specialist AI personas (frontend, backend, security, PM, QA, etc.) |
| **Skills**    | 37    | Domain-specific knowledge modules                                  |
| **Workflows** | 11    | Slash command procedures                                           |


## Usage

### Using Agents

**No need to mention agents explicitly!** The system automatically detects and applies the right specialist(s):

```
You: "Add JWT authentication"
AI: 🤖 Applying @security-auditor + @backend-specialist...

You: "Fix the dark mode button"
AI: 🤖 Using @frontend-specialist...

You: "Login returns 500 error"
AI: 🤖 Using @debugger for systematic analysis...
```

**How it works:**

- Analyzes your request silently

- Detects domain(s) automatically (frontend, backend, security, etc.)
- Selects the best specialist(s)
- Informs you which expertise is being applied
- You get specialist-level responses without needing to know the system architecture

**Benefits:**

- ✅ Zero learning curve - just describe what you need
- ✅ Always get expert responses
- ✅ Transparent - shows which agent is being used
- ✅ Can still override by mentioning agent explicitly

### Using Workflows

Invoke workflows with slash commands:

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `/brainstorm`    | Explore options before implementation |
| `/create`        | Create new features or apps           |
| `/debug`         | Systematic debugging                  |
| `/deploy`        | Deploy application                    |
| `/enhance`       | Improve existing code                 |
| `/orchestrate`   | Multi-agent coordination              |
| `/plan`          | Create task breakdown                 |
| `/preview`       | Preview changes locally               |
| `/status`        | Check project status                  |
| `/test`          | Generate and run tests                |
| `/ui-ux-pro-max` | Design with 50 styles                 |

Example:

```
/brainstorm authentication system
/create landing page with hero section
/debug why login fails
```

### Using Skills

Skills are loaded automatically based on task context. The AI reads skill descriptions and applies relevant knowledge.

## CLI Tool

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `ag-kit init`   | Install `.agent` folder into your project |
| `ag-kit update` | Update to the latest version              |
| `ag-kit status` | Check installation status                 |

### Options

```bash
ag-kit init --force        # Overwrite existing .agent folder
ag-kit init --path ./myapp # Install in specific directory
ag-kit init --branch dev   # Use specific branch
ag-kit init --quiet        # Suppress output (for CI/CD)
ag-kit init --dry-run      # Preview actions without executing
```

## Documentation

- **[Web App Example](https://antigravity-kit-v2.vercel.app/docs/guide/examples/brainstorm)** - Step-by-step guide to creating a web application
- **[Online Docs](https://antigravity-kit-v2.vercel.app/docs)** - Browse all documentation online

## License

MIT © [johansabent](https://github.com/johansabent)

> Upstream work © Vudovn — [original repository](https://github.com/vudovn/antigravity-kit)
