# GitHub Actions Security Workflows Guide

This document explains every security-related GitHub Actions workflow and Dependabot configuration in this repository, how they work, and how to respond to alerts.

---

## Overview

| Workflow | File | Trigger | Purpose |
|----------|------|---------|---------|
| [Dependency Review](#1-dependency-review) | `.github/workflows/dependency-review.yml` | PR to `main` | Block PRs with vulnerable or problematic deps |
| [CodeQL Analysis](#2-codeql-analysis) | `.github/workflows/codeql.yml` | Push/PR to `main` + weekly | Static analysis for JS/TS vulnerabilities |
| [Security Scan](#3-security-scan) | `.github/workflows/security-scan.yml` | Push/PR to `main` | Secret detection + dangerous code patterns |
| [Lint & Type Check](#4-lint--type-check) | `.github/workflows/lint.yml` | Push/PR to `main` (web/ changes) | ESLint, TypeScript, Next.js build |
| [Dependabot](#5-dependabot) | `.github/dependabot.yml` | Weekly (Monday) | Auto-creates PRs for outdated deps |

---

## 1. Dependency Review

**File:** `.github/workflows/dependency-review.yml`

### What It Does
- **Dependency Review Action** — Compares the dependency tree before and after a PR. Fails if any new dependency has a known **high** or **critical** vulnerability.
- **npm audit** — Installs `web/` dependencies and runs `npm audit --audit-level=high`.
- **License check** — Denies `GPL-3.0` and `AGPL-3.0` licenses which are incompatible with the MIT license of this project.

### When It Runs
Only on pull requests to `main` that modify `package.json` or `package-lock.json` (in root or `web/`).

### How to Respond to Failures

| Failure | Action |
|---------|--------|
| Vulnerable dependency detected | Check the advisory link in the log. Update the package (`npm update <pkg>`) or find an alternative. |
| License violation | Replace the package with an MIT/Apache-2.0 licensed alternative. |
| npm audit failure | Run `npm audit fix` in `web/`, or `npm audit` to review and manually resolve. |

---

## 2. CodeQL Analysis

**File:** `.github/workflows/codeql.yml`

### What It Does
GitHub's CodeQL engine performs static analysis on all JavaScript and TypeScript files in `web/src/`. It detects:
- Injection vulnerabilities (XSS, SQL injection, command injection)
- Insecure data handling
- Prototype pollution
- Path traversal
- And many more patterns from the [CodeQL query suite](https://codeql.github.com/docs/codeql-overview/)

### When It Runs
- On every push to `main`
- On every pull request to `main`
- Weekly on Monday at 06:00 UTC (catches new query rules against existing code)

### How to Respond to Alerts
1. Go to the **Security** tab → **Code scanning alerts**.
2. Review the alert description, affected file, and data flow.
3. If it's a true positive → fix the code and push.
4. If it's a false positive → dismiss the alert with a reason (e.g., "Used in test only").

---

## 3. Security Scan

**File:** `.github/workflows/security-scan.yml`

### What It Does
Runs the repository's own Python-based security scanner (`.agent/skills/vulnerability-scanner/scripts/security_scan.py`) with two scan types:

1. **Secret scan** (`--scan-type secrets`) — Detects hardcoded API keys, tokens, passwords, AWS keys, database connection strings, private keys, and JWTs.
2. **Pattern scan** (`--scan-type patterns`) — Detects dangerous code patterns like `eval()`, `exec()`, `shell=True`, `dangerouslySetInnerHTML`, `pickle.loads()`, and SQL string concatenation.

### When It Runs
On every push and pull request to `main`.

### How to Respond to Failures
- **Secret detected:** Remove the secret from code immediately. Rotate the compromised credential. Use environment variables instead (see `docs/security/SECURITY_GUIDELINES.md`).
- **Dangerous pattern detected:** Review the flagged line. If it's a true positive, refactor the code. If it's intentional (e.g., in the scanner itself), no action needed — the scanner's own patterns are expected matches.

---

## 4. Lint & Type Check

**File:** `.github/workflows/lint.yml`

### What It Does
Two jobs run on changes to the `web/` directory:

1. **Lint job:**
   - `npm run lint` — Runs ESLint with the Next.js config
   - `npx tsc --noEmit` — TypeScript type check without emitting files

2. **Build job:**
   - `npm run build` — Full Next.js production build (catches build-time errors)

### When It Runs
On push/PR to `main`, but only if files in `web/` were changed.

### How to Respond to Failures

| Failure | Action |
|---------|--------|
| ESLint error | Run `npm run lint` locally in `web/` and fix the reported issues. |
| TypeScript error | Run `npx tsc --noEmit` locally in `web/` and fix type errors. |
| Build failure | Run `npm run build` locally in `web/` and fix the build error. |

---

## 5. Dependabot

**File:** `.github/dependabot.yml`

### What It Does
Automatically creates pull requests to update outdated dependencies:

- **npm ecosystem** (`web/` directory) — Checks weekly, groups minor/patch updates into a single PR to reduce noise.
- **GitHub Actions** — Keeps Action versions up to date (e.g., `actions/checkout@v4`).

### Configuration Details

| Setting | Value | Why |
|---------|-------|-----|
| Schedule | Weekly (Monday) | Balance between freshness and PR noise |
| Open PR limit (npm) | 10 | Prevent overwhelming the repo with PRs |
| Open PR limit (Actions) | 5 | Actions updates are less frequent |
| Grouping | Minor + patch together | Reduces number of PRs |
| Labels | `dependencies`, `ci` | Easy filtering in PR list |

### How to Respond to Dependabot PRs
1. Review the changelog linked in the PR description.
2. Check if the CI checks pass (lint, build, security scan).
3. If everything passes → merge.
4. If a major version bump is needed → Dependabot won't auto-create it; update manually.

---

## Manual Setup Required

Some GitHub security features need to be enabled in the repository settings:

### Enable in Repository Settings → Security

| Feature | How to Enable | Status |
|---------|---------------|--------|
| **Dependabot alerts** | Settings → Code security → Dependabot alerts → Enable | Must enable manually |
| **Dependabot security updates** | Settings → Code security → Dependabot security updates → Enable | Must enable manually |
| **Secret scanning** | Settings → Code security → Secret scanning → Enable | Must enable manually |
| **Push protection** | Settings → Code security → Push protection → Enable | Must enable manually |
| **Private vulnerability reporting** | Settings → Code security → Private vulnerability reporting → Enable | Must enable manually |
| **CodeQL default setup** | Already handled by `.github/workflows/codeql.yml` | ✅ Automated |

### Steps to Enable

1. Go to your repository on GitHub.
2. Click **Settings** → **Code security and analysis** (left sidebar).
3. Enable each feature listed above by clicking the **Enable** button next to it.

> **Note:** Some features (like secret scanning and push protection) may require a GitHub Pro, Team, or Enterprise plan for private repositories. They are free for public repositories.

---

## Workflow Permissions

All workflows follow the principle of least privilege:

| Workflow | Permissions |
|----------|-------------|
| Dependency Review | `contents: read` |
| CodeQL | `actions: read`, `contents: read`, `security-events: write` |
| Security Scan | `contents: read` |
| Lint & Type Check | `contents: read` |

No workflow has `write` access to repository contents, packages, or deployments.
