You are vibe-coding a new indie SaaS project. Generate a comprehensive `plan.md` in the project root that I (or another Claude) can follow to build and ship this product in 24–48 hours.

## Inputs

### The idea
<idea>
Title: PackGuard
Pain: Indie developers using Claude Code, Cursor, Codex, and similar AI coding assistants are silently leaking secrets into published packages. A Knostic audit of 46,500 npm packages found 428 containing .claude/settings.local.json — 33 of those exposed live credentials. On March 31, 2026, Anthropic itself accidentally published the entire 512K-line Claude Code source via an npm source map because no pre-publish tarball check existed. Generic secret scanners (gitleaks, trufflehog) and enterprise supply-chain platforms (Socket.dev, Endor Labs, Snyk) do not have signatures for the new class of AI-assistant config artifacts, and none of them intercept at the npm-pack moment — they run post-publish in CI, after the damage is done.
Audience: Solo OSS maintainers and indie hackers who publish to npm, PyPI, or crates.io and use AI coding assistants (Claude Code, Cursor, Codex, Windsurf, Copilot, Aider) in their workflow.
Proposed Solution: A one-line install CLI plus lifecycle hooks (npm prepublishOnly / Python build hook / cargo publish hook) that opens the about-to-publish tarball before it ships and: (1) blocks AI-tool config artifacts (.claude/, .cursor/, .codex/, .windsurf/, .copilot/, .aider/ and their state files), (2) flags source maps that embed original source, (3) runs an entropy + known-pattern secret scan and hard-refuses to publish until cleared. Free for solo OSS maintainers. Paid $9/mo (₹799/mo) for org-wide policy enforcement and a shareable audit log.
Source Link: https://www.knostic.ai/blog/ai-tool-config-leak (Knostic audit) + https://twitter.com/anthropic/status/... (March 31 source map incident)
Category: Developer Tools / Security
Pricing: Free tier (solo OSS CLI, unlimited scans, no account required). Pro: ₹799/mo INR / $9/mo international — org policy config, audit log, Slack/email alerts, team seat management.
</idea>

