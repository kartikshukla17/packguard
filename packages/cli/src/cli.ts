#!/usr/bin/env node
import { scanDirectory } from "./scanner.js";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";

function badge(severity: "blocked" | "warning" | "clean"): string {
  if (severity === "blocked") return `${RED}${BOLD} BLOCKED ${RESET}`;
  if (severity === "warning") return `${YELLOW}${BOLD} WARNING ${RESET}`;
  return `${GREEN}${BOLD}   CLEAN ${RESET}`;
}

const [, , command, ...args] = process.argv;

if (command === "scan" || !command) {
  const cwd = args[0] ? path.resolve(args[0]) : process.cwd();

  console.log(`\n${CYAN}${BOLD}packguard${RESET} ${DIM}v${getVersion()}${RESET}\n`);
  console.log(`${DIM}Scanning tarball for ${cwd}...${RESET}\n`);

  try {
    const result = scanDirectory(cwd);
    const blocked = result.findings.filter((f) => f.severity === "blocked");
    const warnings = result.findings.filter((f) => f.severity === "warning");
    const clean = result.fileCount - new Set(result.findings.map((f) => f.file)).size;

    if (result.findings.length === 0) {
      console.log(`${GREEN}${BOLD}✓ All ${result.fileCount} files clean${RESET}`);
    } else {
      const colW = 60;
      console.log(`${DIM}${"─".repeat(80)}${RESET}`);
      console.log(
        `${BOLD}${"FILE".padEnd(colW)}${"STATUS".padEnd(12)}REASON${RESET}`
      );
      console.log(`${DIM}${"─".repeat(80)}${RESET}`);

      for (const f of result.findings) {
        const truncated = f.file.length > colW - 2 ? "..." + f.file.slice(-(colW - 5)) : f.file;
        console.log(
          `${truncated.padEnd(colW)}${badge(f.severity).padEnd(12)} ${DIM}${f.reason}${f.detail ? ` — ${f.detail}` : ""}${RESET}`
        );
      }

      console.log(`${DIM}${"─".repeat(80)}${RESET}`);
      console.log(
        `\n${DIM}${result.fileCount} files scanned — ${RESET}` +
          (blocked.length ? `${RED}${BOLD}${blocked.length} blocked${RESET}  ` : "") +
          (warnings.length ? `${YELLOW}${warnings.length} warnings${RESET}  ` : "") +
          `${GREEN}${clean} clean${RESET}`
      );
    }

    if (!result.pass) {
      console.log(
        `\n${RED}${BOLD}✗ Publish blocked.${RESET} Fix the issues above and retry.\n`
      );
      process.exit(1);
    }

    console.log(`\n${GREEN}${BOLD}✓ Safe to publish.${RESET}\n`);
  } catch (err) {
    console.error(`${RED}Error running scan:${RESET}`, err);
    process.exit(1);
  }
} else if (command === "install") {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, "package.json");

  if (!existsSync(pkgPath)) {
    console.error(`${RED}No package.json found in current directory.${RESET}`);
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const scripts = pkg.scripts ?? {};
  const existing = scripts.prepublishOnly;

  if (existing && !existing.includes("packguard")) {
    scripts.prepublishOnly = `packguard scan && ${existing}`;
  } else if (!existing) {
    scripts.prepublishOnly = "packguard scan";
  } else {
    console.log(`${GREEN}packguard scan already in prepublishOnly hook.${RESET}`);
    process.exit(0);
  }

  pkg.scripts = scripts;
  const { writeFileSync } = await import("fs");
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`${GREEN}${BOLD}✓ Hook installed.${RESET} prepublishOnly → packguard scan`);
} else {
  console.log(`
${CYAN}${BOLD}packguard${RESET} — block AI config leaks before npm publish

${BOLD}Usage:${RESET}
  packguard scan [dir]   Scan the tarball for the package in [dir]
  packguard install      Add prepublishOnly hook to package.json

${BOLD}Options:${RESET}
  --help, -h             Show this help
`);
}

function getVersion(): string {
  try {
    const pkgPath = fileURLToPath(new URL("../package.json", import.meta.url));
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.version ?? "0.1.0";
  } catch {
    return "0.1.0";
  }
}
