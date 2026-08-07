import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyStaffToken } from "@/lib/jwt";

const AUTH_SECRET = process.env.AUTH_SECRET || "nirmal_cmd_secret_key_2026_prod";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("nirmal_cmd_token")?.value;
  const payload = token ? verifyStaffToken(token, AUTH_SECRET) : null;
  const isAuth = !!payload;

  const isDashboardRoute = pathname === "/me" || pathname.startsWith("/me/");
  const isLoginRoute = pathname === "/me/login";

  if (isDashboardRoute && !isLoginRoute && !isAuth) {
    return NextResponse.redirect(new URL("/me/login", request.url));
  }

  if (isLoginRoute && isAuth) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/me", "/me/:path*"],
};
