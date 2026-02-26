# Agent Security Guide

Security considerations and best practices for the `.agent` folder — the AI agent system that powers Skills, Agents, and Workflows.

---

## Overview

The `.agent` folder contains Markdown-based definitions that instruct AI coding assistants (Cursor, Windsurf, Gemini) how to behave. While these files are not executable code themselves, they **direct AI to execute commands, write files, and modify code** with the user's full system permissions.

This makes the agent system a security-sensitive part of the repository.

---

## Threat Model

### Who runs agents?
Agents are invoked by developers using AI coding assistants. The AI reads agent/skill/workflow definitions and follows the instructions. Commands are executed on the developer's local machine.

### What permissions do agents have?
Agents can do anything the AI coding assistant can do, which typically includes:
- Read/write any file the user can access
- Execute shell commands (`bash`, `powershell`)
- Install packages (`npm install`, `pip install`)
- Start/stop services
- Make network requests

### What are the risks?

| Risk | Severity | Description |
|------|----------|-------------|
| Prompt injection | Medium | A malicious prompt could manipulate agent behavior |
| Unintended command execution | Medium | Agents may execute destructive commands if poorly instructed |
| Credential exposure | Medium | Agents might write secrets to logs or files |
| Privilege escalation | Low | An agent could be tricked into performing actions outside its role |

---

## Security Architecture of the Agent System

### Agent Definitions (`.agent/agents/*.md`)

Each agent is a Markdown file defining:
- **Role** — What the agent specializes in
- **Tools** — Available capabilities (Bash, file operations, etc.)
- **Instructions** — Step-by-step guidelines
- **Boundaries** — What the agent should NOT do

**Security-sensitive agents:**

| Agent | Risk Level | Notes |
|-------|-----------|-------|
| `orchestrator.md` | Medium | Coordinates other agents; can invoke any agent |
| `devops-engineer.md` | Medium | Has deployment and server management instructions |
| `security-auditor.md` | Low | Runs security scans; reads code |
| `penetration-tester.md` | Medium | Designed to find and demonstrate vulnerabilities |

### Skill Definitions (`.agent/skills/*/`)

Skills are domain knowledge modules containing:
- `SKILL.md` — Knowledge and best practices
- `scripts/` — Python validation scripts
- `checklists.md` — Verification checklists

**Security-sensitive skills:**

| Skill | Contains Scripts | Risk |
|-------|-----------------|------|
| `vulnerability-scanner` | `security_scan.py` | Low — reads files, runs `npm audit` |
| `red-team-tactics` | No scripts | N/A — knowledge only |
| `lint-and-validate` | `lint_runner.py`, `type_coverage.py` | Low — runs linters |
| `testing-patterns` | `test_runner.py` | Low — runs test frameworks |

### Workflow Definitions (`.agent/workflows/*.md`)

Workflows define slash commands (e.g., `/deploy`, `/orchestrate`, `/test`). They receive `$ARGUMENTS` from the user and pass them to agents.

**Key concern:** `$ARGUMENTS` are not validated or sanitized before being passed to agents. This is acceptable in an interactive AI assistant context (the user controls input), but would be a vulnerability in an automated pipeline.

---

## Best Practices for Agent Authors

### 1. Be Explicit About Boundaries

Every agent definition should include a clear "Boundaries" or "Restrictions" section:

```markdown
## Boundaries
- Do NOT modify files outside the project directory
- Do NOT execute `rm -rf` or similar destructive commands without confirmation
- Do NOT access or modify `.env` files
- Do NOT push to production branches directly
```

### 2. Prefer Read-Only Operations

When possible, instruct agents to analyze and report rather than modify:

```markdown
## Workflow
1. SCAN the codebase for vulnerabilities
2. REPORT findings with severity levels
3. SUGGEST fixes (do not apply automatically)
4. WAIT for user confirmation before making changes
```

### 3. Avoid Hardcoding Commands with User Input

Do not instruct agents to construct shell commands from user input:

```markdown
# ❌ UNSAFE
Run: `rm -rf $ARGUMENTS`

# ✅ SAFER
Analyze the user's request and determine the appropriate action.
Always confirm destructive operations with the user before executing.
```

### 4. Use Scripts Instead of Inline Commands

Prefer calling well-tested Python scripts over inline shell commands:

```markdown
# ❌ Ad-hoc
Run `find . -name "*.py" -exec grep -l "eval" {} \;`

# ✅ Structured
Run `python .agent/skills/vulnerability-scanner/scripts/security_scan.py . --scan-type patterns`
```

Scripts have:
- Defined inputs and outputs
- Error handling and timeouts
- Scope-limited file access

### 5. Document Required Permissions

If an agent or workflow requires elevated permissions, document it:

```markdown
## Required Permissions
- Read access to all project files
- Write access to `reports/` directory only
- Network access for `npm audit` (fetches vulnerability database)
```

---

## Python Script Security Checklist

All Python scripts in `.agent/skills/*/scripts/` should follow these rules:

- [x] Use `shell=False` for all `subprocess` calls
- [x] Use `pathlib.Path` for file operations
- [x] Include `timeout` for all subprocess calls
- [x] Handle `FileNotFoundError` and `subprocess.TimeoutExpired`
- [x] Use `encoding='utf-8', errors='replace'` for file reads
- [x] Do not use `eval()`, `exec()`, `pickle.loads()`, or `yaml.load()` without `SafeLoader`
- [x] Do not hardcode credentials or API keys
- [x] Limit output size (truncate large results)

---

## MCP Configuration Security

The `.agent/mcp_config.json` file defines Model Context Protocol servers. Security rules:

1. **Never hardcode API keys** — Use environment variable references: `"${CONTEXT7_API_KEY}"`
2. **Review third-party MCP servers** — Each server runs as a subprocess; verify the package source
3. **Keep the file in version control** — But ensure it contains no secrets
4. **Document required environment variables** — So users know what to set

---

## Incident Response

If you discover a security issue in the agent system:

1. **Do not commit the fix publicly** if it exposes a vulnerability in a dependency
2. **Report** the issue to the repository maintainer
3. **Document** the finding in `docs/security/AUDIT_REPORT.md`
4. **Update** `docs/security/SECURITY_GUIDELINES.md` with new guidance
