"use client";

/** Thin client for the dashboard proxy (/api/admin/*). Errors carry a readable message. */
export class AdminError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
  }
}

export async function adminFetch<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`/api/admin/${path.replace(/^\//, "")}`, {
      ...rest,
      credentials: "same-origin",
      headers: { Accept: "application/json", ...(json !== undefined ? { "Content-Type": "application/json" } : {}), ...rest.headers },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new AdminError("You appear to be offline. Check your connection and try again.", 0, "OFFLINE");
  }
  const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string; code?: string; data?: T };
  if (res.status === 401) {
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/me/login")) {
      window.location.href = `/me/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}&expired=1`;
    }
    throw new AdminError(body.message || "Your session has ended. Sign in again.", 401, body.code);
  }
  if (!res.ok || body.success === false) {
    throw new AdminError(body.message || `Something went wrong (${res.status}).`, res.status, body.code);
  }
  return body.data as T;
}

export const api = {
  get: <T,>(p: string) => adminFetch<T>(p),
  post: <T,>(p: string, json?: unknown) => adminFetch<T>(p, { method: "POST", json: json ?? {} }),
  put: <T,>(p: string, json: unknown) => adminFetch<T>(p, { method: "PUT", json }),
  patch: <T,>(p: string, json: unknown) => adminFetch<T>(p, { method: "PATCH", json }),
  del: <T,>(p: string) => adminFetch<T>(p, { method: "DELETE" }),
};

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");
