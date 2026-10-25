"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, ChevronLeft, ChevronRight, Eye, EyeOff, GripVertical, Heart, RefreshCw, RotateCcw, Trash2, X } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { DropZone, Progress } from "@/features/admin/media";
import { uploadFile } from "@/features/admin/upload";
import { Button, Empty, ErrorBlock, LoadingBlock, Note, PageHeader, Segmented, SelectField, TextField, Toggle, useConfirm, useToast } from "@/features/admin/ui";
import type { FrameStyle, GalleryPhoto } from "@/features/admin/types";

interface AdminGallery {
  photos: GalleryPhoto[];
  stats: { total: number; visible: number; hidden: number; trashed: number };
  albums: string[];
}
type View = "all" | "visible" | "hidden" | "trash";

const FRAMES: { value: FrameStyle; label: string }[] = [
  { value: "pearl", label: "Pearl" },
  { value: "floral", label: "Floral" },
  { value: "polaroid", label: "Polaroid" },
];
/** Public address of the gallery (served through this website). */
const GALLERY_PATH = "/LovedOnesGallery";

/** Small square thumbnail URL (Cloudinary transformation) to keep the grid fast. */
const thumb = (url: string, size = 360) =>
  url.includes("res.cloudinary.com") && url.includes("/upload/") ? url.replace("/upload/", `/upload/c_fill,w_${size},h_${size},q_auto,f_auto/`) : url;

interface UploadState {
  name: string;
  progress: number;
  error?: string;
}

