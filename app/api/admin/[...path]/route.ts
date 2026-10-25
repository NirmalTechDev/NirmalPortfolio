import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { API_URL, env } from "@/lib/env";
import { clearedSessionCookies, readOwnerSession } from "@/lib/owner-session";

/**
 * Dashboard → backend proxy. The browser never sees the owner token: it lives in an
 * httpOnly cookie and is attached here. Only known owner endpoints are reachable.
 */
const ALLOWED = [
  /^owner\/(overview|me)$/,
  /^portfolio\/(site|projects|projects\/reorder|projects\/[a-f0-9]{24}|projects\/slug\/[a-z0-9-]+|experience|experience\/[a-f0-9]{24}|resume|resume\/active|resume\/[a-f0-9]{24})$/,
  /^contact\/(messages|summary|email-status|messages\/[a-f0-9]{24}(\/(reply|status|replies\/[a-f0-9]{24}))?)$/,
  /^media\/(sign|status)$/,
  /^gallery(\/(admin|bulk|reorder|[a-f0-9]{24}(\/(restore|permanent))?))?$/,
  /^birthdays(\/[a-f0-9]{24}(\/(duplicate|set-default|preview-token))?)?$/,
  /^galleries(\/[a-f0-9]{24}(\/(photos|duplicate|set-default|preview-token|share-key))?)?$/,
];

type Ctx = { params: Promise<{ path: string[] }> };

async function refreshPublicSites(path: string) {
  if (path.startsWith("portfolio/")) {
    revalidateTag("portfolio", { expire: 0 });
    return;
  }
  const target = path.startsWith("gallery") ? `${env.GALLERY_URL}/LovedOnesGallery/api/revalidate` : path.startsWith("birthdays") ? `${env.BIRTHDAY_URL}/birthdaywish/api/revalidate` : null;
  if (!target || !env.REVALIDATE_SECRET) return;
  // Fire-and-forget: the public apps also refresh on their own every 30s.
  fetch(target, { method: "POST", headers: { "x-revalidate-secret": env.REVALIDATE_SECRET }, signal: AbortSignal.timeout(5000) }).catch(() => {});
}

async function handle(request: Request, ctx: Ctx) {
  const { path: parts } = await ctx.params;
  const path = parts.join("/");
  if (!ALLOWED.some((rx) => rx.test(path))) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  const method = request.method.toUpperCase();
  if (method !== "GET") {
    // CSRF defence in depth (cookies are already SameSite=strict).
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== request.headers.get("host")) {
      return NextResponse.json({ success: false, message: "Cross-site request blocked" }, { status: 403 });
    }
  }

  const session = await readOwnerSession();
  if (!session) {
    return NextResponse.json({ success: false, message: "Your session has ended. Sign in again.", code: "SESSION_EXPIRED" }, { status: 401 });
  }

  const search = new URL(request.url).search;
  let upstream: Response;
  try {
    upstream = await fetch(`${API_URL}/${path}${search}`, {
      method,
      headers: {
        Authorization: `Bearer ${session.ownerToken}`,
        Accept: "application/json",
        ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      },
      body: method === "GET" || method === "HEAD" ? undefined : await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(45_000),
    });
  } catch (err) {
    const timedOut = (err as Error).name === "TimeoutError";
    return NextResponse.json(
      {
        success: false,
        code: timedOut ? "BACKEND_TIMEOUT" : "BACKEND_UNREACHABLE",
        message: timedOut ? "The server is waking up and took too long. Try again in a few seconds." : "Could not reach the server. Check your connection and try again.",
      },
      { status: 503 }
    );
  }

  const body = await upstream.text();
  const response = new NextResponse(body, { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" } });

  if (upstream.status === 401) {
    for (const c of clearedSessionCookies()) response.cookies.set(c);
  } else if (upstream.ok && method !== "GET") {
    await refreshPublicSites(path);
  }
  return response;
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
