"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Copy, Eye, EyeOff, GripVertical, Images, Link2, RefreshCw, Star, Trash2, X } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { DropZone, ImageField, Progress } from "@/features/admin/media";
import { uploadFile } from "@/features/admin/upload";
import { GALLERY_BASE, galleryHref, slugify, thumb } from "@/features/admin/galleries";
import { Button, ErrorBlock, LoadingBlock, Note, PageHeader, SaveBar, Section, Segmented, TextArea, TextField, useConfirm, useDraft, useToast } from "@/features/admin/ui";
import type { GalleryDoc, GalleryPhoto, GalleryVisibility } from "@/features/admin/types";

/** The editable part of a gallery. */
interface Draft {
  title: string;
  slug: string;
  kicker: string;
  intro: string;
  note: string;
  logoUrl: string;
  logoPublicId: string;
  visibility: GalleryVisibility;
  photos: string[];
  coverPhoto: string | null;
}

interface UploadState {
  name: string;
  progress: number;
  error?: string;
}

const VISIBILITY: { value: GalleryVisibility; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "private", label: "Private link" },
];

const toDraft = (g: GalleryDoc): Draft => ({
  title: g.title,
  slug: g.slug,
  kicker: g.kicker || "",
  intro: g.intro || "",
  note: g.note || "",
  logoUrl: g.logoUrl || "",
  logoPublicId: g.logoPublicId || "",
  visibility: g.visibility,
  photos: g.photos.map(String),
  coverPhoto: g.coverPhoto ? String(g.coverPhoto) : null,
});

const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, item);
  return next;
};

/** Logos bundled with the gallery app are relative to it; uploaded ones are absolute. */
const logoSrc = (url: string) => (url.startsWith("/") ? `${GALLERY_BASE}${url}` : url);

