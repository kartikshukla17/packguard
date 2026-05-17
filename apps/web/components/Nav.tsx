"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(250,250,250,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 150ms ease-out",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight"
          style={{ color: "var(--fg)" }}
        >
          packguard
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {[
            ["Demo", "/demo"],
            ["Pricing", "/pricing"],
            ["Docs", "/docs"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-sm"
              style={{ color: "var(--fg-muted)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-3 py-1.5 rounded"
            style={{
              background: "var(--fg)",
              color: "var(--bg)",
            }}
          >
            Early access
          </Link>
        </div>
      </div>
    </header>
  );
}
