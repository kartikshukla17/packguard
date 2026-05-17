export const AI_ARTIFACT_PATTERNS: string[] = [
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

export const SECRET_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "anthropic_key", pattern: /sk-ant-[a-zA-Z0-9\-_]{32,}/g },
  { name: "github_token", pattern: /ghp_[a-zA-Z0-9]{36}/g },
  { name: "github_oauth", pattern: /gho_[a-zA-Z0-9]{36}/g },
  { name: "github_app", pattern: /ghs_[a-zA-Z0-9]{36}/g },
  { name: "aws_access_key", pattern: /AKIA[0-9A-Z]{16}/g },
  { name: "aws_secret_key", pattern: /(?:aws[_\-.]?secret[_\-.]?(?:access[_\-.]?)?key)\s*[=:"'\s]+[0-9a-zA-Z\/+]{40}/gi },
  { name: "openai_key", pattern: /sk-[a-zA-Z0-9]{48}/g },
  { name: "stripe_key", pattern: /(?:sk|pk)_(?:live|test)_[a-zA-Z0-9]{24,}/g },
  { name: "generic_bearer", pattern: /Bearer\s+[a-zA-Z0-9\-._~+/]{20,}/g },
];

export function isAiArtifact(filePath: string): string | null {
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

export function shannonEntropy(str: string): number {
  const freq: Record<string, number> = {};
  for (const ch of str) freq[ch] = (freq[ch] ?? 0) + 1;
  let entropy = 0;
  for (const count of Object.values(freq)) {
    const p = count / str.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export function findHighEntropyStrings(content: string): string[] {
  const results: string[] = [];
  const words = content.match(/[a-zA-Z0-9+/=_\-]{20,}/g) ?? [];
  for (const word of words) {
    if (shannonEntropy(word) > 4.5) {
      results.push(word.slice(0, 8) + "...");
    }
  }
  return [...new Set(results)];
}
