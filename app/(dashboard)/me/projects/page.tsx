"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { Button, Empty, ErrorBlock, LoadingBlock, PageHeader, timeAgo, useToast } from "@/features/admin/ui";
import type { ProjectDoc } from "@/features/admin/types";

const complete = (p: ProjectDoc) => Boolean(p.title && p.slug && p.oneLiner && p.kind);

export default function ProjectsPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["projects"], queryFn: () => api.get<ProjectDoc[]>("portfolio/projects?all=1") });
  const reorder = useMutation({
    mutationFn: (ids: string[]) => api.patch<ProjectDoc[]>("portfolio/projects/reorder", { ids }),
    onMutate: async (ids) => {
      const prev = qc.getQueryData<ProjectDoc[]>(["projects"]);
      if (prev) qc.setQueryData(["projects"], ids.map((id) => prev.find((p) => p._id === id)!).filter(Boolean));
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["projects"], ctx.prev);
      toast.bad(errorMessage(err));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
  const visibility = useMutation({
    mutationFn: (p: ProjectDoc) => api.patch(`portfolio/projects/${p._id}`, { isVisible: !p.isVisible }),
    onSuccess: (_d, p) => {
      toast.ok(p.isVisible ? `“${p.title}” is hidden from your website.` : `“${p.title}” is visible on your website.`);
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["overview"] });
    },
    onError: (err) => toast.bad(errorMessage(err)),
  });

  const move = (i: number, to: number) => {
    if (!data || to < 0 || to >= data.length) return;
    const ids = data.map((p) => p._id);
    const [x] = ids.splice(i, 1);
    ids.splice(to, 0, x);
    reorder.mutate(ids);
  };

  return (
    <div className="adm-page">
      <PageHeader
        title="Projects"
        description="Each project is a full case study on your website. The order here is the order visitors see."
        where={
          <>
            Shown on: Home page and{" "}
            <a href="/work" target="_blank" rel="noopener noreferrer">
              /work
            </a>
          </>
        }
        actions={
          <Link className="adm-btn adm-btn--primary" href="/me/projects/new">
            <Plus /> New project
          </Link>
        }
      />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <Empty title="No projects in the database yet" action={<Link className="adm-btn" href="/me/projects/new">Create a project</Link>}>
          Your site is showing its built-in case studies. Run the content migration to edit them here, or create a new one.
        </Empty>
      )}
      {data && data.length > 0 && (
        <div className="adm-rows">
          {data.map((p, i) => {
            const thumb = p.cover?.src || p.screens?.[0]?.src;
            return (
              <div className="adm-rowitem" key={p._id}>
                <div className="adm-list__handle">
                  <Button size="sm" variant="quiet" iconOnly icon={<ChevronUp />} disabled={i === 0 || reorder.isPending} onClick={() => move(i, i - 1)}>
                    {`Move ${p.title} up`}
                  </Button>
                  <Button size="sm" variant="quiet" iconOnly icon={<ChevronDown />} disabled={i === data.length - 1 || reorder.isPending} onClick={() => move(i, i + 1)}>
                    {`Move ${p.title} down`}
                  </Button>
                </div>
                <div className="adm-thumb" style={{ width: 56, height: 56, flex: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {thumb ? <img src={thumb} alt="" /> : null}
                </div>
                <Link href={`/me/projects/${p._id}`} className="adm-rowitem__main" style={{ textDecoration: "none" }}>
                  <p className="adm-rowitem__title">
                    {p.number && <span className="adm-muted">{p.number} </span>}
                    {p.title}
                  </p>
                  <p className="adm-rowitem__sub">{p.oneLiner || p.description || "No summary yet"}</p>
                  <p className="adm-row" style={{ marginTop: 4, gap: 6 }}>
                    {!p.isVisible ? (
                      <span className="adm-badge">Hidden</span>
                    ) : complete(p) ? (
                      <span className="adm-badge adm-badge--ok">Live</span>
                    ) : (
                      <span className="adm-badge adm-badge--warn">Incomplete — not shown</span>
                    )}
                    <span className="adm-small adm-muted">Edited {timeAgo(p.updatedAt)}</span>
                  </p>
                </Link>
                <Button size="sm" icon={p.isVisible ? <EyeOff /> : <Eye />} onClick={() => visibility.mutate(p)} loading={visibility.isPending && visibility.variables?._id === p._id}>
                  {p.isVisible ? "Hide" : "Show"}
                </Button>
                <Link className="adm-btn adm-btn--sm" href={`/me/projects/${p._id}`}>
                  Edit
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
