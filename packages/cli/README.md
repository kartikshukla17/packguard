# packguard

Block AI assistant config files and secrets before they ship to npm.

A [Lakera audit](https://www.lakera.ai/blog/your-ai-coding-assistant-just-shipped-your-api-keys) of 46,500 npm packages found 428 containing `.claude/settings.local.json`. 33 had live API keys inside. On March 31 2026, Anthropic accidentally published the full 512K-line Claude Code source via an npm source map. PackGuard intercepts your tarball at `prepublishOnly` — before any of that can happen.

## Install

```bash
# zero-install scan of the current package
npx packguard scan

# wire it permanently into package.json
npx packguard install
```

## What it checks

| Check | Severity | Details |
|---|---|---|
| AI artifact paths | **blocked** | `.claude/`, `.cursor/`, `.codex/`, `.windsurf/`, `.copilot/`, `.aider/` and their state files |
| Source maps with embedded source | warning | `.js.map` files where `sourcesContent` is non-empty |
| Known secret patterns | **blocked** | Anthropic (`sk-ant-*`), GitHub (`ghp_*`), AWS (`AKIA*`), OpenAI (`sk-*`), Stripe |
| High-entropy strings | warning | Shannon entropy > 4.5 on strings of 20+ chars |

Blocked findings exit 1 and prevent publish. Warnings pass but are logged.

## Usage

```bash
# scan the current directory
packguard scan

# scan a specific directory
packguard scan ./my-package

# add prepublishOnly hook to package.json
packguard install
```

After `packguard install`, your `package.json` gets:

```json
{
  "scripts": {
    "prepublishOnly": "packguard scan"
  }
}
```

Now `npm publish` will automatically scan before shipping. If anything is blocked, publish stops with exit 1.

## Example output

```
packguard v0.1.0

Scanning tarball for /your/package...

────────────────────────────────────────────────────────────────────────────────
FILE                                    STATUS   REASON
────────────────────────────────────────────────────────────────────────────────
.claude/settings.local.json             BLOCKED  ai_artifact:.claude
.cursor/mcp.json                        BLOCKED  ai_artifact:.cursor
dist/index.js.map                       WARNING  source_map_with_sources
────────────────────────────────────────────────────────────────────────────────

3 files scanned — 2 blocked  1 warning

✗ Publish blocked. Fix the issues above and retry.
```

## Suppressing false positives

Create a `.packguardignore` in your project root — same syntax as `.gitignore`:

```
# suppress entropy warnings for vendored assets
vendor/fonts/**
public/spritesheet.svg
```

## Org audit log (Pro)

Set `PACKGUARD_ORG_TOKEN` in your environment to send scan metadata to your org's audit dashboard. No file contents are sent — metadata only (package name, verdict, findings, timestamp).

```bash
PACKGUARD_ORG_TOKEN=your_token npm publish
```

## Why not gitleaks / trufflehog / Snyk?

- **gitleaks / trufflehog** — run on git history after the fact. No signatures for `.claude/`, `.cursor/`, or any AI assistant artifact.
- **Socket.dev** — post-publish dependency graph analysis. Doesn't intercept at pack time.
- **Snyk** — broad SAST/SCA. Not tuned to AI config files. No `prepublishOnly` hook.

PackGuard runs at the exact moment before the tarball ships — that's the only moment that matters.

## Links

- [npmjs.com/package/packguard](https://www.npmjs.com/package/packguard)
- [packguard.kartikshukla.dev](https://packguard.kartikshukla.dev)
- [Lakera audit (source)](https://www.lakera.ai/blog/your-ai-coding-assistant-just-shipped-your-api-keys)
- [Anthropic source map incident (InfoQ)](https://www.infoq.com/news/2026/04/claude-code-source-leak/)

## License

MIT
