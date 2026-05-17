import { NextRequest, NextResponse } from "next/server";
import { scanFileList } from "../../../lib/scan";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("files" in body) ||
    !Array.isArray((body as { files: unknown }).files)
  ) {
    return NextResponse.json({ error: "files array required" }, { status: 400 });
  }

  const files = ((body as { files: unknown[] }).files as unknown[])
    .filter((f) => typeof f === "string")
    .slice(0, 500) as string[];

  const findings = scanFileList(files);

  const cleanFiles = files.filter(
    (f) => !findings.some((fi) => fi.file === f)
  );

  return NextResponse.json({
    findings,
    fileCount: files.length,
    cleanCount: cleanFiles.length,
    pass: !findings.some((f) => f.severity === "blocked"),
  });
}
