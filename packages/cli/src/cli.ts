#!/usr/bin/env node
import { scanDirectory } from "./scanner.js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import type { Finding } from "./scanner.js";

// ── ANSI ──────────────────────────────────────────────────────────────────────
const R  = "\x1b[0m";
const B  = "\x1b[1m";
const D  = "\x1b[2m";
const RD = "\x1b[31m";
const GR = "\x1b[32m";
const YL = "\x1b[33m";
const WH = "\x1b[97m";
const GY = "\x1b[90m";

// ── Layout ────────────────────────────────────────────────────────────────────
const W = Math.min(process.stdout.columns || 80, 96);

function hr(color = GY): string {
  return `  ${color}${"─".repeat(W - 2)}${R}`;
}

// ── Finding metadata ──────────────────────────────────────────────────────────
const TOOL_NAMES: Record<string, string> = {
  ".claude":   "Claude Code",
  ".cursor":   "Cursor",
  ".codex":    "Codex",
  ".windsurf": "Windsurf",
  ".copilot":  "GitHub Copilot",
  ".aider":    "Aider",
  ".codeium":  "Codeium",
  ".continue": "Continue",
};

function getMessage(f: Finding): string {
  if (f.reason.startsWith("ai_artifact:")) {
    const dir  = f.reason.split(":")[1] ?? "";
    const tool = TOOL_NAMES[dir] ?? dir;
    return `${tool} config file — would be included in the published tarball`;
  }
  if (f.reason === "source_map_with_sources") {
    return "source map contains embedded source code";
  }
  if (f.reason.startsWith("secret:")) {
    const kind = f.reason.split(":")[1] ?? "";
    return `credential pattern matched: ${kind}${f.detail ? ` — ${f.detail}` : ""}`;
  }
  if (f.reason === "entropy") {
    return f.detail ?? "high-entropy string detected";
  }
  return f.detail ?? f.reason;
}

function getFixHint(f: Finding): string {
  if (f.reason.startsWith("ai_artifact:")) {
    const dir = f.reason.split(":")[1] ?? "";
    return `add ${dir}/ to .npmignore`;
  }
  if (f.reason === "source_map_with_sources") {
    return "disable sourcesContent in your bundler config, or add to .npmignore";
  }
  if (f.reason.startsWith("secret:")) {
    return "rotate this credential immediately — treat it as compromised";
  }
  if (f.reason === "entropy") {
    return "add the file to .packguardignore if this is a false positive";
  }
  return "";
}

// ── Per-finding block ─────────────────────────────────────────────────────────
//
//   ┌─ .claude/settings.local.json ─────────────────────────────────── BLOCKED ─
//   │  Claude Code config file — would be included in the published tarball
//   │  → add .claude/ to .npmignore
//
function printFinding(f: Finding): void {
  const isBlocked = f.severity === "blocked";
  const color = isBlocked ? RD : YL;
  const label = isBlocked ? "BLOCKED" : "WARNING";

  // Header: "  ┌─ <file> ────────────────── BLOCKED ─"
  const badge    = ` ${label} ─`;          // e.g. " BLOCKED ─" = 10 chars
  const prefix   = "┌─ ";
  const indent   = 2;
  const maxFile  = W - indent - prefix.length - 1 - badge.length - 1;
  const fileStr  = f.file.length > maxFile
    ? "…" + f.file.slice(-(maxFile - 1))
    : f.file;
  const fillLen  = Math.max(1, W - indent - prefix.length - fileStr.length - 1 - badge.length);
  const fill     = "─".repeat(fillLen);

  console.log(`  ${color}${prefix}${R}${B}${fileStr}${R} ${color}${fill}${badge}${R}`);
  console.log(`  ${GY}│${R}  ${D}${getMessage(f)}${R}`);

  const fix = getFixHint(f);
  if (fix) console.log(`  ${GY}│${R}  ${GY}→ ${fix}${R}`);

  console.log();
}

// ── Commands ──────────────────────────────────────────────────────────────────
const [, , command, ...args] = process.argv;

if (command === "scan" || !command) {
  const cwd = args[0] ? path.resolve(args[0]) : process.cwd();

  console.log();
  console.log(`  ${B}◆ packguard${R}  ${GY}v${getVersion()}${R}`);
  console.log(`  ${GY}scanning  ${WH}${cwd}${R}`);
  console.log();

  try {
    const result   = scanDirectory(cwd);
    const blocked  = result.findings.filter((f) => f.severity === "blocked");
    const warnings = result.findings.filter((f) => f.severity === "warning");
    const cleanCount = result.fileCount
      - new Set(result.findings.map((f) => f.file)).size;

    if (result.findings.length === 0) {
      console.log(`  ${GR}✓${R}  all ${result.fileCount} files clean`);
      console.log();
      console.log(`  ${GR}safe to publish.${R}`);
      console.log();
    } else {
      for (const f of result.findings) printFinding(f);

      console.log(hr());
      console.log();

      const stats = [
        `${GY}${result.fileCount} scanned${R}`,
        ...(blocked.length  ? [`${RD}${B}${blocked.length} blocked${R}`]  : []),
        ...(warnings.length ? [`${YL}${warnings.length} warning${warnings.length !== 1 ? "s" : ""}${R}`] : []),
        ...(cleanCount > 0  ? [`${GR}${cleanCount} clean${R}`] : []),
      ];
      console.log("  " + stats.join(`  ${GY}·${R}  `));
      console.log();

      if (!result.pass) {
        const n = blocked.length;
        console.log(
          `  ${D}packguard blocked this publish — resolve ${n} issue${n !== 1 ? "s" : ""} above.${R}`
        );
        console.log();
        process.exit(1);
      }

      console.log(`  ${GR}✓${R}  ${D}safe to publish${R}`);
      console.log();
    }
  } catch (err) {
    console.error(`  ${RD}error:${R}`, err);
    process.exit(1);
  }

} else if (command === "install") {
  const cwd     = process.cwd();
  const pkgPath = path.join(cwd, "package.json");

  if (!existsSync(pkgPath)) {
    console.error(`  ${RD}no package.json found in current directory${R}`);
    process.exit(1);
  }

  const pkg     = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const scripts = pkg.scripts ?? {};
  const existing = scripts.prepublishOnly;

  if (existing && !existing.includes("packguard")) {
    scripts.prepublishOnly = `packguard scan && ${existing}`;
  } else if (!existing) {
    scripts.prepublishOnly = "packguard scan";
  } else {
    console.log(`  ${GR}✓${R}  packguard scan already in prepublishOnly`);
    process.exit(0);
  }

  pkg.scripts = scripts;
  const { writeFileSync } = await import("fs");
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log();
  console.log(`  ${GR}✓${R}  hook installed`);
  console.log(`  ${GY}  prepublishOnly → packguard scan${R}`);
  console.log();

} else {
  console.log(`
  ${B}◆ packguard${R}  ${GY}block AI config leaks before npm publish${R}

  ${B}usage${R}
    packguard scan [dir]   scan the tarball for the package in [dir]
    packguard install      add prepublishOnly hook to package.json

  ${B}options${R}
    --help, -h             show this help
`);
}

// ── Version ───────────────────────────────────────────────────────────────────
function getVersion(): string {
  try {
    const pkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.version ?? "0.1.0";
  } catch {
    return "0.1.0";
  }
}
