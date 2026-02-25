# Remediation Log

This document records every code change made as part of the 2026-02-25 security audit, with exact file locations and before/after diffs.

---

## Fix 1 — Remove `shell=True` from `auto_preview.py`

| Field | Value |
|-------|-------|
| **Finding** | P-1 |
| **File** | `.agent/scripts/auto_preview.py` |
| **Line** | 81 |
| **CWE** | CWE-78 (OS Command Injection) |

### Before
```python
process = subprocess.Popen(
    cmd,
    cwd=str(root),
    stdout=log,
    stderr=log,
    env=env,
    shell=True # Required for npm on windows often, or consistent path handling
)
```

### After
```python
process = subprocess.Popen(
    cmd,
    cwd=str(root),
    stdout=log,
    stderr=log,
    env=env,
    shell=False
)
```

### Rationale
`cmd` is already an array (`["npm", "run", "dev"]`), so `shell=True` is unnecessary. Passing an array to Popen with `shell=False` is the safe default — each element is passed as a separate argument, preventing shell metacharacter injection. The comment about Windows compatibility is addressed by the array format itself.

---

## Fix 2 — Remove conditional `shell=True` from `lint_runner.py`

| Field | Value |
|-------|-------|
| **Finding** | P-2 |
| **File** | `.agent/skills/lint-and-validate/scripts/lint_runner.py` |
| **Line** | 99 |
| **CWE** | CWE-78 (OS Command Injection) |

### Before
```python
proc = subprocess.run(
    cmd,
    cwd=str(cwd),
    capture_output=True,
    text=True,
    encoding='utf-8',
    errors='replace',
    timeout=120,
    shell=platform.system() == "Windows"
)
```

### After
```python
proc = subprocess.run(
    cmd,
    cwd=str(cwd),
    capture_output=True,
    text=True,
    encoding='utf-8',
    errors='replace',
    timeout=120,
    shell=False
)
```

### Rationale
The code on lines 86-89 already appends `.cmd` to npm/npx on Windows, which is the correct way to resolve Windows path issues. The `shell=True` fallback was redundant and introduced unnecessary risk.

---

## Fix 3 — Add security headers to Next.js config

| Field | Value |
|-------|-------|
| **Finding** | C-1 |
| **File** | `web/next.config.ts` |
| **CWE** | CWE-693 (Protection Mechanism Failure) |

### Before
```typescript
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
};
```

### After
```typescript
const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
};
```

### Rationale
Without explicit security headers, browsers may allow clickjacking (`X-Frame-Options`), MIME-type confusion (`X-Content-Type-Options`), and unnecessary API access (`Permissions-Policy`). These headers are recommended by OWASP for all web applications.

---

## Fix 4 — Add `.env*` patterns to root `.gitignore`

| Field | Value |
|-------|-------|
| **Finding** | C-2 |
| **File** | `.gitignore` |
| **CWE** | CWE-200 (Exposure of Sensitive Information) |

### Before
```
# Ignore
node_modules/
.temp_ag_kit/
antigravity-doc
tests
others
```

### After
```
# Ignore
node_modules/
.temp_ag_kit/
antigravity-doc
tests
others

# Environment variables - prevent sensitive data exposure (CWE-200)
.env
.env.*
.env.local
.env.development
.env.production
```

### Rationale
While `web/.gitignore` already excluded `.env*`, the root `.gitignore` did not. Any `.env` file created at the repository root (e.g., for scripts or MCP configuration) could be accidentally committed, exposing secrets.

---

## Fix 5 — Replace API key placeholder with environment variable reference

| Field | Value |
|-------|-------|
| **Finding** | C-3 |
| **File** | `.agent/mcp_config.json` |
| **Line** | 9 |
| **CWE** | CWE-798 (Use of Hard-coded Credentials) |

### Before
```json
"--api-key", "YOUR_API_KEY"
```

### After
```json
"--api-key", "${CONTEXT7_API_KEY}"
```

### Rationale
The placeholder `YOUR_API_KEY` encourages users to paste real keys directly into the tracked file. Replacing it with an environment variable reference (`${CONTEXT7_API_KEY}`) makes the expected pattern clear: set secrets via environment variables, never in source code. A comment was added to reinforce this practice.
