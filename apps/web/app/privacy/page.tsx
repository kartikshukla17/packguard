import Nav from "@/components/Nav";

export const metadata = {
  title: "Privacy policy — PackGuard",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6 min-h-screen" style={{ background: "var(--bg)" }}>
        <div className="max-w-2xl mx-auto prose prose-sm" style={{ color: "var(--fg-muted)" }}>
          <h1 className="text-2xl font-semibold mb-1" style={{ color: "var(--fg)" }}>
            Privacy policy
          </h1>
          <p className="text-xs mb-10" style={{ color: "var(--fg-muted)" }}>Last updated: May 2026</p>

          <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--fg-muted)" }}>
            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>What we collect</h2>
              <p>
                The free CLI collects nothing. It runs entirely on your machine. No telemetry, no call-home, no analytics.
              </p>
              <p className="mt-2">
                If you create an account and opt into the Pro audit log, we store: your email address, scan metadata (package name, verdict, file count, timestamp), and your Razorpay subscription ID. We never store file contents or source code.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>The /api/scan demo endpoint</h2>
              <p>
                The interactive demo on the landing page sends a list of file paths (no content) to our servers. We do not log these requests beyond standard Vercel access logs, which are retained for 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>Third parties</h2>
              <p>
                We use Supabase (database, auth), Resend (transactional email), Razorpay (payments), and Vercel (hosting). Each has their own privacy policy. We do not sell your data.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--fg)" }}>Contact</h2>
              <p>
                Questions: <a href="mailto:kartikshukla1707@gmail.com" style={{ color: "var(--primary)" }}>kartikshukla1707@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
