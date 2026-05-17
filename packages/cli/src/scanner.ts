import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import path from "path";
import {
  isAiArtifact,
  SECRET_PATTERNS,
  findHighEntropyStrings,
} from "./signatures.js";

export type Severity = "blocked" | "warning" | "clean";

export interface Finding {
  file: string;
  severity: Severity;
  reason: string;
  detail?: string;
}

export interface ScanResult {
  pass: boolean;
  findings: Finding[];
  fileCount: number;
  scannedAt: string;
}

function getPackedFiles(cwd: string): string[] {
  try {
    const output = execSync("npm pack --dry-run --json 2>/dev/null", {
      cwd,
      encoding: "utf-8",
    });
    const json = JSON.parse(output);
    const entry = Array.isArray(json) ? json[0] : json;
    return (entry?.files ?? []).map((f: { path: string }) => f.path);
  } catch {
    const fallback = execSync("npm pack --dry-run 2>&1 || true", {
      cwd,
      encoding: "utf-8",
    });
    return fallback
      .split("\n")
      .filter((l) => l.startsWith("npm notice"))
      .map((l) => l.replace(/.*npm notice\s+\S+\s+/, "").trim())
      .filter((l) => l.length > 0 && !l.startsWith("="));
  }
}

function checkSourceMap(filePath: string, cwd: string): boolean {
  if (!filePath.endsWith(".js.map") && !filePath.endsWith(".ts.map")) return false;
  try {
    const full = path.join(cwd, filePath);
    if (!existsSync(full)) return false;
    const raw = readFileSync(full, { encoding: "utf-8" });
    const slice = raw.slice(0, 16384);
    const parsed = JSON.parse(slice);
    return Array.isArray(parsed.sourcesContent) && parsed.sourcesContent.length > 0;
  } catch {
    return false;
  }
}

function checkSecrets(filePath: string, cwd: string): Finding[] {
  const findings: Finding[] = [];
  const skip = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot"];
  if (skip.some((ext) => filePath.endsWith(ext))) return findings;
  try {
    const full = path.join(cwd, filePath);
    if (!existsSync(full)) return findings;
    const content = readFileSync(full, { encoding: "utf-8" });
    for (const { name, pattern } of SECRET_PATTERNS) {
      const matches = content.match(pattern);
      if (matches) {
        findings.push({
          file: filePath,
          severity: "blocked",
          reason: `secret:${name}`,
          detail: `${matches.length} match(es) found`,
        });
      }
    }
    const highEntropy = findHighEntropyStrings(content);
    if (highEntropy.length > 0) {
      findings.push({
        file: filePath,
        severity: "warning",
        reason: "entropy",
        detail: `high-entropy strings: ${highEntropy.slice(0, 3).join(", ")}`,
      });
    }
  } catch {
    // unreadable binary — skip
  }
  return findings;
}

export function scanDirectory(cwd: string = process.cwd()): ScanResult {
  const files = getPackedFiles(cwd);
  const findings: Finding[] = [];

  for (const file of files) {
    const aiArtifact = isAiArtifact(file);
    if (aiArtifact) {
      findings.push({
        file,
        severity: "blocked",
        reason: `ai_artifact:${aiArtifact}`,
      });
      continue;
    }

    if (checkSourceMap(file, cwd)) {
      findings.push({
        file,
        severity: "warning",
        reason: "source_map_with_sources",
        detail: "sourcesContent is non-empty — original source embedded",
      });
    }

    const secretFindings = checkSecrets(file, cwd);
    findings.push(...secretFindings);
  }

  const blocked = findings.some((f) => f.severity === "blocked");

  return {
    pass: !blocked,
    findings,
    fileCount: files.length,
    scannedAt: new Date().toISOString(),
  };
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
