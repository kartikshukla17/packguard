import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0A0A0F",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        {/* top: logo + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#F0F0FF", fontSize: "18px", fontWeight: 600 }}>
            packguard
          </span>
          <span
            style={{
              color: "#EF4444",
              fontSize: "11px",
              fontWeight: 700,
              background: "rgba(239,68,68,0.12)",
              padding: "4px 10px",
              borderRadius: "4px",
            }}
          >
            SECURITY
          </span>
        </div>

        {/* center: headline + stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* headline as two separate spans in a column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span
              style={{
                color: "#F0F0FF",
                fontSize: "52px",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Stop shipping your AI
            </span>
            <span
              style={{
                color: "#F0F0FF",
                fontSize: "52px",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              {"assistant's secrets."}
            </span>
          </div>

          {/* stats row */}
          <div style={{ display: "flex", gap: "48px" }}>
            {[
              ["428", "packages with AI config files"],
              ["33", "with live credentials inside"],
              ["512K", "lines leaked by Anthropic"],
            ].map(([num, label]) => (
              <div key={num} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ color: "#EF4444", fontSize: "30px", fontWeight: 700 }}>
                  {num}
                </span>
                <span style={{ color: "#8888A8", fontSize: "13px" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom: command pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "#111118",
            border: "1px solid #2A2A3A",
            borderRadius: "6px",
            padding: "16px 24px",
            width: "420px",
          }}
        >
          <span style={{ color: "#8888A8", fontSize: "15px" }}>$</span>
          <span style={{ color: "#F0F0FF", fontSize: "15px", fontWeight: 500 }}>
            npx packguard scan
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
