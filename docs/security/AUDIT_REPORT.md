# Security Audit Report — Antigravity Kit

**Date:** 2026-02-25
**Auditor:** GitHub Copilot Coding Agent
**Scope:** Full repository (`johansabent/antigravity-kit-jp`)
**Methodology:** Manual code review + static analysis across all code, configuration, and dependency files

---

## Executive Summary

| Metric | Count |
|--------|-------|
| **Files reviewed** | 110+ (TypeScript, Python, JSON, Markdown, Config) |
| **Critical findings** | 0 |
| **High findings** | 3 (all remediated) |
| **Medium findings** | 2 (all remediated) |
| **Low / Informational** | 5 |
| **Overall risk** | **Low** (after remediation) |

All high and medium findings have been fixed as part of this audit. Remaining low/informational items are documented for awareness.

---

## 1. Code Security Analysis

### 1.1 Python Scripts

**Scope:** 23 Python files across `.agent/scripts/` and `.agent/skills/*/scripts/`

#### Finding P-1 — `subprocess` with `shell=True` (HIGH → FIXED)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **CWE** | [CWE-78: Improper Neutralization of Special Elements used in an OS Command](https://cwe.mitre.org/data/definitions/78.html) |
| **OWASP** | A03:2021 – Injection |
| **File** | `.agent/scripts/auto_preview.py`, line 81 |
| **Status** | ✅ Fixed |

**Description:**
`subprocess.Popen()` was called with `shell=True` while passing an array-format command (`["npm", "run", "dev"]`). When `shell=True`, the array is joined into a single string and passed to the shell, which could allow command injection if any element were derived from user input.

**Before:**
```python
process = subprocess.Popen(
    cmd, cwd=str(root), stdout=log, stderr=log, env=env,
    shell=True  # Required for npm on windows often, or consistent path handling
)
```

**After:**
```python
process = subprocess.Popen(
    cmd, cwd=str(root), stdout=log, stderr=log, env=env,
    shell=False
)
```

**Impact:** If `cmd` were ever constructed from user input, an attacker could inject arbitrary OS commands.

---

#### Finding P-2 — Conditional `shell=True` on Windows (HIGH → FIXED)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **CWE** | [CWE-78: Improper Neutralization of Special Elements used in an OS Command](https://cwe.mitre.org/data/definitions/78.html) |
| **File** | `.agent/skills/lint-and-validate/scripts/lint_runner.py`, line 99 |
| **Status** | ✅ Fixed |

**Description:**
`subprocess.run()` conditionally enabled `shell=True` on Windows. The Windows `.cmd` extension workaround on lines 86-89 already handles the path resolution issue, making `shell=True` unnecessary.

**Before:**
```python
proc = subprocess.run(
    cmd, cwd=str(cwd), capture_output=True, text=True,
    encoding='utf-8', errors='replace', timeout=120,
    shell=platform.system() == "Windows"
)
```

**After:**
```python
proc = subprocess.run(
    cmd, cwd=str(cwd), capture_output=True, text=True,
    encoding='utf-8', errors='replace', timeout=120,
    shell=False
)
```

---

#### P-3 — No `eval()`, `exec()`, `pickle`, or unsafe `yaml.load` (PASS)

Scanned all 23 Python files. None use dangerous deserialization or dynamic code execution.

#### P-4 — No hardcoded credentials in Python code (PASS)

No API keys, passwords, tokens, or connection strings found in any Python file.

#### P-5 — Safe path handling (PASS)

All file operations use `pathlib.Path`, with proper encoding and error handling.

---

### 1.2 TypeScript / React (Web Application)

**Scope:** 90+ files in `web/src/`

#### Finding W-1 — No `dangerouslySetInnerHTML` (PASS)

Not used anywhere in the codebase.

#### Finding W-2 — No `eval()` or `Function()` constructor (PASS)

Not found in any component or utility.

#### Finding W-3 — External links properly secured (PASS)

All external `<a>` tags include `target="_blank" rel="noopener noreferrer"` (verified in `mdx-components.tsx:33-36` and `page.tsx:484-496`).

#### Finding W-4 — No API routes or endpoints (INFORMATIONAL)

This is a static documentation site with no API routes (`app/api/`), so server-side injection risks are not applicable.

#### Finding W-5 — No client-side credential storage (PASS)

No `localStorage`, `sessionStorage`, or cookie operations storing sensitive data.

---

## 2. Dependency Security

### 2.1 Root `package.json`

The root `package.json` has no runtime dependencies — it is metadata-only. No vulnerability surface.

### 2.2 Web `package.json`

| Package | Version | Status |
|---------|---------|--------|
| next | 16.1.3 | Current |
| react / react-dom | 19.2.3 | Current |
| @base-ui/react | ^1.1.0 | Current |
| lucide-react | ^0.562.0 | Current |
| tailwind-merge | ^3.4.0 | Current |
| tailwindcss | ^4 | Current |
| eslint | ^9 | Current |
| typescript | ^5 | Current |

**Finding D-1 — No known critical vulnerabilities (PASS)**

All dependencies are recent versions. No CVEs found in the declared dependency tree.

**Finding D-2 — Lock file present (PASS)**

`web/package-lock.json` exists, ensuring deterministic builds and supply chain integrity.

---

## 3. Configuration Security

