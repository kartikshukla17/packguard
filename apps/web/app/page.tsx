import Link from "next/link";
import Nav from "@/components/Nav";
import TerminalDemo from "@/components/TerminalDemo";
import HeroTerminal from "@/components/HeroTerminal";
import WaitlistForm from "@/components/WaitlistForm";

const BLOCKLIST = [
  { path: ".claude/settings.local.json", tool: "Claude Code" },
  { path: ".cursor/mcp.json", tool: "Cursor" },
  { path: ".codex/config.json", tool: "Codex" },
  { path: ".windsurf/config", tool: "Windsurf" },
  { path: ".aider.chat.history.md", tool: "Aider" },
  { path: "dist/index.js.map", tool: "source map" },
];

const COMPARISONS = [
  {
    tool: "gitleaks / trufflehog",
    gap: "Scans git history after the fact. No signatures for .claude/, .cursor/, or any other AI assistant artifact.",
  },
  {
    tool: "Socket.dev",
    gap: "Enterprise dependency graph analysis. Runs post-publish. Doesn't intercept at npm pack time.",
  },
  {
    tool: "Snyk",
    gap: "Broad SAST/SCA tool. Not tuned to AI config files. No prepublishOnly hook.",
  },
];

const FAQS = [
  {
    q: "Does this send my code anywhere?",
    a: "No. The CLI runs entirely on your machine. Nothing leaves your system unless you opt into the Pro audit log, which only sends scan metadata — never file contents.",
  },
  {
    q: "Which AI tools does it cover?",
    a: "Claude Code (.claude/), Cursor (.cursor/), Codex (.codex/), Windsurf (.windsurf/), Copilot (.copilot/), and Aider (.aider/). New tools get added as they emerge.",
  },
  {
    q: "Does it work with PyPI or cargo?",
    a: "The CLI is designed for it. npm support ships in v1. PyPI and cargo hooks are planned next.",
  },
  {
    q: "What's the false-positive rate?",
    a: "AI artifact detection is exact-match against known paths — zero false positives there. The entropy scanner can flag base64 in legitimate config; add a .packguardignore to suppress specific files.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="pt-28 pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* left */}
              <div>
                <div
                  className="inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-full border mb-7"
                  style={{
                    background: "var(--surface-2)",
                    borderColor: "var(--border)",
                    color: "var(--fg-muted)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--danger)" }} />
                  428 npm packages already leaked
                </div>

                <h1
                  className="font-semibold tracking-tight leading-none mb-5"
                  style={{ color: "var(--fg)", fontSize: "clamp(30px, 4.5vw, 48px)", lineHeight: 1.1 }}
                >
                  Stop shipping
                  <br />
                  your AI assistant&apos;s
                  <br />
                  secrets.
                </h1>

                <p className="text-sm leading-relaxed mb-7 max-w-sm" style={{ color: "var(--fg-muted)" }}>
                  A{" "}
                  <a
                    href="https://www.lakera.ai/blog/your-ai-coding-assistant-just-shipped-your-api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--fg)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Lakera audit
                  </a>
                  {" "}of 46,500 npm packages found{" "}
                  <strong style={{ color: "var(--fg)" }}>428</strong> containing{" "}
                  <code className="font-mono text-xs px-1 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--fg)" }}>
                    .claude/settings.local.json
                  </code>
                  . 33 had live API keys. PackGuard intercepts the tarball{" "}
                  <em>before</em> it ships.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex items-center gap-2 font-mono text-sm px-3.5 py-2 rounded border"
                    style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--fg)" }}
                  >
                    <span style={{ color: "var(--fg-muted)" }}>$</span>
                    npx packguard scan
                  </div>
                  <Link
                    href="https://www.npmjs.com/package/packguard"
                    className="text-sm"
                    style={{ color: "var(--fg-muted)" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    npm →
                  </Link>
                  <Link
                    href="/demo"
                    className="text-sm"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    demo →
                  </Link>
                </div>
              </div>

              {/* right — live terminal output */}
              <div>
                <HeroTerminal />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stat bar ───────────────────────────────────────────── */}
        <section
          className="border-y py-8 px-6"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
            {[
              ["428", "npm packages with AI config files", "var(--danger)"],
              ["33", "of those had live credentials", "var(--danger)"],
              ["512K", "lines leaked by Anthropic on Mar 31", "var(--warning)"],
            ].map(([stat, label, color]) => (
              <div key={stat}>
                <div className="font-mono font-semibold mb-1" style={{ color, fontSize: "28px" }}>
                  {stat}
                </div>
                <div className="text-xs leading-snug" style={{ color: "var(--fg-muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-10"
              style={{ color: "var(--fg-muted)" }}
            >
              How it works
            </h2>

            <div className="grid md:grid-cols-3 gap-px" style={{ background: "var(--border)" }}>
              {[
                {
                  step: "01",
                  title: "Install the hook",
                  body: "One command wires packguard into your prepublishOnly script. Runs automatically on every publish.",
                  code: "packguard install",
                },
                {
                  step: "02",
                  title: "npm publish fires",
                  body: "The hook opens the about-to-ship tarball and inspects every file before it leaves your machine.",
                  code: "npm publish",
                },
                {
                  step: "03",
                  title: "Block or pass",
                  body: "AI config artifacts, embedded source maps, and high-entropy secrets get caught. Everything else ships.",
                  code: "exit 1  # blocked",
                },
              ].map(({ step, title, body, code }) => (
                <div key={step} className="p-6" style={{ background: "var(--surface)" }}>
                  <div className="font-mono text-xs mb-4" style={{ color: "var(--fg-muted)" }}>{step}</div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--fg)" }}>{title}</h3>
                  <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>{body}</p>
                  <code
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{ background: "var(--surface-2)", color: "var(--fg)", display: "inline-block" }}
                  >
                    {code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Blocklist ──────────────────────────────────────────── */}
        <section
          className="py-20 px-6 border-y"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-16 items-start">
            <div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
                What gets blocked
              </h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--fg-muted)" }}>
                Every major AI coding assistant writes state files you never explicitly created.
                These are exact-match signatures — no heuristics, no false positives.
              </p>
              <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                On top of that: source maps with embedded source and high-entropy strings matching
                known secret formats (Anthropic, GitHub, AWS, OpenAI, Stripe).
              </p>
            </div>

            <div className="mt-8 md:mt-0 space-y-1.5">
              {BLOCKLIST.map(({ path, tool }) => (
                <div
                  key={path}
                  className="flex items-center justify-between px-3 py-2 rounded"
                  style={{ background: "var(--danger-bg)" }}
                >
                  <span className="font-mono text-xs" style={{ color: "var(--danger)" }}>
                    {path}
                  </span>
                  <span
                    className="text-xs ml-4 shrink-0 px-1.5 py-0.5 rounded-sm font-mono"
                    style={{ background: "var(--surface-2)", color: "var(--fg-muted)" }}
                  >
                    {tool}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Live demo ──────────────────────────────────────────── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-12 items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
                Try it now
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
                Paste any file list and see exactly what packguard would block.
                Same logic as the CLI, running serverless.
              </p>
              <div
                className="p-4 rounded border text-sm space-y-1"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <p className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}># or run it directly on your package:</p>
                <p className="font-mono text-xs" style={{ color: "var(--fg)" }}>npx packguard scan</p>
                <p className="font-mono text-xs mt-2" style={{ color: "var(--fg-muted)" }}># wire it permanently:</p>
                <p className="font-mono text-xs" style={{ color: "var(--fg)" }}>npx packguard install</p>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <TerminalDemo />
            </div>
          </div>
        </section>

        {/* ── vs. alternatives ───────────────────────────────────── */}
        <section
          className="py-20 px-6 border-t"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-8"
              style={{ color: "var(--fg-muted)" }}
            >
              Why not use what you already have
            </h2>

            <div className="rounded-md border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              {COMPARISONS.map(({ tool, gap }) => (
                <div
                  key={tool}
                  className="flex items-start gap-4 p-4 border-b"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5"
                    style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
                  >
                    ✗
                  </span>
                  <div>
                    <span className="text-sm font-medium block mb-0.5" style={{ color: "var(--fg)" }}>{tool}</span>
                    <span className="text-sm" style={{ color: "var(--fg-muted)" }}>{gap}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4 p-4" style={{ background: "var(--success-bg)" }}>
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 font-bold"
                  style={{ background: "var(--success)", color: "#fff" }}
                >
                  ✓
                </span>
                <div>
                  <span className="text-sm font-medium block mb-0.5" style={{ color: "var(--fg)" }}>PackGuard</span>
                  <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
                    Runs at{" "}
                    <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--surface-2)", color: "var(--fg)" }}>
                      prepublishOnly
                    </code>
                    {" "}— the exact moment before the tarball ships. AI-artifact signatures built in. Free for solo OSS, no account needed.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────── */}
        <section className="py-20 px-6 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-8"
              style={{ color: "var(--fg-muted)" }}
            >
              Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
              {FAQS.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--fg)" }}>{q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA — two columns ────────────────────────────── */}
        <section
          className="py-20 px-6 border-t"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-16 items-start">
            {/* Free CTA */}
            <div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
                Start right now. Free.
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--fg-muted)" }}>
                No account, no install. One command checks your entire package tarball.
              </p>
              <div
                className="flex items-center gap-2 font-mono text-sm px-4 py-3 rounded border w-fit"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--fg)" }}
              >
                <span style={{ color: "var(--fg-muted)" }}>$</span>
                npx packguard scan
              </div>
            </div>

            {/* Pro waitlist */}
            <div className="mt-10 md:mt-0">
              <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
                Pro is in early access.
              </h2>
              <p className="text-sm mb-5" style={{ color: "var(--fg-muted)" }}>
                Org audit log, CI token, team controls — ₹799/mo when it ships.
                Leave your email and I&apos;ll reach out when it&apos;s ready.
              </p>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer
        className="border-t py-8 px-6"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            packguard · by{" "}
            <a
              href="https://kartikshukla.dev"
              style={{ color: "var(--fg-muted)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              kartikshukla.dev
            </a>
          </span>
          <div className="flex flex-wrap gap-5">
            {[
              ["npm", "https://www.npmjs.com/package/packguard"],
              ["GitHub", "https://github.com/kartikshukla/packguard"],
              ["Docs", "/docs"],
              ["Pricing", "/pricing"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Contact", "mailto:kartikshukla1707@gmail.com"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-xs"
                style={{ color: "var(--fg-muted)" }}
                target={href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
