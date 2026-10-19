import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyStaffToken } from "@/lib/jwt";
import { getAuthSecret } from "@/lib/env";
const CANONICAL_HOST = "nirmalranpariya.in";
const GALLERY_PATH = "/LovedOnesGallery";
const LEGACY_HOSTS = new Set([
  "nirmal-portfolio-nine.vercel.app",
  "www.nirmalranpariya.in",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = (request.headers.get("host") ?? request.nextUrl.hostname)
    .split(":")[0]
    .toLowerCase();

  if (LEGACY_HOSTS.has(hostname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https:";
    redirectUrl.hostname = CANONICAL_HOST;
    redirectUrl.port = "";
    return NextResponse.redirect(redirectUrl, 308);
  }

  // Gallery address: exact spelling is /LovedOnesGallery. Redirect other casings and the
  // common "Gallary" misspelling here (next.config redirects match case-insensitively).
  const gallery = pathname.match(/^\/(lovedonesgall[ae]ry|gallery)(\/.*)?$/i);
  if (gallery && !pathname.startsWith(GALLERY_PATH)) {
    const url = request.nextUrl.clone();
    url.pathname = `${GALLERY_PATH}${gallery[2] || ""}`;
    return NextResponse.redirect(url, 308);
  }

  // Fail closed: without a configured AUTH_SECRET nobody is treated as signed in.
  const secret = getAuthSecret();
  const token = request.cookies.get("nirmal_cmd_token")?.value;
  const payload = token && secret ? verifyStaffToken(token, secret) : null;
  const isAuth = !!payload && !!request.cookies.get("nirmal_owner")?.value;

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
  matcher: ["/((?!_next/static|_next/image).*)"],
};
