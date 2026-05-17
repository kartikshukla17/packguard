import Nav from "@/components/Nav";
import Link from "next/link";

export const metadata = {
  title: "Billing — PackGuard",
};

export default function BillingPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold mb-8" style={{ color: "var(--fg)" }}>
            Billing
          </h1>

          <div
            className="p-6 rounded-md border mb-6"
            style={{ borderColor: "var(--border)", background: "var(--surface)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--fg)" }}>Current plan</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--fg-muted)" }}>
                  Sign in to see your plan
                </div>
              </div>
              <span
                className="text-xs font-mono px-2 py-1 rounded-full border"
                style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
              >
                free
              </span>
            </div>

            <Link
              href="/pricing"
              className="inline-block text-sm font-medium px-4 py-2 rounded"
              style={{ background: "var(--primary)", color: "var(--primary-fg)" }}
            >
              Upgrade to Pro — ₹799/mo
            </Link>
          </div>

          <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
            Payments processed by Razorpay. Cancel anytime from this page.
          </p>
        </div>
      </main>
    </>
  );
}
