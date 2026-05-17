import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Docs — PackGuard CLI reference",
  description: "Complete CLI reference for packguard scan, packguard install, and org audit log setup.",
};

const COMMANDS = [
  {
    cmd: "npx packguard scan [dir]",
    desc: "Scan the tarball for the npm package in the current directory (or [dir]). Runs npm pack --dry-run, extracts the file list, then checks every file for AI artifacts, source maps with embedded source, and secrets. Exits 0 if clean, 1 if blocked.",
    example: "npx packguard scan\nnpx packguard scan ./my-package",
  },
  {
    cmd: "packguard install",
    desc: "Appends packguard scan to the prepublishOnly script in package.json. If a prepublishOnly hook already exists, packguard scan is prepended to it. Safe to run multiple times — will not duplicate.",
    example: "npx packguard install",
  },
];

const CHECKS = [
  {
    name: "AI artifact block",
    badge: "blocked",
    detail: "Exact-match against known AI coding assistant paths: .claude/, .cursor/, .codex/, .windsurf/, .copilot/, .aider/, and their state file extensions. Any match is a hard block — exit 1.",
  },
  {
    name: "Source map detection",
    badge: "warning",
    detail: "Reads the first 16KB of every .js.map file and checks whether sourcesContent is a non-empty array. Non-empty means original source is embedded and would ship to npm. Flagged as a warning.",
  },
  {
    name: "Secret scan",
    badge: "blocked",
    detail: "Regex matchers for Anthropic keys (sk-ant-*), GitHub tokens (ghp_*, gho_*, ghs_*), AWS access keys (AKIA*), OpenAI keys (sk-*), and Stripe keys. Any match is a hard block.",
  },
  {
    name: "Entropy scan",
    badge: "warning",
    detail: "Shannon entropy > 4.5 on strings of 20+ characters. Catches unrecognized secrets that don't match a known pattern. Flagged as a warning — review before publishing.",
  },
];

const ENV_VARS = [
  {
    name: "PACKGUARD_ORG_TOKEN",
    desc: "Pro org token. Set this in CI or your shell to POST scan results to the org audit log after each scan. Scan metadata only — no file contents.",
  },
];

function Badge({ type }: { type: "blocked" | "warning" }) {
  return (
    <span
      className="font-mono text-xs px-1.5 py-0.5 rounded-sm"
      style={{
        background: type === "blocked" ? "var(--danger-bg)" : "var(--warning-bg)",
        color: type === "blocked" ? "var(--danger)" : "var(--warning)",
      }}
    >
      {type}
    </span>
  );
}

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--fg)" }}>
            CLI reference
          </h1>
          <p className="text-sm mb-12" style={{ color: "var(--fg-muted)" }}>
            packguard v0.1 ·{" "}
            <Link
              href="https://www.npmjs.com/package/packguard"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)" }}
            >
              npmjs.com/package/packguard
            </Link>
          </p>

          {/* Commands */}
          <section className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: "var(--fg-muted)" }}>
              Commands
            </h2>
            <div className="space-y-8">
              {COMMANDS.map(({ cmd, desc, example }) => (
                <div key={cmd}>
                  <code
                    className="font-mono text-sm block mb-2"
                    style={{ color: "var(--fg)" }}
                  >
                    {cmd}
                  </code>
                  <p className="text-sm mb-3" style={{ color: "var(--fg-muted)" }}>
                    {desc}
                  </p>
                  <pre
                    className="font-mono text-xs p-3 rounded border overflow-x-auto"
                    style={{
                      background: "var(--surface-2)",
                      borderColor: "var(--border)",
                      color: "var(--fg)",
                    }}
                  >
                    {example}
                  </pre>
                </div>
              ))}
            </div>
          </section>

          {/* Checks */}
          <section className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: "var(--fg-muted)" }}>
              What gets checked
            </h2>
            <div
              className="rounded-md border overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              {CHECKS.map(({ name, badge, detail }, i) => (
                <div
                  key={name}
                  className="p-4"
                  style={{
                    background: "var(--surface)",
                    borderBottom: i < CHECKS.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>
                      {name}
                    </span>
                    <Badge type={badge as "blocked" | "warning"} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* .packguardignore */}
          <section className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "var(--fg-muted)" }}>
              .packguardignore
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>
              Create a <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--surface-2)", color: "var(--fg)" }}>.packguardignore</code> in your project root to suppress entropy warnings for known-safe files (e.g. vendored base64 assets). Same syntax as .gitignore.
            </p>
            <pre
              className="font-mono text-xs p-3 rounded border"
              style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--fg)" }}
            >
              {`# .packguardignore\n# suppress entropy warnings for vendor fonts\nvendor/fonts/**\npublic/icons/spritesheet.svg`}
            </pre>
          </section>

          {/* Env vars */}
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest mb-6" style={{ color: "var(--fg-muted)" }}>
              Environment variables
            </h2>
            <div className="space-y-4">
              {ENV_VARS.map(({ name, desc }) => (
                <div key={name}>
                  <code className="font-mono text-sm block mb-1" style={{ color: "var(--fg)" }}>
                    {name}
                  </code>
                  <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
