import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Pricing — PackGuard",
  description: "Free for solo OSS. ₹799/mo for org-wide policy and audit logs.",
};

const FREE_FEATURES = [
  "npx packguard scan — zero install",
  "prepublishOnly hook installer",
  "AI artifact blocklist (.claude/, .cursor/, .codex/, .windsurf/, .aider/)",
  "Source map embedded-source detection",
  "Entropy + regex secret scan",
  "Unlimited scans, runs locally",
  "No account required",
];

// Pro features split: live vs. coming
const PRO_LIVE: string[] = [
  "Everything in Free",
  "Org audit log (all scans in one dashboard)",
  "PACKGUARD_ORG_TOKEN for CI",
];

const PRO_SOON: string[] = [
  "Org-wide policy config",
  "Slack / email alerts on block",
  "Team invite link",
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold mb-3" style={{ color: "var(--fg)" }}>
              Simple pricing
            </h1>
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
              The CLI is free, forever. Pro adds the org layer — a central audit log
              so you can prove your whole team isn&apos;t leaking keys.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Free */}
            <div
              className="rounded-md border p-6"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--fg-muted)" }}>
                  Free
                </div>
                <div className="text-3xl font-semibold font-mono" style={{ color: "var(--fg)" }}>
                  ₹0
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                  forever · no account needed
                </div>
              </div>

              <ul className="space-y-2.5 mb-8">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                    <span style={{ color: "var(--success)" }} className="mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div
                className="w-full py-2.5 text-center text-sm font-mono rounded border"
                style={{ borderColor: "var(--border)", color: "var(--fg-muted)", background: "var(--surface-2)" }}
              >
                npx packguard scan
              </div>
            </div>

            {/* Pro */}
            <div
              className="rounded-md border-2 p-6 relative"
              style={{ borderColor: "var(--primary)", background: "var(--surface)" }}
            >
              <div
                className="absolute top-4 right-4 text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
              >
                early access
              </div>

              <div className="mb-6">
                <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "var(--fg-muted)" }}>
                  Pro
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold font-mono" style={{ color: "var(--fg)" }}>
                    ₹799
                  </span>
                  <span className="text-sm" style={{ color: "var(--fg-muted)" }}>/mo</span>
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                  $9/mo · per org · cancel anytime
                </div>
              </div>

              <ul className="space-y-2.5 mb-5">
                {PRO_LIVE.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                    <span style={{ color: "var(--primary)" }} className="mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Coming soon divider */}
              <div
                className="text-xs font-mono mb-3 pt-3 border-t"
                style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
              >
                coming soon
              </div>
              <ul className="space-y-2.5 mb-8">
                {PRO_SOON.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm opacity-50" style={{ color: "var(--fg-muted)" }}>
                    <span className="mt-0.5 shrink-0">·</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/login?intent=pro"
                className="block w-full py-2.5 text-center text-sm font-medium rounded"
                style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
              >
                Join early access
              </Link>
            </div>
          </div>

          {/* FAQ row */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Is the free tier really unlimited?",
                a: "Yes. The CLI runs entirely on your machine — we don't meter it. No account, no rate limits, no call-home.",
              },
              {
                q: "What counts as an org?",
                a: "One Pro seat covers all packages under one org (or your personal account). Additional orgs need their own subscription.",
              },
              {
                q: "What does the audit log actually show?",
                a: "Every scan run with your PACKGUARD_ORG_TOKEN: package name, verdict (pass/blocked/warning), timestamp, findings. No source code or file contents — metadata only.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. Cancel from the billing page and access continues until the end of the billing period.",
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--fg)" }}>{q}</h3>
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
