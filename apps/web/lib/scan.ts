const AI_ARTIFACT_PATTERNS: string[] = [
  ".claude/",
  ".cursor/",
  ".codex/",
  ".windsurf/",
  ".copilot/",
  ".aider/",
  "settings.local.json",
  ".clauderc",
  ".cursorrc",
  ".aider.chat.history.md",
  ".aider.input.history",
  ".aider.tags.cache.v3/",
  ".codeium/",
  ".continue/",
];

export type Severity = "blocked" | "warning";

export interface Finding {
  file: string;
  severity: Severity;
  reason: string;
  detail?: string;
}

function isAiArtifact(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, "/");
  for (const pattern of AI_ARTIFACT_PATTERNS) {
    if (pattern.endsWith("/")) {
      if (normalized.includes(pattern) || normalized.startsWith(pattern)) {
        return pattern.replace(/\/$/, "");
      }
    } else {
      const filename = normalized.split("/").pop() ?? "";
      if (filename === pattern || normalized.endsWith("/" + pattern)) {
        return pattern;
      }
    }
  }
  return null;
}

export function scanFileList(files: string[]): Finding[] {
  const findings: Finding[] = [];
  for (const file of files) {
    const aiArtifact = isAiArtifact(file);
    if (aiArtifact) {
      findings.push({
        file,
        severity: "blocked",
        reason: `ai_artifact:${aiArtifact}`,
      });
    }
    if (file.endsWith(".js.map") || file.endsWith(".ts.map")) {
      findings.push({
        file,
        severity: "warning",
        reason: "source_map_with_sources",
        detail: "Cannot inspect content — flagged for review",
      });
    }
  }
  return findings;
}
