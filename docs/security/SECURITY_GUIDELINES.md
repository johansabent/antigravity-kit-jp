# Security Guidelines for Contributors

This document provides ongoing security best practices for anyone contributing to the Antigravity Kit repository.

---

## 1. Secrets Management

### Rules
- **Never** commit API keys, tokens, passwords, or private keys to the repository.
- Use environment variables for all secrets (e.g., `${CONTEXT7_API_KEY}`).
- The root `.gitignore` excludes `.env*` files — keep it that way.
- If you must reference a secret in a config file, use a placeholder like `${VAR_NAME}` and document the expected variable.

### Verification
Run the built-in secret scanner before committing:
```bash
python .agent/skills/vulnerability-scanner/scripts/security_scan.py . --scan-type secrets --output summary
```

---

## 2. Python Script Security

### Subprocess Usage
- **Always** use `shell=False` (the default) when calling `subprocess.run()`, `subprocess.Popen()`, etc.
- Pass commands as a list (`["npm", "run", "dev"]`), not a string (`"npm run dev"`).
- If Windows compatibility requires `.cmd` extensions, handle it by modifying the executable name — not by enabling `shell=True`.

```python
# ✅ SAFE
subprocess.run(["npm", "run", "build"], shell=False)

# ❌ UNSAFE
subprocess.run("npm run build", shell=True)
```

### Avoid Dangerous Functions
- Do not use `eval()`, `exec()`, `pickle.loads()`, or `yaml.load()` without `SafeLoader`.
- If dynamic code execution is absolutely necessary, document why and restrict input sources.

### Path Handling
- Always use `pathlib.Path` for file operations.
- Never concatenate user input directly into file paths without validation.
- Use `Path.resolve()` to canonicalize paths and prevent traversal.

---

## 3. Web Application Security

### Security Headers
`web/next.config.ts` includes security headers for all routes. If you add new routes or middleware, ensure these headers are preserved:

| Header | Purpose |
|--------|---------|
| `X-Content-Type-Options: nosniff` | Prevents MIME sniffing |
| `X-Frame-Options: DENY` | Prevents clickjacking |
| `X-XSS-Protection: 1; mode=block` | Legacy XSS protection |
| `Referrer-Policy: strict-origin-when-cross-origin` | Controls referrer leakage |
| `Permissions-Policy: camera=(), microphone=(), geolocation=()` | Restricts browser APIs |

### React / JSX
- Never use `dangerouslySetInnerHTML` unless absolutely necessary, and always sanitize input with a library like DOMPurify.
- All external links must include `rel="noopener noreferrer"`.
- Do not use `eval()` or `new Function()` in client-side code.

### If Adding API Routes
If the web app evolves to include API routes:
- Validate and sanitize all user input.
- Implement rate limiting.
- Use CSRF tokens for state-changing operations.
- Add proper CORS configuration (avoid `Access-Control-Allow-Origin: *` with credentials).

---

## 4. Dependency Management

### Adding Dependencies
- Prefer well-maintained packages with active security updates.
- Check for known vulnerabilities before adding: `npm audit`.
- Keep `package-lock.json` committed to ensure deterministic installs.

### Updating Dependencies
- Run `npm audit` regularly in the `web/` directory.
- Review changelogs for security patches when updating.
- Avoid wildcard version ranges (`*`); prefer caret (`^`) or tilde (`~`).

---

## 5. Agent & Workflow Security

### Key Principles
- Agent definitions (`.agent/agents/*.md`) are prompt templates, not executable code — but they instruct AI to run commands.
- Be cautious when agents reference `Bash` or `PowerShell` tools, as AI may execute commands with the user's full permissions.
- Never instruct agents to write secrets to files or logs.

### Slash Commands
- Slash command workflows (`.agent/workflows/*.md`) receive `$ARGUMENTS` from the user.
- While agents operate under user supervision in Cursor/Windsurf, be aware that arguments are not validated before being passed to agents.
- See `docs/guides/AGENT_SECURITY.md` for detailed guidance.

---

## 6. Pre-Commit Checklist

Before submitting a pull request, verify:

- [ ] No secrets in the diff (`git diff --staged | grep -iE 'api.?key|token|password|secret'`)
- [ ] No `shell=True` in new subprocess calls
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] `.env` files are not staged (`git status`)
- [ ] Security headers in `next.config.ts` are not removed
- [ ] `npm audit` shows no new critical/high vulnerabilities in `web/`
