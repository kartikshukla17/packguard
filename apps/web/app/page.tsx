import Link from "next/link";
import Nav from "@/components/Nav";
import TerminalDemo from "@/components/TerminalDemo";

const BLOCKLIST = [
  ".claude/settings.local.json",
  ".cursor/mcp.json",
  ".codex/config.json",
  ".windsurf/config",
  ".aider.chat.history.md",
  "dist/index.js.map",
];

const COMPARISONS = [
  {
    tool: "gitleaks / trufflehog",
    gap: "Runs on git history after the fact. No signatures for AI assistant artifacts.",
  },
  {
    tool: "Socket.dev",
    gap: "Enterprise dependency graph analysis. Runs post-publish, not at pack time.",
  },
  {
    tool: "Snyk",
    gap: "Broad SAST/SCA tool. Not tuned to AI config files. No prepublishOnly intercept.",
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
    a: "The CLI is designed for it. npm support ships in v1. PyPI and cargo hooks are in progress.",
  },
  {
    q: "What's the false-positive rate?",
    a: "AI artifact detection is exact-match against known paths — zero false positives. The entropy scanner can flag base64 in legitimate config; you can add a .packguardignore to suppress.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="inline-flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-full border mb-8"
              style={{
                background: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--fg-muted)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--danger)" }}
              />
              428 npm packages already leaked. Don&apos;t be the 429th.
            </div>

            <h1
              className="font-semibold tracking-tight leading-tight mb-5"
              style={{ color: "var(--fg)", fontSize: "clamp(28px, 5vw, 46px)", lineHeight: 1.15 }}
            >
              Stop shipping your AI
              <br />
              assistant&apos;s secrets.
            </h1>

            <p
              className="leading-relaxed mb-8 max-w-xl"
              style={{ color: "var(--fg-muted)", fontSize: "17px" }}
            >
              A Knostic audit of 46,500 npm packages found 428 containing{" "}
              <code
                className="font-mono text-sm px-1 py-0.5 rounded"
                style={{ background: "var(--surface-2)", color: "var(--fg)" }}
              >
                .claude/settings.local.json
              </code>
              . 33 had live API keys inside. PackGuard intercepts your tarball{" "}
              <em>before</em> it publishes and blocks them.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <div
                className="flex items-center gap-2 font-mono text-sm px-4 py-2.5 rounded border"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--fg)",
                }}
              >
                <span style={{ color: "var(--fg-muted)" }}>$</span>
                npx packguard scan
              </div>
              <Link
                href="/pricing"
                className="text-sm font-medium px-4 py-2.5 rounded"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
              >
                Get started free
              </Link>
              <Link
                href="/demo"
                className="text-sm"
                style={{ color: "var(--fg-muted)" }}
              >
                Try the demo →
              </Link>
            </div>
          </div>
        </section>

        {/* Stat bar */}
        <section
          className="border-y py-8 px-6"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
            {[
              ["428", "packages with AI config files", "var(--danger)"],
              ["33", "with live credentials", "var(--danger)"],
              ["512K", "lines leaked by Anthropic on Mar 31", "var(--warning)"],
            ].map(([stat, label, color]) => (
              <div key={stat}>
                <div
                  className="text-3xl font-semibold font-mono mb-1"
                  style={{ color }}
                >
                  {stat}
                </div>
                <div className="text-xs" style={{ color: "var(--fg-muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
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
                  body: "One command wires packguard into your prepublishOnly script. It runs automatically every time you publish.",
                  code: "packguard install",
                },
                {
                  step: "02",
                  title: "Pack fires",
                  body: "npm runs prepublishOnly, which opens the about-to-ship tarball and inspects every file before it leaves your machine.",
                  code: "npm publish",
                },
                {
                  step: "03",
                  title: "Block or pass",
                  body: "AI config artifacts, embedded source maps, and high-entropy secrets get caught. Everything else ships.",
                  code: "exit 1  # blocked",
                },
              ].map(({ step, title, body, code }) => (
                <div
                  key={step}
                  className="p-6"
                  style={{ background: "var(--surface)" }}
                >
                  <div
                    className="font-mono text-xs mb-4"
                    style={{ color: "var(--fg-muted)" }}
                  >
                    {step}
                  </div>
                  <h3
                    className="text-sm font-semibold mb-2"
                    style={{ color: "var(--fg)" }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>
                    {body}
                  </p>
                  <code
                    className="font-mono text-xs px-2 py-1 rounded"
                    style={{
                      background: "var(--surface-2)",
                      color: "var(--fg)",
                      display: "inline-block",
                    }}
                  >
                    {code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blocklist */}
        <section
          className="py-20 px-6 border-y"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-3xl mx-auto md:grid md:grid-cols-2 md:gap-16 items-start">
            <div>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
                What gets blocked
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                AI coding assistants write state files you never asked for. These paths
                are exact-match signatures — no guessing, no false positives.
              </p>
            </div>

            <div className="mt-8 md:mt-0 space-y-1.5">
              {BLOCKLIST.map((path) => (
                <div
                  key={path}
                  className="flex items-center gap-2 px-3 py-2 rounded font-mono text-xs"
                  style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
                >
                  <span>✗</span>
                  {path}
                </div>
              ))}
              <div
                className="px-3 py-2 font-mono text-xs"
                style={{ color: "var(--fg-muted)" }}
              >
                + entropy scan · source map detection
              </div>
            </div>
          </div>
        </section>

        {/* Live demo */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
              Try it now
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--fg-muted)" }}>
              Paste any file list and see exactly what packguard would block.
            </p>
            <TerminalDemo />
          </div>
        </section>

        {/* vs alternatives */}
        <section
          className="py-20 px-6 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-8"
              style={{ color: "var(--fg-muted)" }}
            >
              Why not use what you already have
            </h2>

            <div
              className="rounded-md overflow-hidden border"
              style={{ borderColor: "var(--border)" }}
            >
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
                    <span className="text-sm font-medium block mb-0.5" style={{ color: "var(--fg)" }}>
                      {tool}
                    </span>
                    <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
                      {gap}
                    </span>
                  </div>
                </div>
              ))}
              <div
                className="flex items-start gap-4 p-4"
                style={{ background: "var(--success-bg)" }}
              >
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 font-bold"
                  style={{ background: "var(--success)", color: "#fff" }}
                >
                  ✓
                </span>
                <div>
                  <span className="text-sm font-medium block mb-0.5" style={{ color: "var(--fg)" }}>
                    PackGuard
                  </span>
                  <span className="text-sm" style={{ color: "var(--fg-muted)" }}>
                    Runs at{" "}
                    <code
                      className="font-mono text-xs px-1 rounded"
                      style={{ background: "var(--surface-2)", color: "var(--fg)" }}
                    >
                      prepublishOnly
                    </code>{" "}
                    — the exact moment before the tarball ships. AI-artifact signatures built in. Free for solo OSS.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="py-20 px-6 border-t"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-xs font-mono uppercase tracking-widest mb-8"
              style={{ color: "var(--fg-muted)" }}
            >
              Questions
            </h2>
            <div className="space-y-8">
              {FAQS.map(({ q, a }) => (
                <div key={q}>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: "var(--fg)" }}>
                    {q}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
              One line. No account required.
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--fg-muted)" }}>
              Free forever for solo OSS maintainers. Upgrade for org-wide policy and audit logs.
            </p>
            <div
              className="inline-flex items-center gap-2 font-mono text-sm px-5 py-3 rounded border mb-4"
              style={{
                background: "var(--surface-2)",
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
            >
              <span style={{ color: "var(--fg-muted)" }}>$</span>
              npx packguard scan
            </div>
            <div>
              <Link
                href="/pricing"
                className="text-sm"
                style={{ color: "var(--primary)" }}
              >
                See pricing →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 px-6"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            packguard
          </span>
          <div className="flex flex-wrap gap-5">
            {[
              ["GitHub", "https://github.com/kartikshukla/packguard"],
              ["Docs", "/docs"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Contact", "mailto:kartik.shukla@finrep.ai"],
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
