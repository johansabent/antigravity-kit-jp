# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

If you discover a security vulnerability in this repository, please report it responsibly.

### How to Report

1. **Do not open a public issue.** Security vulnerabilities should not be disclosed publicly until a fix is available.
2. **Use GitHub's private vulnerability reporting:**
   Navigate to the [Security tab](../../security) of this repository and click **"Report a vulnerability"**.
3. Alternatively, email the maintainer directly with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgement** within 48 hours.
- **Status update** within 7 days.
- **Fix or mitigation** within 30 days for confirmed vulnerabilities.

### Scope

The following areas are in scope for security reports:

| Area | In Scope |
|------|----------|
| Web application (`web/`) | ✅ |
| Python scripts (`.agent/skills/*/scripts/`) | ✅ |
| Agent/workflow definitions (`.agent/`) | ✅ |
| GitHub Actions workflows (`.github/`) | ✅ |
| Dependencies (`package.json`, `package-lock.json`) | ✅ |
| Documentation content only | ❌ |

### Automated Security

This repository uses the following automated security measures:

- **GitHub Dependabot** — Automatic dependency update PRs (weekly)
- **CodeQL Analysis** — Static analysis on push/PR to `main` + weekly schedule
- **Dependency Review** — Blocks PRs that introduce vulnerable dependencies
- **Secret & Pattern Scan** — Runs the built-in `security_scan.py` on every push/PR
- **Lint & Type Check** — ESLint + TypeScript checks on the `web/` app

See [`docs/security/GITHUB_ACTIONS_GUIDE.md`](docs/security/GITHUB_ACTIONS_GUIDE.md) for details on each workflow.

## Security Audit History

| Date | Scope | Report |
|------|-------|--------|
| 2026-02-25 | Full repository | [`docs/security/AUDIT_REPORT.md`](docs/security/AUDIT_REPORT.md) |
