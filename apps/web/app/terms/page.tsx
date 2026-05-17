import Nav from "@/components/Nav";

export const metadata = {
  title: "Terms of service — PackGuard",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--fg)" }}>
            Terms of service
          </h1>
          <p className="text-xs mb-10" style={{ color: "var(--fg-muted)" }}>Last updated: May 2026</p>

          <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>Use of the CLI</h2>
              <p>
                The packguard CLI is provided as-is. It is your responsibility to review its output and make publish decisions. PackGuard does not guarantee that every secret or AI artifact will be detected.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>Pro subscriptions</h2>
              <p>
                Pro subscriptions are billed monthly via Razorpay. You can cancel at any time. Refunds are handled case by case — contact us within 7 days of a charge.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>Limitation of liability</h2>
              <p>
                PackGuard is a best-effort tool. We are not liable for any credentials or source code that leak despite using PackGuard. Always review your publish tarball manually before shipping to production.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>Contact</h2>
              <p>
                <a href="mailto:kartikshukla1707@gmail.com" style={{ color: "var(--primary)" }}>kartikshukla1707@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
