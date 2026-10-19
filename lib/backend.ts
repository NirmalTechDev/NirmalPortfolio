import "server-only";
import { API_URL } from "@/lib/env";

export class BackendError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

interface Envelope<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}

/** Server-side call to the backend. Render free instances can take ~30s to wake. */
export async function backendFetch<T>(
  path: string,
  init: RequestInit & { token?: string; timeoutMs?: number } = {}
): Promise<T> {
  const { token, timeoutMs = 30_000, headers, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(rest.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers as Record<string, string>),
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const timedOut = (err as Error).name === "TimeoutError";
    throw new BackendError(
      timedOut ? "The server is taking too long to respond. It may be waking up — try again in a moment." : "Could not reach the server.",
      503,
      timedOut ? "BACKEND_TIMEOUT" : "BACKEND_UNREACHABLE"
    );
  }
  const body = (await res.json().catch(() => ({}))) as Envelope<T>;
  if (!res.ok || body.success === false) {
    throw new BackendError(body.message || `Request failed (${res.status})`, res.status, body.code);
  }
  return body.data as T;
}
