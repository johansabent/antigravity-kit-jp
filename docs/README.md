# Antigravity Kit — Documentation Index

This folder contains security audit reports, development guides, and reference documentation for the Antigravity Kit repository.

## 📂 Folder Structure

```
docs/
├── README.md                          # This index file
├── security/
│   ├── AUDIT_REPORT.md                # Full security audit report (findings, severity, remediation)
│   ├── REMEDIATION_LOG.md             # Log of all code fixes applied during the audit
│   ├── SECURITY_GUIDELINES.md         # Ongoing security best practices for contributors
│   └── GITHUB_ACTIONS_GUIDE.md        # Guide to all security workflows and Dependabot config
└── guides/
    ├── FOLDER_STRUCTURE.md            # Repository structure overview & file reference
    └── AGENT_SECURITY.md              # Security considerations for .agent workflows
```

## Quick Links

| Document | Description |
|----------|-------------|
| [Security Audit Report](security/AUDIT_REPORT.md) | Comprehensive findings from the 2026-02-25 security audit |
| [Remediation Log](security/REMEDIATION_LOG.md) | Every code fix applied, with before/after diffs |
| [Security Guidelines](security/SECURITY_GUIDELINES.md) | Best practices for keeping the project secure |
| [GitHub Actions Guide](security/GITHUB_ACTIONS_GUIDE.md) | How each security workflow works, and how to respond to alerts |
| [Folder Structure Guide](guides/FOLDER_STRUCTURE.md) | Full map of every directory and key file |
| [Agent Security Guide](guides/AGENT_SECURITY.md) | Security considerations for `.agent` workflows and skills |

## GitHub Security Workflows

The repository includes automated security workflows in `.github/`:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `dependency-review.yml` | PR to `main` | Blocks PRs with vulnerable or restrictively-licensed deps |
| `codeql.yml` | Push/PR/weekly | CodeQL static analysis for JS/TS |
| `security-scan.yml` | Push/PR | Secret detection + dangerous code pattern scan |
| `lint.yml` | Push/PR (web/) | ESLint, TypeScript, Next.js build |
| `dependabot.yml` | Weekly | Auto-PRs for outdated dependencies |

See [GitHub Actions Guide](security/GITHUB_ACTIONS_GUIDE.md) for full details.
