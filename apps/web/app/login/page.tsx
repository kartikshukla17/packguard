"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function WaitlistForm() {
  const searchParams = useSearchParams();
  const source = searchParams.get("utm_source") ?? searchParams.get("intent") ?? "direct";
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? "Something went wrong. Try again.");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-lg"
          style={{ background: "var(--success-bg)", color: "var(--success)" }}
        >
          ✓
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--fg)" }}>
          You&apos;re on the list
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--fg-muted)" }}>
          I&apos;ll email you at <strong>{email}</strong> when Pro launches.
          <br />
          In the meantime, the CLI is free and ready.
        </p>
        <div
          className="font-mono text-xs px-4 py-3 rounded border text-left"
          style={{ background: "var(--surface-2)", borderColor: "var(--border)", color: "var(--fg)" }}
        >
          <span style={{ color: "var(--fg-muted)" }}>$ </span>npx packguard scan
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 text-center">
        <Link href="/" className="font-mono text-sm font-semibold" style={{ color: "var(--fg)" }}>
          packguard
        </Link>
        <h1 className="text-xl font-semibold mt-6 mb-1" style={{ color: "var(--fg)" }}>
          Join the early access list
        </h1>
        <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
          Pro is in early access — org audit log, CI token, team controls.
          <br />
          I&apos;ll email you when it&apos;s ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 text-sm rounded border outline-none"
          style={{
            background: "var(--surface-2)",
            borderColor: error ? "var(--danger)" : "var(--border)",
            color: "var(--fg)",
          }}
          autoFocus
        />

        {error && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full py-2.5 text-sm font-medium rounded"
          style={{
            background: loading || !email ? "var(--surface-2)" : "var(--primary)",
            color: loading || !email ? "var(--fg-muted)" : "var(--primary-fg)",
            cursor: loading || !email ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Notify me when Pro launches"}
        </button>
      </form>

      <p className="text-xs text-center mt-5" style={{ color: "var(--fg-muted)" }}>
        No spam. One email when it ships.{" "}
        <Link href="/privacy" style={{ color: "var(--fg-muted)", textDecoration: "underline" }}>
          Privacy policy
        </Link>
        .
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-md border"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Suspense fallback={null}>
          <WaitlistForm />
        </Suspense>
      </div>
    </main>
  );
}
