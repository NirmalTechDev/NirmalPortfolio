import "server-only";

/**
 * Headers that tell the backend which visitor a server-side request is for, so per-visitor
 * rate limits work even though every request comes from this server's IP. The backend only
 * trusts them when INTERNAL_PROXY_SECRET matches.
 */
export function visitorHeaders(request: Request): Record<string, string> {
  const secret = process.env.INTERNAL_PROXY_SECRET;
  const ip = (request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  return secret && ip ? { "X-Internal-Proxy-Secret": secret, "X-Client-IP": ip } : {};
}
