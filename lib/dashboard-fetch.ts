/**
 * Client-side fetch helper for dashboard API routes.
 * Automatically includes credentials (cookies) for staff auth.
 */
async function dashboardFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error || body?.message || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export { dashboardFetch };
