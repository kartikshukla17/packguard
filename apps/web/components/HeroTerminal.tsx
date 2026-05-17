// Static terminal showing a real blocked scan output — no interaction needed
export default function HeroTerminal() {
  const lines: Array<{ type: "cmd" | "header" | "blocked" | "warning" | "clean" | "divider" | "result"; text: string }> = [
    { type: "cmd", text: "$ npx packguard scan" },
    { type: "divider", text: "────────────────────────────────────────────────────────" },
    { type: "header", text: "FILE                                    STATUS   REASON" },
    { type: "divider", text: "────────────────────────────────────────────────────────" },
    { type: "blocked", text: ".claude/settings.local.json             BLOCKED  ai_artifact:.claude" },
    { type: "blocked", text: ".cursor/mcp.json                        BLOCKED  ai_artifact:.cursor" },
    { type: "warning", text: "dist/index.js.map                       WARNING  source_map_with_sources" },
    { type: "clean",   text: "dist/index.js                             CLEAN" },
    { type: "clean",   text: "README.md                                 CLEAN" },
    { type: "divider", text: "────────────────────────────────────────────────────────" },
    { type: "result",  text: "✗ Publish blocked. Fix the issues above." },
  ];

  const color = (type: string) => {
    if (type === "cmd") return "var(--fg-muted)";
    if (type === "header") return "var(--fg-muted)";
    if (type === "divider") return "var(--border)";
    if (type === "blocked") return "var(--danger)";
    if (type === "warning") return "var(--warning)";
    if (type === "clean") return "var(--success)";
    if (type === "result") return "var(--danger)";
    return "var(--fg)";
  };

  return (
    <div
      className="rounded-md border overflow-hidden"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      {/* chrome bar */}
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 border-b"
        style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444", opacity: 0.6 }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#F59E0B", opacity: 0.6 }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22C55E", opacity: 0.6 }} />
        <span className="ml-3 font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
          terminal
        </span>
      </div>

      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs leading-relaxed whitespace-pre" style={{ color: "var(--fg)" }}>
          {lines.map((line, i) => (
            <div key={i} style={{ color: color(line.type) }}>
              {line.text}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
