/**
 * Collective Ledger API Client
 *
 * A typed, production-grade fetch wrapper for the Collective Ledger Node.js backend.
 * Handles:
 *  - Base URL configuration from env
 *  - Bearer token injection
 *  - Auto-refresh on 401
 *  - Typed error responses
 *  - Request timeout (Render cold starts can be slow)
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_COLLECTIVE_API_URL ||
  "https://collective-onc6.onrender.com/api/v1";

/** Typed error class for API failures */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Shape of all backend JSON responses */
interface BackendResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code: string; message: string };
}

/** Token store — only used server-side in API routes */
let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _tokenExpiry: number = 0; // unix ms

export function setTokens(access: string, refresh: string, expiryMs = 14 * 60 * 1000) {
  _accessToken = access;
  _refreshToken = refresh;
  _tokenExpiry = Date.now() + expiryMs; // 14 min (JWT is 15m)
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  _tokenExpiry = 0;
}

export function hasValidToken(): boolean {
  return !!_accessToken && Date.now() < _tokenExpiry;
}

/** Login with admin credentials, store tokens */
export async function loginCollective(
  email: string,
  password: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      body?.message || "Collective backend login failed",
      res.status,
      body?.error?.code
    );
  }

  const body: BackendResponse<{ token: string; refreshToken: string }> =
    await res.json();
  const { token, refreshToken } = body.data!;
  setTokens(token, refreshToken);
}

/** Silently refresh access token using stored refresh token */
async function refreshAccessToken(): Promise<void> {
  if (!_refreshToken) throw new ApiError("No refresh token available", 401);

  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: _refreshToken }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    clearTokens();
    throw new ApiError("Session expired, re-login required", 401, "TOKEN_EXPIRED");
  }

  const body: BackendResponse<{ accessToken: string; refreshToken: string }> =
    await res.json();
  setTokens(body.data!.accessToken, body.data!.refreshToken);
}

/** Ensure we have a valid token, logging in or refreshing as needed */
async function ensureAuthenticated(): Promise<void> {
  if (hasValidToken()) return;

  // Try refresh first
  if (_refreshToken) {
    try {
      await refreshAccessToken();
      return;
    } catch {
      // Fall through to full re-login
    }
  }

  // Full re-login with env credentials
  const email = process.env.COLLECTIVE_ADMIN_EMAIL;
  const password = process.env.COLLECTIVE_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new ApiError(
      "COLLECTIVE_ADMIN_EMAIL and COLLECTIVE_ADMIN_PASSWORD must be set in .env.local",
      500,
      "MISSING_CREDENTIALS"
    );
  }
  await loginCollective(email, password);
}

interface FetchOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  /** Skip auth injection (for public endpoints) */
  public?: boolean;
  /** Custom timeout in ms (default 20s for Render cold starts) */
  timeout?: number;
}

/**
 * Core fetch wrapper — injects auth, parses JSON, throws ApiError on failure.
 */
export async function collectiveApiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { public: isPublic = false, timeout = 20_000, headers = {}, ...rest } = options;

  if (!isPublic) {
    await ensureAuthenticated();
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  headers["Content-Type"] = headers["Content-Type"] ?? "application/json";

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers,
      signal: AbortSignal.timeout(timeout),
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ApiError(`Request to ${path} timed out after ${timeout}ms`, 504, "TIMEOUT");
    }
    throw new ApiError(`Network error: ${(err as Error).message}`, 503, "NETWORK_ERROR");
  }

  // 401 → try one token refresh then retry
  if (res.status === 401 && !isPublic) {
    try {
      await refreshAccessToken();
      headers["Authorization"] = `Bearer ${_accessToken}`;
      res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });
    } catch {
      throw new ApiError("Authentication failed", 401, "AUTH_FAILED");
    }
  }

  const body: BackendResponse<T> = await res.json().catch(() => ({
    success: false,
    message: `Non-JSON response (HTTP ${res.status})`,
  }));

  if (!res.ok || !body.success) {
    throw new ApiError(
      body?.message || body?.error?.message || `HTTP ${res.status}`,
      res.status,
      body?.error?.code
    );
  }

  // Standard { data: T } format, or legacy { success, members/investments/logs/... }
  if (body.data !== undefined) {
    return body.data as T;
  }

  const legacyKeys = ["members", "investments", "logs", "payments", "messages"] as const;
  const legacyBody = body as unknown as Record<string, unknown>;
  for (const key of legacyKeys) {
    if (key in legacyBody) {
      return legacyBody[key] as T;
    }
  }

  return body as T;
}
