import { AuthUser } from "@/lib/auth-storage";

export interface LoginPayload {
  email: string;
  passcode: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Authentication failed.");
    }

    return { user: data.user, token: data.token };
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  async getSession(): Promise<{ authenticated: boolean; user: AuthUser | null }> {
    try {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        return { authenticated: data.authenticated, user: data.user };
      }
    } catch {
      // Fallback
    }
    return { authenticated: false, user: null };
  },
};
