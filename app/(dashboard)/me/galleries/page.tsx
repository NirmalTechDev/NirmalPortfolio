"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Copy, Plus, Star } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { Button, Empty, ErrorBlock, LoadingBlock, PageHeader, TextField, timeAgo, useToast } from "@/features/admin/ui";
import type { GalleryDoc, GallerySummary, GalleryVisibility } from "@/features/admin/types";
import { GALLERY_BASE, galleryHref, slugify } from "@/features/admin/galleries";

const BADGE: Record<GalleryVisibility, { label: string; cls: string }> = {
  published: { label: "Published", cls: "adm-badge adm-badge--ok" },
  private: { label: "Private link", cls: "adm-badge adm-badge--info" },
  draft: { label: "Draft", cls: "adm-badge" },
};

const cover = (url: string) => (url.includes("/upload/") ? url.replace("/upload/", "/upload/c_fill,w_600,h_340,q_auto,f_auto/") : url);

export default function GalleriesPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["galleries"], queryFn: () => api.get<GallerySummary[]>("galleries") });
  const dialog = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({ title: "", slug: "", copyFromId: "" });
  const [slugTouched, setSlugTouched] = useState(false);

  const create = useMutation({
    mutationFn: () => api.post<GalleryDoc>("galleries", { title: form.title, slug: form.slug, ...(form.copyFromId ? { copyFromId: form.copyFromId } : {}) }),
    onSuccess: (g) => {
      qc.invalidateQueries({ queryKey: ["galleries"] });
      toast.ok(`“${g.title}” created as a draft. Add photos, then publish it.`);
      router.push(`/me/galleries/${g._id}`);
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });
  const setDefault = useMutation({
    mutationFn: (id: string) => api.post(`galleries/${id}/set-default`),
    onSuccess: () => {
      toast.ok(`Main gallery changed. It now opens at ${GALLERY_BASE}.`);
      qc.invalidateQueries({ queryKey: ["galleries"] });
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });

  const openNew = () => {
    setForm({ title: "", slug: "", copyFromId: "" });
    setSlugTouched(false);
    dialog.current?.showModal();
  };

  return (
    <div className="adm-page">
      <PageHeader
        title="Galleries"
        description="Separate photo galleries for different people or moments. Each has its own address, words and photos, chosen from your photo library."
        where={
          <>
            The main gallery opens at{" "}
            <a href={GALLERY_BASE} target="_blank" rel="noopener noreferrer">
              {GALLERY_BASE}
            </a>
            ; every gallery also has its own address. Deleting a gallery never deletes its photos.
          </>
        }
        actions={
          <Button variant="primary" icon={<Plus />} onClick={openNew}>
            New gallery
          </Button>
        }
      />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <Empty title="No galleries yet" action={<Button onClick={openNew}>Create the first one</Button>}>
          A gallery is a page with photos you choose from your library.
        </Empty>
      )}
      {data && data.length > 0 && (
        <div className="adm-bcards">
          {data.map((g) => (
            <article key={g._id} className="adm-card adm-bcard">
              <div className="adm-bcard__cover" style={{ background: "linear-gradient(135deg, #ffb3c7, #c9b3ff)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.cover && <img src={cover(g.cover)} alt="" />}
                <span>{g.title}</span>
              </div>
              <div className="adm-bcard__body">
                <div className="adm-row" style={{ gap: 6 }}>
                  <span className={BADGE[g.visibility].cls}>{BADGE[g.visibility].label}</span>
                  {g.isDefault && <span className="adm-badge adm-badge--accent">Main gallery</span>}
                  <span className="adm-small adm-muted">
                    {g.photoCount} photo{g.photoCount === 1 ? "" : "s"}
                    {g.visibleCount < g.photoCount && ` · ${g.photoCount - g.visibleCount} hidden`}
                  </span>
                </div>
                <p className="adm-small adm-muted">
                  <span className="adm-code">{g.isDefault ? GALLERY_BASE : `${GALLERY_BASE}/${g.slug}`}</span>
                  <br />
                  Edited {timeAgo(g.updatedAt)}
                </p>
                <div className="adm-row" style={{ marginTop: "auto" }}>
                  <Link className="adm-btn adm-btn--sm adm-btn--primary" href={`/me/galleries/${g._id}`}>
                    Edit
                  </Link>
                  {g.visibility !== "draft" && (
                    <a className="adm-btn adm-btn--sm" href={galleryHref(g)} target="_blank" rel="noopener noreferrer">
                      Open <ArrowUpRight />
                    </a>
                  )}
                  {!g.isDefault && g.visibility === "published" && (
                    <Button size="sm" variant="quiet" icon={<Star />} loading={setDefault.isPending && setDefault.variables === g._id} onClick={() => setDefault.mutate(g._id)}>
                      Make main
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <dialog ref={dialog} className="adm-dialog" aria-label="New gallery">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <div className="adm-dialog__body adm-stack">
            <h2 className="adm-dialog__title">New gallery</h2>
            <TextField
              label="Gallery name"
              placeholder="e.g. Mom's 60th, Goa trip 2026"
              value={form.title}
              required
              onChange={(title) => setForm((f) => ({ ...f, title, ...(!slugTouched ? { slug: slugify(title) } : {}) }))}
            />
            <TextField
              label="Address"
              code
              hint={`nirmalranpariya.in${GALLERY_BASE}/${form.slug || "…"}`}
              value={form.slug}
              onChange={(slug) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(slug) }));
              }}
            />
            {data && data.length > 0 && (
              <div className="adm-field">
                <label className="adm-label" htmlFor="copy">
                  Start from
                </label>
                <select id="copy" className="adm-select" value={form.copyFromId} onChange={(e) => setForm((f) => ({ ...f, copyFromId: e.target.value }))}>
                  <option value="">An empty gallery</option>
                  {data.map((g) => (
                    <option key={g._id} value={g._id}>
                      A copy of “{g.title}” ({g.photoCount} photos)
                    </option>
                  ))}
                </select>
              </div>
            )}
            <p className="adm-hint">It starts as a draft, so nobody sees it until you publish it or share its private link.</p>
          </div>
          <div className="adm-dialog__foot">
            <Button onClick={() => dialog.current?.close()}>Cancel</Button>
            <Button type="submit" variant="primary" icon={<Copy />} loading={create.isPending} disabled={!form.title.trim() || form.slug.length < 2}>
              Create gallery
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
