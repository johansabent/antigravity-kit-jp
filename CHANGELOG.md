# Changelog

All notable changes to **antigravity-kit-jp** (johansabent's fork of Antigravity Kit) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-26

### Fork Release — johansabent/antigravity-kit-jp

This is the first official release of **antigravity-kit-jp**, a security-hardened fork of
[vudovn/antigravity-kit](https://github.com/vudovn/antigravity-kit) (upstream v2.0.2).
It inherits all upstream agents, skills, and workflows and adds a professional security
layer on top.

### Added

- **GitHub Actions CI/CD**:
  - `codeql.yml` — CodeQL static analysis for JavaScript/TypeScript on push, PR, and weekly schedule
  - `dependency-review.yml` — blocks PRs that introduce vulnerable or GPL-licensed dependencies; runs `npm audit`
  - `security-scan.yml` — executes the built-in `security_scan.py` on every push and PR
  - `lint.yml` — ESLint + TypeScript type-check + Next.js build check on `web/` changes
  - `release.yml` — automatically publishes a GitHub Release when a `v*` tag is pushed
- **Dependabot** (`dependabot.yml`) — weekly automated dependency-update PRs for npm and GitHub Actions
- **Security policy** (`SECURITY.md`) — vulnerability disclosure policy with scope table and SLA commitments
- **Security documentation** (`docs/security/`):
  - `AUDIT_REPORT.md` — full security audit findings and status
  - `REMEDIATION_LOG.md` — changelog of every applied fix
  - `SECURITY_GUIDELINES.md` — developer-facing security best practices
  - `GITHUB_ACTIONS_GUIDE.md` — walkthrough of all CI/CD security workflows

### Fixed

- **CWE-78 Command Injection** — replaced `shell=True` with argument lists in `auto_preview.py` and `lint_runner.py`
- **CWE-693 Missing Security Headers** — added `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy` headers to `web/next.config.ts`
- **CWE-200 Sensitive Data Exposure** — added `.env*` glob patterns to `.gitignore`
- **CWE-798 Hardcoded Credentials** — replaced hardcoded API key placeholder with `${GEMINI_API_KEY}` environment variable reference in `mcp_config.json`

### Inherited from upstream (vudovn/antigravity-kit v2.0.2)

- 20 specialist AI agents
- 37 domain-specific skills (including `rust-pro` added in v2.0.2)
- 11 workflow slash commands (`/brainstorm`, `/create`, `/debug`, `/deploy`, `/enhance`, `/orchestrate`, `/plan`, `/preview`, `/status`, `/test`, `/ui-ux-pro-max`)
- CLI tool (`ag-kit init | update | status`)

---

## Upstream History

> The entries below track the upstream project that this fork is based on.

## [2.0.2] - 2026-02-04
- **New Skills**:
    - `rust-pro` - Master Rust 1.75+
- **Agent Workflows**:
    - Updated `orchestrate.md` fix output turkish


## [2.0.1] - 2026-01-26

### Added

- **Agent Flow Documentation**: New comprehensive workflow documentation
    - Added `.agent/AGENT_FLOW.md` - Complete agent flow architecture guide
    - Documented Agent Routing Checklist (mandatory steps before code/design work)
    - Documented Socratic Gate Protocol for requirement clarification
    - Added Cross-Skill References pattern documentation
- **New Skills**:
    - `react-best-practices` - Consolidated Next.js and React expertise
    - `web-design-guidelines` - Professional web design standards and patterns

### Changed

- **Skill Consolidation**: Merged `nextjs-best-practices` and `react-patterns` into unified `react-best-practices` skill
- **Architecture Updates**:
    - Enhanced `.agent/ARCHITECTURE.md` with improved flow diagrams
    - Updated `.agent/rules/GEMINI.md` with Agent Routing Checklist
- **Agent Updates**:
    - Updated `frontend-specialist.md` with new skill references
    - Updated `qa-automation-engineer.md` with enhanced testing workflows
- **Frontend Design Skill**: Enhanced `frontend-design/SKILL.md` with cross-references to `web-design-guidelines`

### Removed

- Deprecated `nextjs-best-practices` skill (consolidated into `react-best-practices`)
- Deprecated `react-patterns` skill (consolidated into `react-best-practices`)

### Fixed

- **Agent Flow Accuracy**: Corrected misleading terminology in AGENT_FLOW.md
    - Changed "Parallel Execution" → "Sequential Multi-Domain Execution"
    - Changed "Integration Layer" → "Code Coherence" with accurate description
    - Added reality notes about AI's sequential processing vs. simulated multi-agent behavior
    - Clarified that scripts require user approval (not auto-executed)

## [2.0.0] - Unreleased

### Initial Release

- Initial release of Antigravity Kit
- 20 specialized AI agents
- 37 domain-specific skills
- 11 workflow slash commands
- CLI tool for easy installation and updates
- Comprehensive documentation and architecture guide

[Unreleased]: https://github.com/johansabent/antigravity-kit-jp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/johansabent/antigravity-kit-jp/releases/tag/v1.0.0
