"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Copy, Plus, Star } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { Button, Empty, ErrorBlock, LoadingBlock, PageHeader, TextField, timeAgo, useToast } from "@/features/admin/ui";
import type { BirthdayPage, BirthdaySummary } from "@/features/admin/types";

const slugify = (v: string) => v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 60);

export default function BirthdaysPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["birthdays"], queryFn: () => api.get<BirthdaySummary[]>("birthdays") });
  const dialog = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({ recipientName: "", slug: "", birthdayDate: "", fromName: "Nirmal", copyFromId: "" });
  const [slugTouched, setSlugTouched] = useState(false);
  const create = useMutation({
    mutationFn: () => api.post<BirthdayPage>("birthdays", { ...form, copyFromId: form.copyFromId || undefined }),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: ["birthdays"] });
      qc.invalidateQueries({ queryKey: ["overview"] });
      toast.ok(`Page for ${p.recipientName} created as a draft.`);
      router.push(`/me/birthdays/${p._id}`);
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });
  const setDefault = useMutation({
    mutationFn: (id: string) => api.post(`birthdays/${id}/set-default`),
    onSuccess: () => {
      toast.ok("Main birthday page changed.");
      qc.invalidateQueries({ queryKey: ["birthdays"] });
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });

  return (
    <div className="adm-page">
      <PageHeader
        title="Birthday pages"
        description="A personal, animated birthday page for anyone. Each one has its own address, colours, words, photos and music."
        where={
          <>
            The main page opens at{" "}
            <a href="/birthdaywish" target="_blank" rel="noopener noreferrer">
              /birthdaywish
            </a>
            ; every page also has its own address.
          </>
        }
        actions={
          <Button variant="primary" icon={<Plus />} onClick={() => dialog.current?.showModal()}>
            New birthday page
          </Button>
        }
      />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <Empty title="No birthday pages yet" action={<Button onClick={() => dialog.current?.showModal()}>Create the first one</Button>}>
          Start from a ready-made design and change anything you like.
        </Empty>
      )}
      {data && data.length > 0 && (
        <div className="adm-bcards">
          {data.map((b) => (
            <article key={b._id} className="adm-card adm-bcard">
              <div className="adm-bcard__cover" style={{ background: `linear-gradient(135deg, ${b.theme.primary}, ${b.theme.background})` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {b.cover && <img src={b.cover.replace("/upload/", "/upload/c_fill,w_600,h_340,q_auto,f_auto/")} alt="" />}
                <span>{b.recipientName}</span>
              </div>
              <div className="adm-bcard__body">
                <div className="adm-row" style={{ gap: 6 }}>
                  {b.isPublished ? <span className="adm-badge adm-badge--ok">Published</span> : <span className="adm-badge">Draft</span>}
                  {b.isDefault && <span className="adm-badge adm-badge--accent">Main page</span>}
                  <span className="adm-small adm-muted">
                    {b.photoCount} photo{b.photoCount === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="adm-small adm-muted">
                  <span className="adm-code">/birthdaywish/{b.slug}</span>
                  <br />
                  Edited {timeAgo(b.updatedAt)}
                  {b.birthdayDate && ` · birthday ${new Date(b.birthdayDate).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`}
                </p>
                <div className="adm-row" style={{ marginTop: "auto" }}>
                  <Link className="adm-btn adm-btn--sm adm-btn--primary" href={`/me/birthdays/${b._id}`}>
                    Edit
                  </Link>
                  {b.isPublished && (
                    <a className="adm-btn adm-btn--sm" href={`/birthdaywish/${b.slug}`} target="_blank" rel="noopener noreferrer">
                      Open <ArrowUpRight />
                    </a>
                  )}
                  {!b.isDefault && (
                    <Button size="sm" variant="quiet" icon={<Star />} onClick={() => setDefault.mutate(b._id)}>
                      Make main
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <dialog ref={dialog} className="adm-dialog" aria-label="New birthday page">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <div className="adm-dialog__body adm-stack">
            <h2 className="adm-dialog__title">New birthday page</h2>
            <TextField
              label="Who is it for?"
              value={form.recipientName}
              required
              onChange={(recipientName) => setForm((f) => ({ ...f, recipientName, ...(!slugTouched ? { slug: slugify(recipientName) } : {}) }))}
            />
            <TextField
              label="Page address"
              code
              hint={`nirmalranpariya.in/birthdaywish/${form.slug || "…"}`}
              value={form.slug}
              onChange={(slug) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(slug) }));
              }}
            />
            <div className="adm-grid adm-grid--2">
              <TextField label="Birthday" type="date" value={form.birthdayDate} onChange={(birthdayDate) => setForm((f) => ({ ...f, birthdayDate }))} optional />
              <TextField label="From" value={form.fromName} onChange={(fromName) => setForm((f) => ({ ...f, fromName }))} optional />
            </div>
            {data && data.length > 0 && (
              <div className="adm-field">
                <label className="adm-label" htmlFor="copy">
                  Start from
                </label>
                <select id="copy" className="adm-select" value={form.copyFromId} onChange={(e) => setForm((f) => ({ ...f, copyFromId: e.target.value }))}>
                  <option value="">The standard design</option>
                  {data.map((b) => (
                    <option key={b._id} value={b._id}>
                      A copy of {b.recipientName}&apos;s page
                    </option>
                  ))}
                </select>
              </div>
            )}
            <p className="adm-hint">The page starts as a draft so you can finish it before anyone sees it.</p>
          </div>
          <div className="adm-dialog__foot">
            <Button onClick={() => dialog.current?.close()}>Cancel</Button>
            <Button type="submit" variant="primary" icon={<Copy />} loading={create.isPending} disabled={!form.recipientName.trim() || form.slug.length < 2}>
              Create page
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
