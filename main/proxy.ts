import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_USER_ID_COOKIE } from "@/lib/constants/auth";

export function proxy(request: NextRequest) {
  const userId = request.cookies.get(AUTH_USER_ID_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !userId?.trim()) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