### Design style preferences
<style>
Vibe: minimal-tech — think linear.app + vercel.com + socket.dev. Clean, dark-first, mono accents. Security credibility without enterprise bloat.
Primary color: Electric indigo (#6366F1 family) — close enough to trust/security without being cliché infosec red.
Vibe references: linear.app, vercel.com, resend.com, socket.dev
Font preference: Geist (sans + mono) via next/font
Density: tight — small radii (4px default), compact spacing, monospace for all file paths and code snippets
Motion: subtle — 150ms ease-out only, no bouncy springs. A brief red flash on a blocked file name is the only "dramatic" motion allowed.
Dark mode: default. Light mode is an opt-in toggle.
</style>

## Locked stack (do not deviate)
- Hosting: Vercel (frontend + serverless edge/node).
- DB + Auth + Storage: Supabase (Postgres + Auth + optional buckets).
- Email (transactional): Resend.
- DNS / CDN / file storage: Cloudflare.
- Payments: Razorpay (INR audience) — checkout + webhooks. Defer Lemon Squeezy until first international paying customer.
- LLM: OpenRouter (one API key, fallbacks) — only needed for the "explain this leak" natural language feature, not core scanning.
- Errors: Vercel logs only.
- Domain: deploy on `packguard.kartikshukla.dev` for v1. Only buy a dedicated domain after first paying customer.

Do NOT introduce tools not on this list. If you think you need one, flag it in plan.md under "Open questions" instead.

## Output: a single `plan.md` with these sections

### 1. Product Brief
- Problem (one paragraph, specific — cite the 428/46,500 statistic, the 33 live credential packages, and the Anthropic March 31 source map incident by name)
- Audience (who they are, where they hang out — npm maintainer Discord servers, r/node, r/rust, Indie Hackers, Hacker News, X/dev Twitter)
- Proposed Solution (2–3 paragraphs expanding the pitch — emphasize the tarball-intercept moment as the key technical differentiator, and the AI-artifact signature library as the moat)
- The Wedge — explicit v1 scope:
  **IN for v1:**
  - npx packguard scan (zero-install scan of current directory tarball)
  - prepublishOnly hook installer (one command wires it into package.json)
  - AI-artifact blocklist: .claude/, .cursor/, .codex/, .windsurf/, .copilot/, .aider/ and their known state file extensions
  - Source map original-source detection
  - Entropy-based secret scan with known-pattern matchers (AWS, GH token, Anthropic key formats)
  - CLI output: red/green terminal report with file-by-file verdict
  - Landing page with live demo (paste a file list, see what would be blocked)
  - Auth + paid plan (Razorpay) for org audit log
  **OUT for v1:**
  - PyPI and crates.io hooks (design the CLI to support them, ship stubs, but do not wire)
  - VS Code / IDE extension
  - GitHub Action (document it exists as a future integration, don't build)
  - SBOM generation
  - AI-powered "explain this leak" (flag for v2, needs OpenRouter)
  - Team seat management UI beyond simple invite link
- Differentiators vs. 3 named alternatives:
  - gitleaks / trufflehog: runs in git history, not at pack time; has no AI-artifact signatures
  - Socket.dev: enterprise-priced, post-publish dependency graph analysis, not a pre-publish tarball scanner
  - Snyk: broad SAST/SCA tool, not tuned to AI-assistant artifacts, no npm-pack-moment hook

### 2. Design System
Concrete tokens:
- Color palette as CSS custom properties — minimum 9 vars (light-first): `--bg` (#FAFAFA), `--surface` (#FFFFFF), `--surface-2` (#F4F4F8), `--fg` (#0A0A0F), `--fg-muted` (#5C5C7A), `--primary` (#6366F1), `--primary-fg` (#FFFFFF), `--danger` (#EF4444), `--success` (#22C55E), `--warning` (#F59E0B), `--mono` font for paths/code. Border: `--border` (#E2E2EE).
- Typography: Geist Sans + Geist Mono via next/font. Type scale xs(11px) → sm(13px) → base(15px) → lg(17px) → xl(20px) → 2xl(24px) → 3xl(30px) → 4xl(38px). All file paths and package names in Geist Mono.
- Spacing scale: 4px base, stops at 4/8/12/16/24/32/48/64px.
- Radius scale: sm=2px, md=4px, lg=6px, full=9999px.
- Component primitives — exact Tailwind class strings for: Button (primary/destructive/ghost), Input, Card, Badge (safe/blocked/warning), Terminal output block, Toast.
- Motion: 150ms ease-out on all transitions. The one exception: blocked file names flash `bg-red-500/20` for 300ms then fade — this is intentional. No other animations.
- Light-first: the `--bg`/`--surface` tokens above are the default. Dark mode opt-in inverts to deep surfaces (#0A0A0F bg, #111118 surface) with `--fg` lightening to #F0F0FF. Toggle in nav.

### 3. Tech Architecture
- URL structure: `/` (landing), `/demo` (interactive file-list scanner), `/pricing`, `/login`, `/app` (audit log dashboard), `/app/settings` (org policy config), `/app/billing`, `/docs` (CLI reference), `/api/webhook/razorpay`, `/api/scan` (POST — receives file list + metadata, returns scan report JSON — used by the landing demo and potentially future IDE integrations), `/api/audit-log` (GET, auth-gated).
- Supabase schema — every table with columns, types, foreign keys, RLS policies, and the SQL to create it:
  - `users` (managed by Supabase Auth)
  - `orgs` (id, created_at, name, slug, owner_user_id fk→users, plan enum(free|pro), razorpay_subscription_id, policy_config jsonb)
  - `org_members` (id, org_id fk→orgs, user_id fk→users, role enum(owner|member), invited_at, joined_at)
  - `scan_results` (id, created_at, user_id fk→users nullable, org_id fk→orgs nullable, package_name, package_version, registry enum(npm|pypi|cargo), verdict enum(pass|blocked|warning), findings jsonb, cli_version, run_from text)
  - `subscriptions` (id, created_at, org_id fk→orgs, razorpay_subscription_id, razorpay_plan_id, status enum(active|paused|cancelled), current_period_end timestamptz)
  - `events` standard table (id, created_at, user_id, event_type enum(page_view|signup|activated|paid|scan_run|package_blocked|secret_found|ai_artifact_found), metadata jsonb, utm_source, utm_campaign)
  - RLS: scan_results readable only by the user or org members. events writable by service role only.
- External APIs: none required for v1 core mechanic (scanning is pure CLI-side computation). `/api/scan` on the web demo runs the same logic serverless. OpenRouter deferred to v2.
- Env vars grouped by service: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY | RESEND_API_KEY | RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET | OPENROUTER_API_KEY (set but unused in v1).
- Vercel config: all routes Node runtime (not edge — tarball parsing needs Node APIs). Cron: none for v1.
- Razorpay: create one Plan (₹799/mo, interval=monthly). Webhook events: subscription.activated, subscription.charged, subscription.cancelled, payment.failed.
- CLI package: published separately to npm as `packguard` (scoped or unscoped). The Next.js app is the dashboard + marketing site only. The CLI is a standalone package in a `/cli` subdirectory of the monorepo with its own package.json. Use `tar` (Node built-in via npm package) + `ignore` package for .npmignore/.gitignore parsing. No heavy deps.

### 4. MVP Task Breakdown
Ordered list, each task 15 min – 2 hr. Group into 6 phases:

**Phase 1 — Skeleton**
- Clone the indie starter template, rename project to packguard
- Set up monorepo: `/apps/web` (Next.js), `/packages/cli` (Node CLI)
- Deploy empty Next.js app to Vercel
- Attach subdomain `packguard.kartikshukla.dev` via Cloudflare DNS CNAME
- Initialize Supabase project, run schema SQL, confirm connection
- Set all env vars in Vercel dashboard

**Phase 2 — Landing page**
- Hero: headline "Stop shipping your AI assistant's secrets" + subheadline citing the 428-package statistic + `npx packguard` CTA
- How it works: 3-step visual (install hook → pack → blocked with red output)
- Interactive demo: textarea accepts a simulated file list, `/api/scan` returns which files would be blocked, renders terminal-style output in the browser
- Pricing section: Free (OSS solo) vs Pro (₹799/mo org) with feature comparison
- FAQ: "Does this send my code anywhere?", "Which AI tools does it cover?", "Does it work with PyPI/cargo?", "What's the false-positive rate?"
- Footer: terms / privacy / contact / GitHub link

**Phase 3 — Auth + payments**
- Supabase magic link auth wired to /login
- Post-login redirect to /app
- Razorpay checkout flow triggered from /pricing Pro CTA
- Webhook handler at /api/webhook/razorpay: on subscription.activated → upsert orgs + subscriptions rows + set plan=pro
- /app gated by middleware: redirect to /login if no session
- /app/billing shows current plan + Razorpay portal link

**Phase 4 — Core mechanic (CLI)**
- `packguard scan` command: runs `npm pack --dry-run` (or reads existing tarball), extracts file list, runs three checks in sequence:
  - AI artifact check: match against blocklist of known AI-tool paths/extensions (.claude/settings.local.json, .cursor/**, .codex/**, .windsurf/**, .copilot/**, .aider/**, **/.claude/**, **/settings.local.json)
  - Source map check: detect .js.map files where the `sourcesContent` field contains original source (read first 8KB of each map file, parse JSON, check sourcesContent array is non-empty)
  - Secret scan: Shannon entropy > 4.5 on 20+ char strings, plus regex matchers for ANTHROPIC_API_KEY (sk-ant-*), GitHub tokens (ghp_*), AWS keys (AKIA*), generic Bearer tokens
- CLI output: color-coded terminal table. Red rows = blocked (hard fail, exit 1). Yellow = warning (passes but logs). Green = clean.
- `packguard install` command: appends `"prepublishOnly": "packguard scan"` to package.json scripts
- Audit log: on each scan, POST results to /api/audit-log (if PACKGUARD_ORG_TOKEN env var is set — org Pro feature)
- Wire /api/scan to run the same logic serverless for the landing demo (accept JSON file list, return findings)

**Phase 5 — Polish + measurement**
- Add Vercel Web Analytics (`<Analytics />` in layout.tsx)
- Write events table on: page_view (middleware), signup (auth hook), activated (post-magic-link), paid (razorpay webhook), scan_run, package_blocked, secret_found, ai_artifact_found
- UTM helper: read utm_* from URL on landing, store in localStorage, attach to signup event metadata
- Error boundaries on /app routes
- 404 and 500 pages (on-brand terminal-style output)
- Lighthouse audit: target 90+ Performance + Accessibility
- Test prepublishOnly hook end-to-end with a dummy package containing a .claude/ folder

**Phase 6 — Launch prep**
- OG image (1200×630): dark bg, "packguard" in Geist Mono, "428 packages. 33 leaking live keys." in red mono below
- Demo GIF: 30-second screen recording of `npm publish` being blocked with red terminal output
- Product Hunt assets: gallery images (terminal screenshot, architecture diagram, stat callout card)
- X thread draft (see Distribution Plan)
- Reddit post drafts (see Distribution Plan)
- Hacker News Show HN draft (see Distribution Plan)

### 5. Definition of Done (Launch Checklist)
- `packguard.kartikshukla.dev` resolves over HTTPS
- Landing page Lighthouse 90+ Performance + Accessibility
- `npx packguard scan` on a repo with .claude/settings.local.json exits 1 and prints the blocked file in red
- `packguard install` correctly adds prepublishOnly hook to package.json
- Signup → magic link email arrives via Resend → user lands in /app
- Razorpay test checkout completes → webhook fires → org row has plan=pro in DB
- Interactive landing demo: paste a file list containing .claude/ → browser shows blocked output
- events table records page_view, signup, activated, paid, scan_run, ai_artifact_found
- UTM links work for X / Reddit / PH / IH / HN
- Footer has terms / privacy / contact email / GitHub link
- OG image renders correctly on Twitter card preview
- Mobile (375px) layout works — terminal output wraps, not overflows

### 6. Distribution Plan
- **X thread** — 7 tweets, full draft:
  1. Hook: "428 npm packages contain .claude/settings.local.json. 33 of them have live API keys inside. Here's how it happens and how to stop it. 🧵"
  2. The mechanism: AI coding assistants write config to dotfiles. Those dotfiles aren't in .gitignore. npm pack grabs them.
  3. The Anthropic incident: on March 31 2026, Anthropic published the full 512K-line Claude Code source via an npm source map. No pre-publish tarball check existed.
  4. The gap: gitleaks, trufflehog, Snyk — none of them have signatures for .claude/, .cursor/, .codex/. None of them run at npm-pack time.
  5. What I built: PackGuard — one line in package.json, blocks the publish if it finds AI config artifacts, source maps with embedded source, or high-entropy secrets.
  6. It's free for solo OSS. $9/mo for org-wide policy + audit log. Zero telemetry unless you opt into the audit log.
  7. CTA: "npx packguard scan right now — see what would have shipped. Link in bio."
- **Reddit** — 3 subreddits:
  - r/node — title: "I scanned 46,500 npm packages and found 428 with .claude/settings.local.json inside — here's the tool I built to stop it happening to you"
  - r/rust — title: "AI coding assistants are leaking config files into published crates — built a pre-publish scanner for cargo (and npm/PyPI)"
  - r/programming — title: "Anthropic accidentally shipped 512K lines of Claude Code source via npm source map in March. I built the thing that would have caught it."
  All bodies: story-first (I was auditing packages and found this / I nearly shipped my own .cursor state / here's what I found). Link to the Knostic audit. Show the terminal output screenshot. Drop the repo + npx command at the end. No "please try my product" opener.
- **Product Hunt**: tagline: "Block AI config leaks before npm publish fires" (48 chars). Description: "428 npm packages already contain AI assistant dotfiles. 33 exposed live keys. PackGuard hooks into prepublishOnly, scans your tarball for .claude/, .cursor/, source maps, and secrets — and refuses to publish until it's clean. Free for solo OSS." (244 chars). Gallery images: (1) blocked terminal output screenshot, (2) stat card "428 / 46,500", (3) architecture: pack → scan → block diagram, (4) landing page hero, (5) audit log dashboard. Launch: next Wednesday. Maker comment: "Built this after reading the Knostic audit and realizing I'd been using Claude Code for 3 months without knowing it writes live config to .claude/settings.local.json. Checked my own packages. Found one with a partial API key in a state file. Shipped this in a weekend."
- **Indie Hackers**: milestones post framed as build-in-public — "Day 1: found the stat, built the CLI in one sitting. Day 2: wired the dashboard + payments. Here's what I shipped, what I cut, and what the first scan caught in my own repos."
- **Hacker News Show HN**: title: "Show HN: PackGuard – blocks AI assistant dotfiles and secrets before npm publish". First comment: explain the Knostic finding, the Anthropic source map incident, why existing scanners miss this class of artifact, and the technical approach (tarball intercept + entropy + AI-artifact signatures). Schedule: next Saturday 8 AM PT.

### 7. Measurement Setup
- Event names for this product's funnel (in addition to standard 4):
  - `scan_run` — metadata: {package_name, registry, file_count, cli_version}
  - `ai_artifact_found` — metadata: {artifact_type: '.claude'|'.cursor'|'.codex'|'.windsurf'|'.aider', file_path, package_name}
  - `source_map_flagged` — metadata: {file_path, has_sources_content: bool}
  - `secret_found` — metadata: {matcher: 'entropy'|'anthropic_key'|'github_token'|'aws_key'|'generic_bearer', file_path}
  - `package_blocked` — metadata: {package_name, blocking_reason: string[]}
  - `hook_installed` — metadata: {package_name, existing_prepublish: bool}
  - `org_invited_member` — metadata: {org_id}
- UTM conventions: X `?utm_source=x&utm_campaign=launch`, Reddit `?utm_source=reddit&utm_medium=node` (swap subreddit), PH `?utm_source=ph`, IH `?utm_source=ih`, HN `?utm_source=hn`
- Vercel Web Analytics: `<Analytics />` in apps/web/app/layout.tsx
- Google Alert: "packguard npm" + "AI config leak npm". Saved X search: "packguard OR .claude settings.local.json npm"

### 8. Post-Launch Decision Points
- **30 days**: 0 paying orgs AND weekly unique visitors flat week-over-week → kill. Archive repo, post IH post-mortem, move on.
- **60 days**: ≥10 paying orgs (₹7,990 MRR) OR ≥1,000 weekly uniques → growing. 80% of build time here: wire PyPI + cargo hooks, build GitHub Action, ship VS Code extension.
- **90 days**: still coasting (1–9 paying orgs, <1,000 weekly) → archive. The TAM for solo OSS maintainers willing to pay for org features is too narrow; the free tier as a loss leader didn't convert.

### 9. Open Questions
- Should the CLI call home at all on free tier? Even anonymized scan stats would validate the "X scans run" social proof counter on the landing page. Flag this — adds privacy surface area, need to decide before launch.
- Cargo publish hooks require a custom runner (cargo doesn't have prepublishOnly equivalent). The plan stubs this — flag whether a Makefile target or a cargo-packguard subcommand is the right approach.
- The /api/scan endpoint receives file paths and content snippets from the landing demo. Decide on a max payload size and whether to log anything — even temporarily — given this is a security tool. Users will be sensitive.
- If the Knostic audit blog post goes offline, the primary citation disappears. Mirror the key stats in the landing page copy with a dated reference, don't link-only.
- Lemon Squeezy for international: the first international customer will likely arrive via HN. Have the Lemon Squeezy account ready but unpublished so it can go live within hours.

---

When `plan.md` is done, do NOT start coding. Wait for me to review and say "execute Phase 1". Build only one phase at a time, then pause for review.