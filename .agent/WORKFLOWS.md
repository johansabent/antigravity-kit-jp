# Available Workflows

Quick reference for all slash commands in this toolkit. Type a command to trigger the workflow.

| Command | Description | Workflow |
|---------|-------------|----------|
| `/start` | Initialize session, read context, fetch issues, setup branch | [start.md](workflows/start.md) |
| `/end` | Run quality gates, push work, create/update PR, final report | [end.md](workflows/end.md) |
| `/review <pr>` | Fetch PR comments, resolve threads, re-trigger bots | [review-pr.md](workflows/review-pr.md) |
| `/git <sub>` | Unified Git/GitHub ops (status, diff, commit, push, pr, work, review, launchpad) | [git.md](workflows/git.md) |
| `/plan` | Create project plan (no code, only plan file) | [plan.md](workflows/plan.md) |
| `/create` | Create new application via App Builder skill | [create.md](workflows/create.md) |
| `/enhance` | Add/update features in existing application | [enhance.md](workflows/enhance.md) |
| `/debug` | Activate systematic debugging mode | [debug.md](workflows/debug.md) |
| `/test` | Generate and run tests | [test.md](workflows/test.md) |
| `/brainstorm` | Structured brainstorming with Socratic questions | [brainstorm.md](workflows/brainstorm.md) |
| `/deploy` | Pre-flight checks and deployment execution | [deploy.md](workflows/deploy.md) |
| `/orchestrate` | Multi-agent coordination for complex tasks | [orchestrate.md](workflows/orchestrate.md) |
| `/preview` | Local dev server management (start/stop/status) | [preview.md](workflows/preview.md) |
| `/status` | Display agent and project progress | [status.md](workflows/status.md) |
| `/ui-ux-pro-max` | Plan and implement UI with design specialist | [ui-ux-pro-max.md](workflows/ui-ux-pro-max.md) |

## Typical Session Flow

```
/start              → Load context, see issues & PRs
  ↓
/plan or /create    → Plan or build
  ↓
/test               → Verify
  ↓
/review <pr>        → Address feedback, re-trigger bots
  ↓
/end                → Quality gate, push, report
```

## First-Time Setup

On first `/review` or `/start`, the agent will ask which AI bots you have installed (e.g., `gemini-code-assist`, `copilot`). Your preferences are saved to `.agent/config/bot_preferences.json` (local, not tracked in Git).

Template: `.agent/config/bot_preferences.example.json`
