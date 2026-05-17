"use client";

import { useState } from "react";

const DEFAULT_FILES = `.claude/settings.local.json
.cursor/mcp.json
src/index.ts
dist/index.js
dist/index.js.map
README.md
package.json`;

interface Finding {
  file: string;
  severity: "blocked" | "warning" | "clean";
  reason: string;
  detail?: string;
}

function SeverityBadge({ severity }: { severity: Finding["severity"] }) {
  if (severity === "blocked") {
    return (
      <span
        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm"
        style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
      >
        BLOCKED
      </span>
    );
  }
  if (severity === "warning") {
    return (
      <span
        className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm"
        style={{ background: "var(--warning-bg)", color: "var(--warning)" }}
      >
        WARNING
      </span>
    );
  }
  return (
    <span
      className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-sm"
      style={{ background: "var(--success-bg)", color: "var(--success)" }}
    >
      CLEAN
    </span>
  );
}

export default function TerminalDemo() {
  const [files, setFiles] = useState(DEFAULT_FILES);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runScan() {
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: files.split("\n").map((f) => f.trim()).filter(Boolean) }),
      });
      const data = await res.json();
      setFindings(data.findings ?? []);
    } catch {
      setFindings([]);
    } finally {
      setLoading(false);
    }
  }

  const hasBlocked = findings?.some((f) => f.severity === "blocked");

  return (
    <div
      className="rounded-md overflow-hidden border"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* terminal chrome */}
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 border-b"
        style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444", opacity: 0.7 }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B", opacity: 0.7 }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22C55E", opacity: 0.7 }} />
        <span
          className="ml-3 font-mono text-xs"
          style={{ color: "var(--fg-muted)" }}
        >
          npx packguard scan
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <label
            className="block text-xs font-mono mb-1.5"
            style={{ color: "var(--fg-muted)" }}
          >
            # paste your file list (one per line)
          </label>
          <textarea
            value={files}
            onChange={(e) => setFiles(e.target.value)}
            rows={8}
            className="w-full font-mono text-xs p-3 rounded border outline-none resize-none"
            style={{
              background: "var(--surface-2)",
              color: "var(--fg)",
              borderColor: "var(--border)",
              fontSize: "12px",
              lineHeight: "1.6",
            }}
            spellCheck={false}
          />
        </div>

        <button
          onClick={runScan}
          disabled={loading}
          className="w-full py-2 text-sm font-medium rounded"
          style={{
            background: loading ? "var(--surface-2)" : "var(--primary)",
            color: loading ? "var(--fg-muted)" : "var(--primary-fg)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Scanning..." : "Run scan"}
        </button>

        {findings !== null && (
          <div
            className="rounded border"
            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          >
            {findings.length === 0 ? (
              <div className="p-3 font-mono text-xs" style={{ color: "var(--success)" }}>
                ✓ All files clean — safe to publish.
              </div>
            ) : (
              <>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {findings.map((f, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 ${f.severity === "blocked" ? "flash-blocked" : ""}`}
                    >
                      <SeverityBadge severity={f.severity} />
                      <div className="min-w-0">
                        <span
                          className="font-mono text-xs block"
                          style={{ color: f.severity === "blocked" ? "var(--danger)" : "var(--fg)" }}
                        >
                          {f.file}
                        </span>
                        {f.detail && (
                          <span className="font-mono text-xs block mt-0.5" style={{ color: "var(--fg-muted)" }}>
                            {f.detail}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  className="px-3 py-2 border-t font-mono text-xs"
                  style={{
                    borderColor: "var(--border)",
                    color: hasBlocked ? "var(--danger)" : "var(--warning)",
                  }}
                >
                  {hasBlocked
                    ? "✗ Publish blocked. Fix the issues above."
                    : "⚠ Warnings found — review before publishing."}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
