"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, RefreshCw, Star } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { useOverview } from "@/features/admin/shell";
import { Button, LoadingBlock, Note, PageHeader, Section, timeAgo, useToast } from "@/features/admin/ui";

interface Health {
  status: "ok" | "degraded";
  uptimeSeconds: number;
  timestamp: string;
  environment: string;
  memory: { rssMB: string; heapUsedMB: string } | null;
  database: { connected: boolean };
  error?: string;
}
interface Github {
  stats: { username: string; profileUrl: string; publicRepos: number; followers: number; totalStars: number; topLanguages: { name: string; percentage: number }[] };
  repos: { id: number; name: string; description: string | null; html_url: string; stargazers_count: number; language: string | null; updated_at: string }[];
}
interface LedgerSummary {
  overview: { users: number; communities: number; paymentsTotalPaise: number; investmentsTotalPaise: number } | null;
  adminSummary: { totalMembers: number; totalCollectedPaise: number; totalInvestedPaise?: number; pendingPayments?: number; latePayments?: number } | null;
}

const rupees = (paise?: number) => (typeof paise === "number" ? `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}` : "—");
const uptime = (s: number) => (s > 86400 ? `${Math.floor(s / 86400)} d ${Math.floor((s % 86400) / 3600)} h` : s > 3600 ? `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min` : `${Math.floor(s / 60)} min`);

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "ok" | "bad" | "warn" }) {
  return (
    <div className="adm-rowitem" style={{ padding: "0.7rem 1rem" }}>
      <span className="adm-rowitem__main adm-muted">{label}</span>
      <span style={{ fontWeight: 600, color: tone ? `var(--${tone})` : undefined }}>{value}</span>
    </div>
  );
}

