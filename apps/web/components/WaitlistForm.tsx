"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing-cta" }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm" style={{ color: "var(--success)" }}>
        ✓ You&apos;re on the list — I&apos;ll email you when Pro launches.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 min-w-0 px-3 py-2 text-sm rounded border outline-none"
        style={{
          background: "var(--surface-2)",
          borderColor: "var(--border)",
          color: "var(--fg)",
          minWidth: "200px",
        }}
      />
      <button
        type="submit"
        disabled={loading || !email}
        className="px-4 py-2 text-sm font-medium rounded shrink-0"
        style={{
          background: loading || !email ? "var(--surface-2)" : "var(--primary)",
          color: loading || !email ? "var(--fg-muted)" : "var(--primary-fg)",
          cursor: loading || !email ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "..." : "Notify me when Pro launches"}
      </button>
    </form>
  );
}