export default function GalleryAdminPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [view, setView] = useState<View>("all");
  const [album, setAlbum] = useState<string>("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);
  const [arrange, setArrange] = useState<GalleryPhoto[] | null>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);

  const active = useQuery({ queryKey: ["gallery", "active"], queryFn: () => api.get<AdminGallery>("gallery/admin") });
  const trash = useQuery({ queryKey: ["gallery", "trash"], queryFn: () => api.get<AdminGallery>("gallery/admin?trash=1"), enabled: view === "trash" });
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["gallery"] });
    qc.invalidateQueries({ queryKey: ["overview"] });
  };

  const photos = useMemo(() => {
    if (view === "trash") return trash.data?.photos || [];
    let list = active.data?.photos || [];
    if (view === "visible") list = list.filter((p) => p.isVisible);
    if (view === "hidden") list = list.filter((p) => !p.isVisible);
    if (album) list = list.filter((p) => p.album === album);
    return list;
  }, [view, album, active.data, trash.data]);

  useEffect(() => setSelected(new Set()), [view, album]);

  const bulk = useMutation({
    mutationFn: (changes: Partial<GalleryPhoto>) => api.patch<{ modified: number }>("gallery/bulk", { ids: [...selected], changes }),
    onSuccess: (r) => {
      toast.ok(`${r.modified} photo${r.modified === 1 ? "" : "s"} updated.`);
      setSelected(new Set());
      refresh();
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });

  const onFiles = async (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (images.length !== files.length) toast.info(`${files.length - images.length} file(s) skipped — only images can be added.`);
    if (!images.length) return;
    setUploads(images.map((f) => ({ name: f.name, progress: 0 })));
    const done: Partial<GalleryPhoto>[] = [];
    // Two at a time keeps the browser responsive on slow connections.
    let cursor = 0;
    const worker = async () => {
      while (cursor < images.length) {
        const i = cursor++;
        const f = images[i];
        try {
          const a = await uploadFile(f, "gallery", (p) => setUploads((u) => u.map((x, j) => (j === i ? { ...x, progress: p } : x))));
          done[i] = { url: a.url, publicId: a.publicId, width: a.width, height: a.height, originalFilename: f.name, format: a.format, ...(album ? { album } : {}) } as Partial<GalleryPhoto> & { originalFilename: string };
        } catch (e) {
          setUploads((u) => u.map((x, j) => (j === i ? { ...x, error: errorMessage(e) } : x)));
        }
      }
    };
    await Promise.all([worker(), worker()]);
    const ok = done.filter(Boolean);
    if (ok.length) {
      try {
        await api.post("gallery/bulk", { photos: ok, position: "start" });
        toast.ok(`${ok.length} photo${ok.length === 1 ? "" : "s"} added to the gallery.`);
        refresh();
      } catch (e) {
        toast.bad(errorMessage(e));
      }
    }
    setUploads((u) => u.filter((x) => x.error));
  };

  const saveOrder = useMutation({
    mutationFn: (ids: string[]) => api.patch("gallery/reorder", { ids }),
    onSuccess: () => {
      toast.ok("New order saved.");
      setArrange(null);
      refresh();
    },
    onError: (e) => toast.bad(errorMessage(e)),
  });

  const toggleSel = (id: string) => setSelected((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id);
    else n.add(id);
    return n;
  });

  const editingIndex = editing ? photos.findIndex((p) => p._id === editing) : -1;
  const stats = active.data?.stats;

  return (
    <div className="adm-page">
      <PageHeader
        title="Photo library"
        description={
          <>
            All your photos, stored on Cloudinary. New uploads also appear in your main gallery. Choose which photos each gallery shows, and their order, in{" "}
            <Link href="/me/galleries">Galleries</Link>. Hiding a photo here hides it in every gallery.
          </>
        }
        where={stats ? `${stats.visible} visible · ${stats.hidden} hidden · ${stats.trashed} in trash` : undefined}
        actions={
          <a className="adm-btn" href={GALLERY_PATH} target="_blank" rel="noopener noreferrer">
            Open gallery <ArrowUpRight />
          </a>
        }
      />

      {!arrange && view !== "trash" && (
        <div className="adm-stack" style={{ marginBottom: "1.25rem" }}>
          <DropZone kind="gallery" multiple label="Drop photos here or choose files" hint="JPG, PNG, WebP or HEIC up to 20 MB each. New photos appear first." onFiles={onFiles} disabled={uploads.some((u) => !u.error && u.progress < 1)} />
          {uploads.length > 0 && (
            <div className="adm-uploads" aria-live="polite">
              {uploads.map((u, i) => (
                <div key={i} className="adm-row" style={{ flexWrap: "nowrap" }}>
                  <span className="adm-small" style={{ width: "12rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.name}
                  </span>
                  {u.error ? <span className="adm-error">{u.error}</span> : <div style={{ flex: 1 }}><Progress value={u.progress} /></div>}
                </div>
              ))}
              {uploads.every((u) => u.error) && (
                <Button size="sm" variant="quiet" onClick={() => setUploads([])}>
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <div className="adm-row" style={{ marginBottom: "1rem" }}>
        <Segmented
          label="Show"
          value={view}
          onChange={(v) => {
            setArrange(null);
            setView(v);
          }}
          options={[
            { value: "all", label: "All" },
            { value: "visible", label: "Visible" },
            { value: "hidden", label: "Hidden" },
            { value: "trash", label: "Trash" },
          ]}
        />
        {view !== "trash" && (active.data?.albums.length ?? 0) > 0 && (
          <select className="adm-select" style={{ width: "auto" }} aria-label="Album" value={album} onChange={(e) => setAlbum(e.target.value)}>
            <option value="">All albums</option>
            {active.data!.albums.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        )}
        <span className="adm-spacer" />
        {view !== "trash" && !arrange && (
          <Button icon={<GripVertical />} onClick={() => setArrange([...(active.data?.photos || [])])} disabled={!active.data?.photos.length}>
            Change order
          </Button>
        )}
      </div>

      {selected.size > 0 && !arrange && (
        <div className="adm-bulkbar" role="toolbar" aria-label="Selected photos">
          <b>{selected.size} selected</b>
          <span className="adm-spacer" />
          {view === "trash" ? null : (
            <>
              <Button size="sm" icon={<Eye />} onClick={() => bulk.mutate({ isVisible: true })}>
                Show
              </Button>
              <Button size="sm" icon={<EyeOff />} onClick={() => bulk.mutate({ isVisible: false })}>
                Hide
              </Button>
              <select className="adm-select" aria-label="Set frame" defaultValue="" onChange={(e) => e.target.value && bulk.mutate({ frameStyle: e.target.value as FrameStyle })}>
                <option value="">Frame…</option>
                {FRAMES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              <AlbumSetter albums={active.data?.albums || []} onApply={(name) => bulk.mutate({ album: name })} />
              <Button
                size="sm"
                icon={<Trash2 />}
                onClick={async () => {
                  if (!(await confirm({ title: `Move ${selected.size} photo(s) to trash?`, body: "They disappear from the public gallery. You can restore them from Trash.", confirmLabel: "Move to trash", danger: true }))) return;
                  await Promise.all([...selected].map((id) => api.del(`gallery/${id}`)));
                  toast.ok("Moved to trash.");
                  setSelected(new Set());
                  refresh();
                }}
              >
                Trash
              </Button>
            </>
          )}
          <Button size="sm" iconOnly icon={<X />} onClick={() => setSelected(new Set())}>
            Clear selection
          </Button>
        </div>
      )}

      {(active.isLoading || (view === "trash" && trash.isLoading)) && <LoadingBlock />}
      {active.error && <ErrorBlock error={active.error} onRetry={() => active.refetch()} />}

      {arrange ? (
        <ArrangeGrid items={arrange} onChange={setArrange} onCancel={() => setArrange(null)} onSave={() => saveOrder.mutate(arrange.map((p) => p._id))} saving={saveOrder.isPending} />
      ) : (
        <>
          {active.data && photos.length === 0 && (
            <Empty title={view === "trash" ? "Trash is empty" : "No photos here"}>
              {view === "trash" ? "Photos you delete stay here until you remove them for good." : "Drop photos above to start your gallery."}
            </Empty>
          )}
          {view === "trash" && photos.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <Note>Photos in trash are hidden from everyone. Deleting permanently also removes the file from Cloudinary.</Note>
            </div>
          )}
          <div className="adm-photos">
            {photos.map((p) => (
              <figure key={p._id} className="adm-photo" data-hidden={!p.isVisible} data-selected={selected.has(p._id)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(p.url)} alt={p.caption || "Gallery photo"} loading="lazy" />
                <input type="checkbox" className="adm-photo__check" aria-label={`Select ${p.caption || "photo"}`} checked={selected.has(p._id)} onChange={() => toggleSel(p._id)} />
                <button type="button" className="adm-photo__open" onClick={() => setEditing(p._id)} aria-label={`Edit ${p.caption || "photo"}`} />
                <figcaption className="adm-photo__meta">
                  <span>{p.caption || "No caption"}</span>
                  {!p.isVisible && <EyeOff size={13} aria-label="Hidden" />}
                  {p.isFavorite && <Heart size={13} fill="currentColor" aria-label="Favourite" />}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}

      {editing && editingIndex > -1 && (
        <PhotoEditor
          key={editing}
          photo={photos[editingIndex]}
          albums={active.data?.albums || []}
          inTrash={view === "trash"}
          onClose={() => setEditing(null)}
          onPrev={editingIndex > 0 ? () => setEditing(photos[editingIndex - 1]._id) : undefined}
          onNext={editingIndex < photos.length - 1 ? () => setEditing(photos[editingIndex + 1]._id) : undefined}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

function AlbumSetter({ albums, onApply }: { albums: string[]; onApply: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <form
      className="adm-row"
      style={{ gap: 4 }}
      onSubmit={(e) => {
        e.preventDefault();
        onApply(name.trim());
        setName("");
      }}
    >
      <input className="adm-select" list="bulk-albums" placeholder="Album name" aria-label="Album name (empty removes the album)" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "9rem" }} />
      <datalist id="bulk-albums">
        {albums.map((a) => (
          <option key={a} value={a} />
        ))}
      </datalist>
      <Button size="sm" type="submit">
        Set album
      </Button>
    </form>
  );
}

function ArrangeGrid({ items, onChange, onSave, onCancel, saving }: { items: GalleryPhoto[]; onChange: (p: GalleryPhoto[]) => void; onSave: () => void; onCancel: () => void; saving: boolean }) {
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const copy = [...items];
    const [x] = copy.splice(from, 1);
    copy.splice(to, 0, x);
    onChange(copy);
  };
  return (
    <>
      <div className="adm-bulkbar">
        <b>Drag photos to reorder</b>
        <span className="adm-small" style={{ opacity: 0.75 }}>
          or use the arrows. The first photo appears first in the gallery.
        </span>
        <span className="adm-spacer" />
        <Button size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" variant="primary" loading={saving} onClick={onSave}>
          Save order
        </Button>
      </div>
      <ol className="adm-photos">
        {items.map((p, i) => (
          <li
            key={p._id}
            className="adm-photo"
            draggable
            data-dragging={drag === i}
            data-over={over === i && drag !== i}
            data-hidden={!p.isVisible}
            onDragStart={() => setDrag(i)}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(i);
            }}
            onDragEnd={() => {
              setDrag(null);
              setOver(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (drag !== null) move(drag, i);
              setDrag(null);
              setOver(null);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb(p.url, 240)} alt="" draggable={false} />
            <div className="adm-photo__meta" style={{ pointerEvents: "auto", justifyContent: "space-between" }}>
              <b>{i + 1}</b>
              <span />
              <button type="button" className="adm-btn adm-btn--sm adm-btn--icon" style={{ minHeight: 26, width: 26 }} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`}>
                <ChevronLeft />
              </button>
              <button type="button" className="adm-btn adm-btn--sm adm-btn--icon" style={{ minHeight: 26, width: 26 }} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move photo ${i + 1} later`}>
                <ChevronRight />
              </button>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function PhotoEditor({
  photo,
  albums,
  inTrash,
  onClose,
  onPrev,
  onNext,
  onChanged,
}: {
  photo: GalleryPhoto;
  albums: string[];
  inTrash: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onChanged: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const [d, setD] = useState(photo);
  const [busy, setBusy] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  const dirty = JSON.stringify(d) !== JSON.stringify(photo);

  const run = async (label: string, fn: () => Promise<unknown>, done: string, close = false) => {
    setBusy(label);
    try {
      await fn();
      toast.ok(done);
      onChanged();
      if (close) onClose();
    } catch (e) {
      toast.bad(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const save = () =>
    run(
      "save",
      () => api.patch(`gallery/${photo._id}`, { caption: d.caption, date: d.date, location: d.location, album: d.album, frameStyle: d.frameStyle, isVisible: d.isVisible, isFavorite: d.isFavorite }),
      "Photo details saved."
    );

  const replace = async (file: File) => {
    setProgress(0);
    try {
      const a = await uploadFile(file, "gallery", setProgress);
      await api.patch(`gallery/${photo._id}`, { url: a.url, publicId: a.publicId, width: a.width, height: a.height });
      setD((x) => ({ ...x, url: a.url, width: a.width || x.width, height: a.height || x.height }));
      toast.ok("Photo replaced. Caption and details were kept.");
      onChanged();
    } catch (e) {
      toast.bad(errorMessage(e));
    } finally {
      setProgress(null);
    }
  };

  return (
    <dialog ref={ref} className="adm-dialog adm-dialog--wide" onClose={onClose} aria-label="Edit photo">
      <div className="adm-dialog__body">
        <div className="adm-row" style={{ marginBottom: "1rem" }}>
          <h2 className="adm-dialog__title" style={{ margin: 0 }}>
            {inTrash ? "Photo in trash" : "Edit photo"}
          </h2>
          <span className="adm-spacer" />
          <Button size="sm" variant="quiet" iconOnly icon={<ChevronLeft />} disabled={!onPrev || dirty} onClick={onPrev}>
            Previous photo
          </Button>
          <Button size="sm" variant="quiet" iconOnly icon={<ChevronRight />} disabled={!onNext || dirty} onClick={onNext}>
            Next photo
          </Button>
          <Button size="sm" variant="quiet" iconOnly icon={<X />} onClick={() => ref.current?.close()}>
            Close
          </Button>
        </div>
        <div className="adm-photo-edit">
          <div>
            <div className="adm-photo-edit__img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={d.url.replace("/upload/", "/upload/w_1000,q_auto,f_auto/")} alt={d.caption || ""} />
            </div>
            {progress !== null && (
              <div style={{ marginTop: 8 }}>
                <Progress value={progress} />
              </div>
            )}
            <p className="adm-hint" style={{ marginTop: 6 }}>
              {d.width} × {d.height}px · {d.aspectRatio}
            </p>
          </div>
          {inTrash ? (
            <div className="adm-stack">
              <p className="adm-muted">This photo is hidden from everyone. Restore it, or delete it for good.</p>
              <Button icon={<RotateCcw />} loading={busy === "restore"} onClick={() => run("restore", () => api.post(`gallery/${photo._id}/restore`), "Photo restored to the gallery.", true)}>
                Restore
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 />}
                loading={busy === "perm"}
                onClick={async () => {
                  if (!(await confirm({ title: "Delete permanently?", body: "The file is removed from Cloudinary. This can't be undone.", confirmLabel: "Delete forever", danger: true }))) return;
                  run("perm", () => api.del(`gallery/${photo._id}/permanent`), "Photo deleted permanently.", true);
                }}
              >
                Delete permanently
              </Button>
            </div>
          ) : (
            <div className="adm-stack">
              <TextField label="Caption" value={d.caption} onChange={(caption) => setD({ ...d, caption })} maxLength={500} />
              <div className="adm-grid adm-grid--2">
                <TextField label="Date" placeholder="13 March 2024" hint="Written however you like." value={d.date} onChange={(date) => setD({ ...d, date })} optional />
                <TextField label="Place" value={d.location} onChange={(location) => setD({ ...d, location })} optional />
              </div>
              <div className="adm-grid adm-grid--2">
                <SelectField label="Frame" value={d.frameStyle} onChange={(frameStyle) => setD({ ...d, frameStyle })} options={FRAMES} />
                <div className="adm-field">
                  <label className="adm-label" htmlFor="album">
                    Album <span className="adm-label__opt">optional</span>
                  </label>
                  <input id="album" className="adm-input" list="albums" value={d.album} onChange={(e) => setD({ ...d, album: e.target.value })} />
                  <datalist id="albums">
                    {albums.map((a) => (
                      <option key={a} value={a} />
                    ))}
                  </datalist>
                </div>
              </div>
              <Toggle label="Visible in the gallery" checked={d.isVisible} onChange={(isVisible) => setD({ ...d, isVisible })} />
              <Toggle label="Favourite" hint="Favourites get a little heart in the gallery." checked={d.isFavorite} onChange={(isFavorite) => setD({ ...d, isFavorite })} />
              <div className="adm-row">
                <Button variant="primary" disabled={!dirty} loading={busy === "save"} onClick={save}>
                  Save details
                </Button>
                <Button icon={<RefreshCw />} loading={progress !== null} onClick={() => fileRef.current?.click()}>
                  Replace photo
                </Button>
                <span className="adm-spacer" />
                <Button
                  variant="danger"
                  icon={<Trash2 />}
                  loading={busy === "trash"}
                  onClick={async () => {
                    if (!(await confirm({ title: "Move this photo to trash?", body: "It disappears from the gallery. You can restore it from Trash.", confirmLabel: "Move to trash", danger: true }))) return;
                    run("trash", () => api.del(`gallery/${photo._id}`), "Moved to trash.", true);
                  }}
                >
                  Trash
                </Button>
              </div>
              <input
                ref={fileRef}
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) replace(f);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
