import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
// Original filenames are preserved. Put restored photos in public/items (or public/demo-assets/items).
export async function GET(req: NextRequest) {
  const relative = decodeURIComponent(new URL(req.url).pathname.replace(/^\/demo-assets\//, ""));
  if (relative.split("/").some(p => p === "..") || !/\.(jpe?g|png|webp|svg)$/i.test(relative)) {
    return NextResponse.redirect(new URL("/demo/item-placeholder.svg", req.url));
  }
  for (const base of ["public/demo-assets", "public"]) {
    try {
      const file = await fs.readFile(path.join(process.cwd(), base, relative));
      const ext = path.extname(relative).toLowerCase();
      const type: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };
      return new NextResponse(new Uint8Array(file), { headers: { "Content-Type": type[ext], "Cache-Control": "public, max-age=3600" } });
    } catch { /* Fall back without pretending to have the original photo. */ }
  }
  return NextResponse.redirect(new URL("/demo/item-placeholder.svg", req.url));
}