export default function GalleryEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const picker = useRef<HTMLDialogElement>(null);

  const query = useQuery({ queryKey: ["gallery-page", id], queryFn: () => api.get<GalleryDoc>(`galleries/${id}`) });
  const library = useQuery({ queryKey: ["gallery", "active"], queryFn: () => api.get<{ photos: GalleryPhoto[]; albums: string[] }>("gallery/admin") });
  const source = useMemo(() => (query.data ? toDraft(query.data) : undefined), [query.data]);
  const { draft, setDraft, dirty, reset } = useDraft<Draft>(source);
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  // Every photo we know about (this gallery's + the library + fresh uploads), by id.
  const [extraDocs, setExtraDocs] = useState<GalleryPhoto[]>([]);
  const docs = useMemo(() => {
    const m = new Map<string, GalleryPhoto>();
    for (const p of [...(library.data?.photos || []), ...(query.data?.photoDocs || []), ...extraDocs]) m.set(String(p._id), p);
    return m;
  }, [library.data, query.data, extraDocs]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [pickAlbum, setPickAlbum] = useState("");
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const refreshLists = () => {
    qc.invalidateQueries({ queryKey: ["galleries"] });
    qc.invalidateQueries({ queryKey: ["gallery"] });
    qc.invalidateQueries({ queryKey: ["overview"] });
  };

  const save = useMutation({
    mutationFn: (d: Draft) =>
      api.patch<GalleryDoc>(`galleries/${id}`, {
        title: d.title.trim(),
        slug: d.slug,
        kicker: d.kicker,
        intro: d.intro,
        note: d.note,
        logoUrl: d.logoUrl,
        ...(d.logoPublicId ? { logoPublicId: d.logoPublicId } : {}),
        visibility: d.visibility,
        photos: d.photos,
        coverPhoto: d.coverPhoto && d.photos.includes(d.coverPhoto) ? d.coverPhoto : null,
      }),
    onSuccess: (g) => {
      // Keep the photo documents we already have; the PATCH reply only carries ids.
      qc.setQueryData<GalleryDoc>(["gallery-page", id], (old) => ({ ...g, photoDocs: old?.photoDocs }));
      refreshLists();
    },
  });

  const saveDraft = async (d: Draft, message?: string) => {
    if (!d.title.trim()) {
      toast.bad("Give the gallery a name.");
      return false;
    }
    if (d.slug.length < 2) {
      toast.bad("The address needs at least 2 characters.");
      return false;
    }
    try {
      await save.mutateAsync(d);
      toast.ok(message || (d.visibility === "draft" ? "Saved as a draft." : "Saved. The gallery is updated."));
      return true;
    } catch (e) {
      toast.bad(errorMessage(e));
      return false;
    }
  };

  const shareKey = useMutation({
    mutationFn: () => api.post<{ shareKey: string }>(`galleries/${id}/share-key`),
    onSuccess: (r) => {
      qc.setQueryData<GalleryDoc>(["gallery-page", id], (old) => (old ? { ...old, shareKey: r.shareKey } : old));
      qc.invalidateQueries({ queryKey: ["galleries"] });
      toast.ok("New private link created. The old link no longer works.");
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });
  const makeMain = useMutation({
    mutationFn: () => api.post<GalleryDoc>(`galleries/${id}/set-default`),
    onSuccess: (g) => {
      qc.setQueryData<GalleryDoc>(["gallery-page", id], (old) => (old ? { ...old, isDefault: g.isDefault } : old));
      refreshLists();
      toast.ok(`This gallery now opens at ${GALLERY_BASE}.`);
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });

  /** Upload many photos: they go into the library and straight into this gallery (at the start). */
  const onFiles = async (files: File[]) => {
    if (!draft) return;
    const images = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (images.length !== files.length) toast.info(`${files.length - images.length} file(s) skipped — only images can be added.`);
    if (!images.length) return;
    setUploads(images.map((f) => ({ name: f.name, progress: 0 })));
    const done: (Partial<GalleryPhoto> & { originalFilename: string; format?: string })[] = [];
    let cursor = 0;
    const worker = async () => {
      while (cursor < images.length) {
        const i = cursor++;
        const f = images[i];
        try {
          const a = await uploadFile(f, "gallery", (p) => setUploads((u) => u.map((x, j) => (j === i ? { ...x, progress: p } : x))));
          done[i] = { url: a.url, publicId: a.publicId, width: a.width, height: a.height, originalFilename: f.name, format: a.format };
        } catch (e) {
          setUploads((u) => u.map((x, j) => (j === i ? { ...x, error: errorMessage(e) } : x)));
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]);
    const ok = done.filter(Boolean);
    if (ok.length) {
      try {
        const created: GalleryPhoto[] = [];
        for (let i = 0; i < ok.length; i += 100) {
          // "none": add to the library only — this gallery's list is saved below together with any other edits.
          created.push(...(await api.post<GalleryPhoto[]>("gallery/bulk", { photos: ok.slice(i, i + 100), position: "start", galleryId: "none" })));
        }
        setExtraDocs((x) => [...created, ...x]);
        const ids = created.map((p) => String(p._id));
        const next = { ...draft, photos: [...ids, ...draft.photos.filter((p) => !ids.includes(p))] };
        setDraft(next);
        await saveDraft(next, `${ids.length} photo${ids.length === 1 ? "" : "s"} uploaded and added to this gallery.`);
      } catch (e) {
        toast.bad(errorMessage(e));
      }
    }
    setUploads((u) => u.filter((x) => x.error));
  };

  const openPublic = async () => {
    const g = query.data;
    if (!g || !draft) return;
    if (dirty && !(await saveDraft(draft))) return;
    if (draft.visibility === "draft") {
      try {
        const r = await api.post<{ token: string; slug: string }>(`galleries/${id}/preview-token`);
        window.open(`${GALLERY_BASE}/${r.slug}?preview=${encodeURIComponent(r.token)}`, "_blank", "noopener");
      } catch (e) {
        toast.bad(errorMessage(e));
      }
      return;
    }
    window.open(galleryHref({ ...g, slug: draft.slug, visibility: draft.visibility }), "_blank", "noopener");
  };

  if (query.isLoading) return <div className="adm-page"><LoadingBlock rows={6} /></div>;
  if (query.error) return <div className="adm-page"><ErrorBlock error={query.error} onRetry={() => query.refetch()} /></div>;
  if (!draft || !query.data) return null;
  const g = query.data;

  const inGallery = new Set(draft.photos);
  const photoList = draft.photos.map((pid) => docs.get(pid)).filter(Boolean) as GalleryPhoto[];
  const hiddenCount = photoList.filter((p) => !p.isVisible).length;
  const pickable = (library.data?.photos || []).filter((p) => !inGallery.has(String(p._id)) && (!pickAlbum || p.album === pickAlbum));
  const privateLink = typeof window !== "undefined" ? `${window.location.origin}${GALLERY_BASE}/${g.slug}?key=${g.shareKey}` : "";
  const busyUploading = uploads.some((u) => !u.error && u.progress < 1);

  const toggleSel = (pid: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(pid)) n.delete(pid);
      else n.add(pid);
      return n;
    });

  return (
    <div className="adm-page">
      <p style={{ marginBottom: "1rem" }}>
        <Link className="adm-btn adm-btn--quiet adm-btn--sm" href="/me/galleries">
          <ArrowLeft /> All galleries
        </Link>
      </p>
      <PageHeader
        title={draft.title || "Untitled gallery"}
        where={
          <>
            {VISIBILITY.find((v) => v.value === g.visibility)?.label} · <span className="adm-code">{g.isDefault ? GALLERY_BASE : `${GALLERY_BASE}/${g.slug}`}</span>
            {g.isDefault && " · main gallery"} · {photoList.length} photo{photoList.length === 1 ? "" : "s"}
          </>
        }
        actions={
          <>
            <Button icon={draft.visibility === "draft" ? <Eye /> : <ArrowUpRight />} onClick={openPublic}>
              {draft.visibility === "draft" ? "Preview draft" : "Open gallery"}
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 />}
              onClick={async () => {
                if (g.isDefault) return toast.bad("This is your main gallery. Make another gallery the main one before deleting it.");
                if (
                  !(await confirm({
                    title: `Delete “${g.title}”?`,
                    body: `Its address stops working. The ${photoList.length} photo${photoList.length === 1 ? "" : "s"} stay in your photo library and in any other gallery.`,
                    confirmLabel: "Delete gallery",
                    danger: true,
                  }))
                )
                  return;
                try {
                  await api.del(`galleries/${id}`);
                  refreshLists();
                  toast.ok("Gallery deleted. Its photos are still in your photo library.");
                  router.push("/me/galleries");
                } catch (e) {
                  toast.bad(errorMessage(e));
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <div className="adm-grid adm-grid--2" style={{ alignItems: "start" }}>
        <Section title="Words" description="What visitors read at the top of this gallery.">
          <div className="adm-stack">
            <TextField label="Gallery name" value={draft.title} onChange={(title) => set({ title })} maxLength={80} required />
            <TextField
              label="Address"
              code
              value={draft.slug}
              onChange={(v) => set({ slug: slugify(v) })}
              hint={g.isDefault ? `Main gallery — opens at nirmalranpariya.in${GALLERY_BASE} and at ${GALLERY_BASE}/${draft.slug || "…"}` : `nirmalranpariya.in${GALLERY_BASE}/${draft.slug || "…"} — changing it breaks old links.`}
            />
            <TextField label="Small line above the name" value={draft.kicker} onChange={(kicker) => set({ kicker })} maxLength={120} optional placeholder="for my favourite person" />
            <TextArea
              label="Welcome text"
              value={draft.intro}
              onChange={(intro) => set({ intro })}
              maxLength={400}
              optional
              hint={`Leave empty to show “${photoList.length - hiddenCount} little moments, kept somewhere soft…”.`}
            />
            <TextField label="Handwritten note" value={draft.note} onChange={(note) => set({ note })} maxLength={200} optional hint="Shown on a small card. Leave empty to hide the card." />
          </div>
        </Section>

        <div className="adm-stack">
          <Section title="Who can see it">
            <div className="adm-stack">
              {g.isDefault ? (
                <Note tone="info">This is your main gallery, so it stays published at {GALLERY_BASE}. To hide it, make another gallery the main one first.</Note>
              ) : (
                <Segmented label="Visibility" value={draft.visibility} onChange={(visibility) => set({ visibility })} options={VISIBILITY} />
              )}
              <p className="adm-hint">
                {draft.visibility === "draft" && "Only you can see it, with “Preview draft”."}
                {draft.visibility === "published" && `Anyone with the address can open it.`}
                {draft.visibility === "private" && "Only people you send the private link to can open it. The plain address shows “not found”."}
              </p>
              {draft.visibility === "private" && g.visibility === "private" && (
                <div className="adm-field">
                  <span className="adm-label">Private link</span>
                  <div className="adm-row" style={{ flexWrap: "nowrap" }}>
                    <input className="adm-input adm-input--code" readOnly value={privateLink} aria-label="Private link" onFocus={(e) => e.currentTarget.select()} />
                    <Button
                      icon={<Copy />}
                      onClick={() => {
                        navigator.clipboard?.writeText(privateLink);
                        toast.info("Private link copied.");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <div>
                    <Button
                      size="sm"
                      variant="quiet"
                      icon={<RefreshCw />}
                      loading={shareKey.isPending}
                      onClick={async () => {
                        if (await confirm({ title: "Create a new private link?", body: "Anyone using the old link won't be able to open the gallery any more.", confirmLabel: "New link" })) shareKey.mutate();
                      }}
                    >
                      New link (stop the old one)
                    </Button>
                  </div>
                </div>
              )}
              {draft.visibility === "private" && g.visibility !== "private" && <p className="adm-hint"><Link2 size={14} /> Save to get the private link.</p>}
              {!g.isDefault && g.visibility === "published" && !dirty && (
                <div>
                  <Button size="sm" icon={<Star />} loading={makeMain.isPending} onClick={() => makeMain.mutate()}>
                    Make this the main gallery
                  </Button>
                </div>
              )}
            </div>
          </Section>
          <Section title="Logo" description="Optional small image in the top bar. Without one, the gallery name is shown.">
            <ImageField
              label="Logo"
              kind="gallery"
              withAlt={false}
              value={draft.logoUrl ? { src: logoSrc(draft.logoUrl), alt: "" } : null}
              onChange={(v) => set(v ? { logoUrl: v.src, logoPublicId: v.publicId || "" } : { logoUrl: "", logoPublicId: "" })}
            />
          </Section>
        </div>
      </div>

      <Section
        title={`Photos (${photoList.length})`}
        description={
          <>
            Drag to reorder. The first photos appear first. Removing a photo here keeps it in your{" "}
            <Link href="/me/gallery">photo library</Link>.{hiddenCount > 0 && ` ${hiddenCount} hidden photo${hiddenCount === 1 ? " is" : "s are"} not shown to visitors (hidden in the library).`}
          </>
        }
        actions={
          <Button
            icon={<Images />}
            onClick={() => {
              setPicked(new Set());
              library.refetch();
              picker.current?.showModal();
            }}
          >
            Add from library
          </Button>
        }
      >
        <div className="adm-stack" style={{ gap: "0.75rem" }}>
          <DropZone kind="gallery" multiple label="Drop photos here or choose files" hint="Select many at once. They're added to the start of this gallery and kept in your photo library." onFiles={onFiles} disabled={busyUploading} />
          {uploads.length > 0 && (
            <div className="adm-uploads" aria-live="polite">
              {uploads.map((u, i) => (
                <div key={i} className="adm-row" style={{ flexWrap: "nowrap" }}>
                  <span className="adm-small" style={{ flex: "0 0 40%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.name}
                  </span>
                  {u.error ? <span className="adm-error adm-small">{u.error}</span> : <Progress value={u.progress} />}
                </div>
              ))}
            </div>
          )}

          {selected.size > 0 && (
            <div className="adm-bulkbar" role="region" aria-label="Selected photos">
              <span>{selected.size} selected</span>
              <Button
                size="sm"
                icon={<X />}
                onClick={() => {
                  set({ photos: draft.photos.filter((p) => !selected.has(p)) });
                  setSelected(new Set());
                }}
              >
                Remove from this gallery
              </Button>
              <Button size="sm" variant="quiet" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
          )}

          {photoList.length === 0 ? (
            <p className="adm-empty-inline">No photos yet. Drop some above, or add them from your library.</p>
          ) : (
            <ol className="adm-gphotos">
              {photoList.map((p, i) => {
                const pid = String(p._id);
                const isCover = draft.coverPhoto === pid;
                return (
                  <li
                    key={pid}
                    className="adm-gphoto"
                    data-dragging={dragFrom === i}
                    data-selected={selected.has(pid)}
                    draggable
                    onDragStart={(e) => {
                      setDragFrom(i);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragFrom !== null && dragFrom !== i) set({ photos: move(draft.photos, dragFrom, i) });
                      setDragFrom(null);
                    }}
                    onDragEnd={() => setDragFrom(null)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(p.url, 300)} alt={p.caption || "Photo"} loading="lazy" draggable={false} />
                    <span className="adm-gphoto__n">{i + 1}</span>
                    <label className="adm-gphoto__check">
                      <input type="checkbox" checked={selected.has(pid)} onChange={() => toggleSel(pid)} aria-label={`Select photo ${i + 1}`} />
                    </label>
                    {!p.isVisible && (
                      <span className="adm-gphoto__flag" title="Hidden in the photo library — visitors don't see it">
                        <EyeOff size={13} /> Hidden
                      </span>
                    )}
                    {isCover && <span className="adm-gphoto__flag adm-gphoto__flag--cover">Cover</span>}
                    <div className="adm-gphoto__bar">
                      <GripVertical size={15} aria-hidden="true" className="adm-gphoto__grip" />
                      <Button size="sm" variant="quiet" iconOnly icon={<ChevronLeft />} disabled={i === 0} onClick={() => set({ photos: move(draft.photos, i, i - 1) })}>
                        Move earlier
                      </Button>
                      <Button size="sm" variant="quiet" iconOnly icon={<ChevronRight />} disabled={i === photoList.length - 1} onClick={() => set({ photos: move(draft.photos, i, i + 1) })}>
                        Move later
                      </Button>
                      <Button size="sm" variant="quiet" iconOnly icon={<Star fill={isCover ? "currentColor" : "none"} />} onClick={() => set({ coverPhoto: isCover ? null : pid })}>
                        {isCover ? "Remove as cover" : "Use as cover"}
                      </Button>
                      <Button size="sm" variant="quiet" iconOnly icon={<X />} onClick={() => set({ photos: draft.photos.filter((x) => x !== pid) })}>
                        Remove from this gallery
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </Section>

      <dialog ref={picker} className="adm-dialog adm-dialog--wide" aria-label="Add photos from your library">
        <div className="adm-dialog__body">
          <h2 className="adm-dialog__title">Add from your photo library</h2>
          <div className="adm-row" style={{ margin: "0.5rem 0 1rem" }}>
            {(library.data?.albums || []).length > 0 && (
              <select className="adm-select" aria-label="Album" value={pickAlbum} onChange={(e) => setPickAlbum(e.target.value)} style={{ width: "auto" }}>
                <option value="">All albums</option>
                {(library.data?.albums || []).map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            )}
            <Button size="sm" variant="quiet" onClick={() => setPicked(new Set(pickable.map((p) => String(p._id))))} disabled={!pickable.length}>
              Select all {pickable.length}
            </Button>
            {picked.size > 0 && (
              <Button size="sm" variant="quiet" onClick={() => setPicked(new Set())}>
                Clear
              </Button>
            )}
          </div>
          {library.isFetching && !library.data && <LoadingBlock rows={2} />}
          {library.data && pickable.length === 0 && <p className="adm-muted">Every photo in {pickAlbum ? "this album" : "your library"} is already in this gallery.</p>}
          {pickable.length > 0 && (
            <div className="adm-pick">
              {pickable.map((p) => {
                const pid = String(p._id);
                return (
                  <button
                    key={pid}
                    type="button"
                    aria-pressed={picked.has(pid)}
                    title={p.caption || undefined}
                    onClick={() =>
                      setPicked((s) => {
                        const n = new Set(s);
                        if (n.has(pid)) n.delete(pid);
                        else n.add(pid);
                        return n;
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb(p.url, 220)} alt={p.caption || "Library photo"} loading="lazy" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="adm-dialog__foot">
          <Button onClick={() => picker.current?.close()}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!picked.size}
            onClick={() => {
              const order = (library.data?.photos || []).map((p) => String(p._id)).filter((pid) => picked.has(pid));
              set({ photos: [...draft.photos, ...order] });
              picker.current?.close();
              toast.info(`${order.length} photo${order.length === 1 ? "" : "s"} added at the end. Save to keep them.`);
            }}
          >
            Add {picked.size || ""} photo{picked.size === 1 ? "" : "s"}
          </Button>
        </div>
      </dialog>

      <SaveBar dirty={dirty} saving={save.isPending} onSave={() => draft && saveDraft(draft)} onDiscard={reset} />
    </div>
  );
}