export default function AdvancedPage() {
  const toast = useToast();
  const overview = useOverview();
  const health = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const t = performance.now();
      const res = await fetch("/api/collective/health", { cache: "no-store" });
      const body = (await res.json()) as { health: Health };
      return { ...body.health, latencyMs: Math.round(performance.now() - t) };
    },
    refetchInterval: 60_000,
  });
  const github = useQuery({
    queryKey: ["github"],
    queryFn: async () => {
      const res = await fetch("/api/github");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "GitHub unavailable");
      return body as Github;
    },
    staleTime: 3600_000,
    retry: false,
  });
  const ledger = useQuery({
    queryKey: ["ledger-summary"],
    queryFn: async () => {
      const res = await fetch("/api/collective/dashboard");
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Not connected");
      if (!body.overview && !body.adminSummary) throw new Error("the ledger did not return any data");
      return body as LedgerSummary;
    },
    retry: false,
  });
  const [verifying, setVerifying] = useState(false);
  const [emailCheck, setEmailCheck] = useState<{ ok: boolean; error?: string } | null>(null);

  const h = health.data;
  const services = overview.data?.services;

  return (
    <div className="adm-page">
      <PageHeader title="System & tools" description="Live status of the services behind your sites, plus your Collective Ledger and GitHub at a glance. Everything here is read-only." />

      <div className="adm-grid adm-grid--2">
        <Section
          title="Services"
          actions={
            <Button size="sm" variant="quiet" icon={<RefreshCw />} onClick={() => health.refetch()} loading={health.isFetching}>
              Check again
            </Button>
          }
        >
          {health.isLoading ? (
            <LoadingBlock rows={3} />
          ) : (
            <div className="adm-rows">
              <Stat label="API server" value={h?.status === "ok" ? "Running" : "Not responding"} tone={h?.status === "ok" ? "ok" : "bad"} />
              <Stat label="Database" value={h?.database?.connected ? "Connected" : "Disconnected"} tone={h?.database?.connected ? "ok" : "bad"} />
              <Stat label="Response time" value={h ? `${h.latencyMs} ms` : "—"} tone={h && h.latencyMs > 3000 ? "warn" : undefined} />
              {h?.status === "ok" && <Stat label="Up for" value={uptime(h.uptimeSeconds)} />}
              {h?.memory && <Stat label="Memory in use" value={`${Math.round(Number(h.memory.rssMB))} MB`} />}
              <Stat
                label="Photo & file storage"
                value={services ? (services.media.driver === "cloudinary" ? `Cloudinary (${services.media.cloudName})` : services.media.driver === "local" ? "Local (development)" : "Not configured") : "—"}
                tone={services?.media.driver === "none" ? "bad" : services?.media.driver === "cloudinary" ? "ok" : "warn"}
              />
              <Stat label="Email replies" value={services ? (services.emailConfigured ? "Configured" : "Not configured") : "—"} tone={services?.emailConfigured ? "ok" : "warn"} />
            </div>
          )}
          {h?.error && (
            <div style={{ marginTop: "0.75rem" }}>
              <Note tone="warn">{h.error}. On Render&apos;s free plan the server sleeps when idle and takes up to a minute to wake.</Note>
            </div>
          )}
          <div className="adm-row" style={{ marginTop: "1rem" }}>
            <Button
              size="sm"
              loading={verifying}
              onClick={async () => {
                setVerifying(true);
                try {
                  const r = await api.get<{ ok: boolean; error?: string }>("contact/email-status?verify=1");
                  setEmailCheck(r);
                  if (r.ok) toast.ok("The email account accepted the login.");
                } catch (e) {
                  toast.bad(errorMessage(e));
                } finally {
                  setVerifying(false);
                }
              }}
            >
              Test email login
            </Button>
            {emailCheck && !emailCheck.ok && <span className="adm-error">{emailCheck.error}</span>}
            {emailCheck?.ok && <span className="adm-badge adm-badge--ok">Email works</span>}
          </div>
        </Section>

        <Section title="Collective Ledger" description="Read-only summary through the ledger admin account.">
          {ledger.isLoading && <LoadingBlock rows={3} />}
          {ledger.error && (
            <Note tone="warn">
              Not connected: {errorMessage(ledger.error)}. The dashboard reads the ledger using <span className="adm-code">COLLECTIVE_ADMIN_EMAIL</span> and{" "}
              <span className="adm-code">COLLECTIVE_ADMIN_PASSWORD</span>.
            </Note>
          )}
          {ledger.data && (
            <div className="adm-rows">
              <Stat label="Members" value={ledger.data.adminSummary?.totalMembers ?? ledger.data.overview?.users ?? "—"} />
              <Stat label="Communities" value={ledger.data.overview?.communities ?? "—"} />
              <Stat label="Collected" value={rupees(ledger.data.adminSummary?.totalCollectedPaise ?? ledger.data.overview?.paymentsTotalPaise)} />
              <Stat label="Invested" value={rupees(ledger.data.adminSummary?.totalInvestedPaise ?? ledger.data.overview?.investmentsTotalPaise)} />
              {typeof ledger.data.adminSummary?.latePayments === "number" && <Stat label="Late payments" value={ledger.data.adminSummary.latePayments} tone={ledger.data.adminSummary.latePayments ? "warn" : undefined} />}
            </div>
          )}
          <p style={{ marginTop: "1rem" }}>
            <a className="adm-btn adm-btn--sm" href="https://collective-sandy.vercel.app" target="_blank" rel="noopener noreferrer">
              Open Collective Ledger <ArrowUpRight />
            </a>
          </p>
        </Section>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <Section
          title="GitHub"
          actions={
            github.data && (
              <a className="adm-btn adm-btn--sm" href={github.data.stats.profileUrl} target="_blank" rel="noopener noreferrer">
                Profile <ArrowUpRight />
              </a>
            )
          }
        >
          {github.isLoading && <LoadingBlock rows={2} />}
          {github.error && <Note tone="warn">GitHub data isn&apos;t available right now ({errorMessage(github.error)}).</Note>}
          {github.data && (
            <>
              <p className="adm-muted" style={{ marginBottom: "1rem" }}>
                {github.data.stats.publicRepos} public repositories · {github.data.stats.followers} followers · {github.data.stats.totalStars} stars
                {github.data.stats.topLanguages.length > 0 && ` · mostly ${github.data.stats.topLanguages.map((l) => `${l.name} ${l.percentage}%`).join(", ")}`}
              </p>
              <div className="adm-rows">
                {github.data.repos.map((r) => (
                  <a key={r.id} className="adm-rowitem" href={r.html_url} target="_blank" rel="noopener noreferrer">
                    <div className="adm-rowitem__main">
                      <p className="adm-rowitem__title">{r.name}</p>
                      <p className="adm-rowitem__sub">{r.description || "No description"}</p>
                    </div>
                    {r.language && <span className="adm-badge">{r.language}</span>}
                    <span className="adm-small adm-muted adm-row" style={{ gap: 4 }}>
                      <Star size={13} /> {r.stargazers_count}
                    </span>
                    <span className="adm-small adm-muted">{timeAgo(r.updated_at)}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </Section>
      </div>
    </div>
  );
}