### Finding C-1 — Missing security headers in Next.js (MEDIUM → FIXED)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **CWE** | [CWE-693: Protection Mechanism Failure](https://cwe.mitre.org/data/definitions/693.html) |
| **File** | `web/next.config.ts` |
| **Status** | ✅ Fixed |

**Description:**
`next.config.ts` had no HTTP security headers configured. Added the following headers to all routes:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer leakage |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables unused browser APIs |

---

### Finding C-2 — Root `.gitignore` missing `.env*` patterns (MEDIUM → FIXED)

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **CWE** | [CWE-200: Exposure of Sensitive Information](https://cwe.mitre.org/data/definitions/200.html) |
| **File** | `.gitignore` |
| **Status** | ✅ Fixed |

**Description:**
The root `.gitignore` did not exclude `.env` files. While `web/.gitignore` correctly excluded `.env*`, any `.env` file at the repository root could be accidentally committed.

**Added patterns:**
```
.env
.env.*
.env.local
.env.development
.env.production
```

---

### Finding C-3 — API key placeholder in MCP config (HIGH → FIXED)

| Field | Value |
|-------|-------|
| **Severity** | High |
| **CWE** | [CWE-798: Use of Hard-coded Credentials](https://cwe.mitre.org/data/definitions/798.html) |
| **File** | `.agent/mcp_config.json`, line 9 |
| **Status** | ✅ Fixed |

**Description:**
The MCP configuration contained the literal string `"YOUR_API_KEY"` as an API key value. While this was a placeholder, it trains users to place real keys directly in the file, which would be committed to version control.

**Before:**
```json
"--api-key", "YOUR_API_KEY"
```

**After:**
```json
"--api-key", "${CONTEXT7_API_KEY}"
```

Added comment instructing users to set the API key as an environment variable.

---

### Finding C-4 — `.editorconfig` properly configured (PASS)

UTF-8 encoding, LF line endings, and consistent indentation. No security issues.

### Finding C-5 — `web/.gitignore` properly configured (PASS)

Correctly excludes `.env*`, `.next/`, `node_modules/`, `*.pem`, and build artifacts.

---

## 4. Agent / Workflow Security

### Finding A-1 — Agents have unrestricted Bash access (LOW / BY DESIGN)

| Field | Value |
|-------|-------|
| **Severity** | Low (Informational) |
| **Files** | `.agent/agents/orchestrator.md`, `security-auditor.md`, `penetration-tester.md`, `devops-engineer.md` |

**Description:**
Several agent definitions list "Bash" as an available tool, granting unrestricted command execution. This is by design for an AI-assisted development toolkit, but users should be aware that agent-executed commands run with the user's permissions.

**Recommendation:** Document in agent security guide (see `docs/guides/AGENT_SECURITY.md`).

---

### Finding A-2 — Workflow `$ARGUMENTS` are not sanitized (LOW / BY DESIGN)

| Field | Value |
|-------|-------|
| **Severity** | Low (Informational) |
| **Files** | `.agent/workflows/deploy.md`, `orchestrate.md`, `plan.md` |

**Description:**
Slash commands pass `$ARGUMENTS` directly to agents without input validation. In the context of an AI coding assistant (Cursor/Windsurf), the user is the one providing input interactively, so this is expected behavior.

**Recommendation:** Document in agent security guide.

---

### Finding A-3 — No audit logging for agent actions (INFORMATIONAL)

| Field | Value |
|-------|-------|
| **Severity** | Informational |

**Description:**
Agent actions are not logged to a persistent audit trail. This is acceptable for a development toolkit but would be important if deployed in a shared/production environment.

---

## 5. Web Application Security

### Finding W-6 — Static site with no server-side attack surface (PASS)

The `web/` folder is a Next.js static documentation site with:
- No API routes
- No database connections
- No user authentication
- No form submissions to a backend
- No dynamic content from user input

Attack surface is minimal and limited to client-side rendering of static MDX content.

---

## 6. Supply Chain Security

### Finding S-1 — Fork origin verified (PASS)

Repository is forked from `vudovn/antigravity-kit`, a public MIT-licensed project. No suspicious modifications found in the fork.

### Finding S-2 — No CI/CD pipelines (INFORMATIONAL)

No `.github/workflows/` directory exists. While this means no CI/CD pipeline vulnerabilities, it also means no automated security scanning is in place.

**Recommendation:** Consider adding GitHub Actions for:
- `npm audit` on pull requests
- Dependency version checking (Dependabot)
- CodeQL analysis

---

## Summary of Remediations Applied

| # | Finding | Severity | File | Status |
|---|---------|----------|------|--------|
| P-1 | `shell=True` in auto_preview.py | High | `.agent/scripts/auto_preview.py` | ✅ Fixed |
| P-2 | `shell=True` in lint_runner.py | High | `.agent/skills/lint-and-validate/scripts/lint_runner.py` | ✅ Fixed |
| C-1 | Missing security headers | Medium | `web/next.config.ts` | ✅ Fixed |
| C-2 | Missing `.env*` in root gitignore | Medium | `.gitignore` | ✅ Fixed |
| C-3 | API key placeholder in MCP config | High | `.agent/mcp_config.json` | ✅ Fixed |

---

## References

- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [CWE/SANS Top 25 Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/)
- [Next.js Security Headers Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)
- [Python subprocess Security](https://docs.python.org/3/library/subprocess.html#security-considerations)
