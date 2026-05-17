import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Settings — PackGuard",
};

export default function SettingsPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold mb-8" style={{ color: "var(--fg)" }}>
            Org settings
          </h1>

          <div className="space-y-6">
            {/* Org token */}
            <div
              className="p-5 rounded-md border"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--fg)" }}>
                Org token
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>
                Set <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--surface-2)", color: "var(--fg)" }}>PACKGUARD_ORG_TOKEN</code> in your environment or CI to send scan results to the audit log.
              </p>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded border font-mono text-xs"
                style={{ borderColor: "var(--border)", background: "var(--surface-2)", color: "var(--fg-muted)" }}
              >
                Sign in with a Pro account to reveal your token
              </div>
            </div>

            {/* Policy config */}
            <div
              className="p-5 rounded-md border"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <h2 className="text-sm font-semibold mb-1" style={{ color: "var(--fg)" }}>
                Policy config
              </h2>
              <p className="text-sm mb-4" style={{ color: "var(--fg-muted)" }}>
                Override which checks are hard-blocks vs. warnings for your org. Pro only.
              </p>
              <pre
                className="font-mono text-xs p-3 rounded border overflow-x-auto"
                style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--fg-muted)" }}
              >
                {`{\n  "block_source_maps": false,\n  "entropy_threshold": 4.5\n}`}
              </pre>
            </div>

            <div className="pt-2">
              <Link href="/app/billing" className="text-sm" style={{ color: "var(--primary)" }}>
                Manage billing →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
