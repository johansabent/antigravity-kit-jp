# Repository Folder Structure Guide

Complete reference for the Antigravity Kit repository structure, explaining the purpose of every top-level directory and key files.

---

## Top-Level Structure

```
antigravity-kit-jp/
├── .agent/              # AI Agent system (skills, agents, workflows, scripts)
├── docs/                # Documentation, audit reports, guides (this folder)
├── web/                 # Next.js documentation website
├── .editorconfig        # Editor formatting rules (indent, charset, EOL)
├── .gitignore           # Git ignore patterns (node_modules, .env, etc.)
├── AGENT_FLOW.md        # Visual overview of agent coordination flow
├── CHANGELOG.md         # Version history and release notes
├── LICENSE              # MIT License
├── README.md            # Project overview and quick start
├── package.json         # Root metadata (name, author, keywords)
└── package-lock.json    # Dependency lock file (root)
```

---

## `.agent/` — AI Agent System

The core of the repository. Contains templates, skills, and workflows used by AI coding assistants (Cursor, Windsurf, Gemini).

```
.agent/
├── ARCHITECTURE.md       # Detailed system architecture documentation
├── mcp_config.json       # Model Context Protocol server configuration
├── agents/               # 20 specialist agent definitions (Markdown)
│   ├── orchestrator.md           # Coordinates multi-agent tasks
│   ├── frontend-specialist.md    # Frontend development expert
│   ├── backend-specialist.md     # Backend development expert
│   ├── security-auditor.md       # Security analysis specialist
│   ├── penetration-tester.md     # Penetration testing specialist
│   ├── devops-engineer.md        # Infrastructure & deployment
│   ├── database-architect.md     # Database design specialist
│   ├── test-engineer.md          # Testing specialist
│   ├── debugger.md               # Debugging specialist
│   └── ... (11 more agents)
├── skills/               # 36+ domain-specific skill modules
│   ├── vulnerability-scanner/    # Security scanning (Python scripts + checklists)
│   ├── red-team-tactics/         # Offensive security knowledge
│   ├── testing-patterns/         # Test frameworks and patterns
│   ├── lint-and-validate/        # Linting and type checking
│   ├── api-patterns/             # API design best practices
│   ├── nextjs-react-expert/      # React/Next.js patterns
│   ├── frontend-design/          # UX audit, accessibility
│   ├── database-design/          # Schema validation
│   └── ... (28 more skills)
├── workflows/            # 11 slash command definitions
│   ├── orchestrate.md    # /orchestrate — multi-agent coordination
│   ├── deploy.md         # /deploy — deployment workflow
│   ├── test.md           # /test — test execution
│   ├── debug.md          # /debug — debugging workflow
│   ├── plan.md           # /plan — project planning
│   ├── create.md         # /create — scaffolding
│   └── ... (5 more workflows)
├── rules/                # Global behavior rules
│   └── GEMINI.md         # Rules for Gemini AI integration
├── scripts/              # Master validation scripts
│   ├── verify_all.py     # Comprehensive project verification
│   ├── auto_preview.py   # Dev server management (start/stop/status)
│   ├── checklist.py      # Priority-based validation orchestrator
│   └── session_manager.py # Project state analyzer
└── .shared/              # Shared resources across skills
    └── ui-ux-pro-max/    # Design system, search engine, core utilities
```

---

## `web/` — Documentation Website

A Next.js 16 static documentation site.

```
web/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Root layout (fonts, theme)
│   │   ├── globals.css           # Global styles
│   │   └── docs/                 # Documentation section
│   │       ├── page.tsx          # Docs index
│   │       ├── layout.tsx        # Docs layout (sidebar)
│   │       ├── skills/page.tsx   # Skills directory
│   │       ├── agents/page.tsx   # Agents directory
│   │       ├── workflows/page.tsx
│   │       ├── cli/page.tsx
│   │       └── installation/page.tsx
│   ├── components/
│   │   ├── ui/                   # 60+ UI components (shadcn-style)
│   │   ├── layout/               # Header, footer, sidebar, TOC
│   │   ├── docs/                 # Code block, sidebar components
│   │   ├── mdx/                  # MDX components (Terminal, FeatureGrid, etc.)
│   │   ├── theme-provider.tsx    # Dark/light theme provider
│   │   └── typing.tsx            # Typewriter animation
│   ├── hooks/
│   │   └── use-mobile.ts         # Mobile detection hook
│   ├── lib/
│   │   ├── utils.ts              # Utility functions (cn, etc.)
│   │   └── docs-config.ts        # Documentation navigation config
│   ├── services/                 # Static data files
│   │   ├── agents.json           # Agent metadata
│   │   ├── skills.json           # Skills metadata
│   │   └── workflows.json        # Workflow metadata
│   └── mdx-components.tsx        # MDX component overrides
├── public/                       # Static assets (images, logos)
├── next.config.ts                # Next.js config (MDX, security headers)
├── tsconfig.json                 # TypeScript config
├── eslint.config.mjs             # ESLint config
├── postcss.config.mjs            # PostCSS config
├── components.json               # Component library config (shadcn)
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Dependency lock file
└── .gitignore                    # Web-specific ignore rules
```

---

## `docs/` — Documentation & Audit Reports

```
docs/
├── README.md                      # This index / table of contents
├── security/
│   ├── AUDIT_REPORT.md            # Full security audit findings
│   ├── REMEDIATION_LOG.md         # All code fixes with before/after diffs
│   └── SECURITY_GUIDELINES.md     # Security best practices for contributors
└── guides/
    ├── FOLDER_STRUCTURE.md        # This file — repository map
    └── AGENT_SECURITY.md          # Security considerations for .agent workflows
```

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `.editorconfig` | Enforces consistent formatting across editors (4-space indent, UTF-8, LF) |
| `.gitignore` | Excludes `node_modules/`, `.env*`, `.temp_ag_kit/`, build artifacts |
| `web/.gitignore` | Web-specific exclusions (`.next/`, `.env*`, `*.pem`, `.vercel`) |
| `web/tsconfig.json` | TypeScript compiler options for the web app |
| `web/next.config.ts` | Next.js configuration (MDX support, security headers) |
| `web/eslint.config.mjs` | ESLint rules for the web app |
| `.agent/mcp_config.json` | Model Context Protocol server definitions |
