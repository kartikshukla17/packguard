import Nav from "@/components/Nav";
import TerminalDemo from "@/components/TerminalDemo";

export const metadata = {
  title: "Live demo — PackGuard",
  description: "Paste a file list and see exactly what PackGuard would block before npm publish.",
};

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
              Interactive demo
            </h1>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
              Paste any file list — one path per line — and see what packguard would
              block. This runs the same logic as the CLI, serverless.
            </p>
          </div>

          <TerminalDemo />

          <div
            className="mt-8 p-4 rounded border text-sm"
            style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--fg-muted)" }}
          >
            <p className="font-mono text-xs mb-2" style={{ color: "var(--fg-muted)" }}>
              # To run this on your actual package:
            </p>
            <p className="font-mono text-xs" style={{ color: "var(--fg)" }}>
              npx packguard scan
            </p>
            <p className="font-mono text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
              # Or wire it permanently:
            </p>
            <p className="font-mono text-xs" style={{ color: "var(--fg)" }}>
              npx packguard install
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
