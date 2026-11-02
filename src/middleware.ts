import { NextResponse } from "next/server";
// Public, isolated resume demo. Never reuse this middleware for a live business.
export function middleware() { return NextResponse.next(); }
export const config = { matcher: ["/dashboard/:path*", "/onboarding"] };
