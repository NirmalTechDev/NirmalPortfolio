"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(params.get("expired") ? "Your session ended. Sign in again to continue." : null);
  const [slow, setSlow] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setError("Enter your password.");
    setBusy(true);
    setError(null);
    const slowTimer = setTimeout(() => setSlow(true), 4000);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(res.status === 401 ? "That password isn't right." : body.message || "Sign-in failed. Try again.");
        return;
      }
      const next = params.get("next");
      router.replace(next && next.startsWith("/me") && !next.startsWith("/me/login") ? next : "/me");
      router.refresh();
    } catch {
      setError("You appear to be offline. Check your connection.");
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
      setBusy(false);
    }
  };

  return (
    <main className="adm-login">
      <form className="adm-login__card" onSubmit={submit} noValidate>
        <div>
          <h1 className="adm-login__title">Welcome back</h1>
          <p className="adm-muted" style={{ marginTop: "0.6rem" }}>
            Sign in to manage your website, inbox, gallery and birthday pages.
          </p>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="pw">
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="pw"
              className="adm-input"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "pw-err" : undefined}
              style={{ paddingRight: "2.8rem" }}
            />
            <button
              type="button"
              className="adm-btn adm-btn--quiet adm-btn--sm adm-btn--icon"
              style={{ position: "absolute", right: 4, top: 4 }}
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {error && (
            <p className="adm-error" id="pw-err" role="alert">
              {error}
            </p>
          )}
        </div>
        <button type="submit" className="adm-btn adm-btn--primary" disabled={busy} style={{ minHeight: "2.8rem" }}>
          {busy ? <span className="adm-spin" aria-hidden="true" /> : <Lock />}
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {slow && <p className="adm-hint">The server is waking up after a quiet period. This can take up to 30 seconds.</p>}
        <p className="adm-hint">
          <Link href="/">← Back to the website</Link>
        </p>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
