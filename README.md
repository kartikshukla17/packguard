# PackGuard

> Block AI assistant config files and secrets before they ship to npm.

[![npm](https://img.shields.io/npm/v/packguard)](https://www.npmjs.com/package/packguard)
[![license](https://img.shields.io/npm/l/packguard)](./packages/cli/LICENSE)

A [Lakera audit](https://www.lakera.ai/blog/your-ai-coding-assistant-just-shipped-your-api-keys) of 46,500 npm packages found **428** containing `.claude/settings.local.json`. **33** had live API keys inside. On March 31 2026, Anthropic accidentally published the full 512K-line Claude Code source [via an npm source map](https://www.infoq.com/news/2026/04/claude-code-source-leak/).

Generic secret scanners (gitleaks, trufflehog, Snyk) have no signatures for AI assistant artifacts. None of them intercept at npm pack time — they run post-publish, after the damage is done.

**PackGuard hooks into `prepublishOnly`** — the exact moment before your tarball ships — and refuses to publish until it's clean.

```bash
npx packguard scan
```

---

## Quick start

```bash
# zero-install scan right now
npx packguard scan

# wire it permanently
npx packguard install
```

## What gets blocked

| Path | Tool |
|---|---|
| `.claude/settings.local.json` | Claude Code |
| `.cursor/mcp.json` | Cursor |
| `.codex/config.json` | Codex |
| `.windsurf/config` | Windsurf |
| `.aider.chat.history.md` | Aider |
| `.js.map` with `sourcesContent` | source maps |
| `sk-ant-*`, `ghp_*`, `AKIA*` … | known secret patterns |
| Shannon entropy > 4.5 on 20+ char strings | unknown secrets |

## Monorepo structure

```
PackGuard/
├── apps/
│   └── web/          # Next.js marketing site + dashboard (packguard.kartikshukla.dev)
└── packages/
    └── cli/          # npm package — published as `packguard`
```

## Running locally

```bash
# install dependencies
npm install

# start the web app
npm run dev

# build the CLI
cd packages/cli && npm run build

# test the CLI on any npm package
node packages/cli/dist/cli.js scan
```

## Tech stack

- **CLI** — Node.js, TypeScript, zero runtime dependencies beyond `tar` and `ignore`
- **Web** — Next.js 16, Tailwind CSS v4, Geist font
- **Auth / DB** — Supabase (Postgres + Auth)
- **Payments** — Razorpay (INR) 
- **Email** — Resend
- **Hosting** — Vercel

## Contributing

Issues and PRs welcome. Before submitting, run:

```bash
cd packages/cli && npm run build
```

The CLI has no test suite yet — a good first contribution.

## Sources

- [Your AI Coding Assistant Just Shipped Your API Keys — Lakera (Apr 2026)](https://www.lakera.ai/blog/your-ai-coding-assistant-just-shipped-your-api-keys)
- [Anthropic Accidentally Exposes Claude Code Source via npm Source Map — InfoQ (Apr 2026)](https://www.infoq.com/news/2026/04/claude-code-source-leak/)
- [Claude Code Source Leaked via npm Packaging Error — The Hacker News (Apr 2026)](https://thehackernews.com/2026/04/claude-code-tleaked-via-npm-packaging.html)

## License

MIT © [Kartik Shukla](https://kartikshukla.dev)
