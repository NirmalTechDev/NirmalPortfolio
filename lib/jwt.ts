/**
 * Lightweight HS256 JWT utilities using Node.js crypto.
 * Used for staff dashboard session tokens (HTTP-only cookie).
 */
import { createHmac, timingSafeEqual } from "crypto";

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  exp: number;
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === "string" ? Buffer.from(input) : input;
  return buf.toString("base64url");
}

function decodeBase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function signStaffToken(
  payload: Omit<JwtPayload, "exp">,
  secret: string,
  expiresInSeconds = 60 * 60 * 24
): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds })
  );
  const signature = createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyStaffToken(token: string, secret: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    const expected = createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(decodeBase64url(body)) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
