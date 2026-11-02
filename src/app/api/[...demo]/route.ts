import { NextRequest, NextResponse } from "next/server";
import { demoRequest } from "@/demo/api";
import { createDemoState } from "@/demo/seed";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const reply = await demoRequest(createDemoState(new Date(), url.searchParams.get("username") || url.searchParams.get("userId") || undefined), url);
  return NextResponse.json(reply.data, { status: reply.status, headers: { "Cache-Control": "no-store", "X-Demo": "true" } });
}
export async function POST() {
  return NextResponse.json({ demo: true, error: "تغییرات این دمو فقط در مرورگر خودتان ذخیره می‌شود." }, { status: 405 });
}
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
