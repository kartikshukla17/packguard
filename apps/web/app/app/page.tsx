import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Dashboard — PackGuard",
};

export default function AppDashboard() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--fg)" }}>
                Audit log
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
                All scans run with your org token appear here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/app/settings"
                className="text-sm px-3 py-1.5 rounded border"
                style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface)" }}
              >
                Settings
              </Link>
              <Link
                href="/app/billing"
                className="text-sm px-3 py-1.5 rounded border"
                style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface)" }}
              >
                Billing
              </Link>
            </div>
          </div>

          {/* Empty state */}
          <div
            className="rounded-md border p-16 text-center"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <p className="font-mono text-xs mb-2" style={{ color: "var(--fg-muted)" }}>
              No scans yet
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
              Set <code className="font-mono text-xs px-1 rounded" style={{ background: "var(--surface-2)", color: "var(--fg)" }}>PACKGUARD_ORG_TOKEN</code> in your environment to start logging scans here.
            </p>
            <Link
              href="/app/settings"
              className="text-sm font-medium px-4 py-2 rounded inline-block"
              style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
            >
              Get org token
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
