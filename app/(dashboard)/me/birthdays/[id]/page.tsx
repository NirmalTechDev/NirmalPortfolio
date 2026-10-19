"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Copy, Eye, Images, Music, Pause, Play, Trash2, Upload } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { DropZone, Progress } from "@/features/admin/media";
import { uploadFile } from "@/features/admin/upload";
import { BIRTHDAY_PRESETS, type PresetKey } from "@/features/admin/birthday-themes";
import {
  Button,
  ErrorBlock,
  LoadingBlock,
  Note,
  ObjectList,
  PageHeader,
  SaveBar,
  Section,
  Segmented,
  SelectField,
  StringList,
  TextArea,
  TextField,
  Toggle,
  useConfirm,
  useDraft,
  useToast,
} from "@/features/admin/ui";
import type { BirthdayPage, BirthdayPhoto, GalleryPhoto, SectionKey } from "@/features/admin/types";

type Tab = "basics" | "look" | "words" | "photos" | "music";
const TABS: { id: Tab; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "look", label: "Look & feel" },
  { id: "words", label: "Words" },
  { id: "photos", label: "Photos" },
  { id: "music", label: "Music" },
];
const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Greeting",
  cake: "Cake & candles",
  photos: "Photos",
  timeline: "Memories timeline",
  letter: "Letter",
  reasons: "Reasons you're amazing",
  wishes: "Floating wishes",
  ending: "Final surprise",
};
const ICONS = ["sparkles", "heart", "gem", "hands", "star", "flower", "sun", "moon", "cake", "music"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));
const KEYS = ["slug", "recipientName", "nickname", "birthdayDate", "fromName", "isPublished", "theme", "effects", "sections", "welcome", "hero", "cake", "photosTitle", "photos", "timelineTitle", "timeline", "letter", "reasonsTitle", "reasons", "wishesTitle", "wishes", "ending", "music", "seoTitle"] as const;

const toPayload = (d: BirthdayPage) => {
  const out: Record<string, unknown> = {};
  for (const k of KEYS) out[k] = d[k];
  out.photos = d.photos.map((p) => ({
    ...(p._id ? { _id: p._id } : {}),
    url: p.url,
    ...(p.publicId ? { publicId: p.publicId } : {}),
    ...(p.width ? { width: p.width } : {}),
    ...(p.height ? { height: p.height } : {}),
    alt: p.alt || "",
    caption: p.caption || "",
    ...(p.galleryPhotoId ? { galleryPhotoId: String(p.galleryPhotoId) } : {}),
  }));
  out.letter = { ...d.letter, paragraphs: d.letter.paragraphs.filter((p) => p.trim()) };
  out.wishes = d.wishes.filter((w) => w.trim());
  out.reasons = d.reasons.map((r) => ({ title: r.title, body: r.body, icon: r.icon || "sparkles" }));
  return out;
};

const small = (url: string, w = 320) => (url.includes("/upload/") ? url.replace("/upload/", `/upload/c_fill,w_${w},h_${w},q_auto,f_auto/`) : url);

export default function BirthdayEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [tab, setTab] = useState<Tab>("basics");
  const query = useQuery({ queryKey: ["birthday", id], queryFn: () => api.get<BirthdayPage>(`birthdays/${id}`) });
  const { draft, setDraft, dirty, reset } = useDraft<BirthdayPage>(query.data);
  const set = (patch: Partial<BirthdayPage>) => setDraft((d) => (d ? { ...d, ...patch } : d));
  const nest = <K extends keyof BirthdayPage>(k: K, patch: Partial<BirthdayPage[K]>) => setDraft((d) => (d ? { ...d, [k]: { ...(d[k] as object), ...patch } } : d));

  const save = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.patch<BirthdayPage>(`birthdays/${id}`, payload),
    onSuccess: (p) => {
      qc.setQueryData(["birthday", id], p);
      qc.invalidateQueries({ queryKey: ["birthdays"] });
      qc.invalidateQueries({ queryKey: ["overview"] });
    },
  });
  const onSave = async () => {
    if (!draft) return;
    if (!draft.recipientName.trim()) return toast.bad("Add the name of the person this page is for.");
    try {
      await save.mutateAsync(toPayload(draft));
      toast.ok(draft.isPublished ? "Saved. The page is live with your changes." : "Saved as a draft.");
    } catch (e) {
      toast.bad(errorMessage(e));
    }
  };

  const openPreview = async () => {
    try {
      if (dirty) await onSave();
      const r = await api.post<{ token: string; slug: string }>(`birthdays/${id}/preview-token`);
      window.open(`/birthdaywish/${r.slug}?preview=${encodeURIComponent(r.token)}`, "_blank", "noopener");
    } catch (e) {
      toast.bad(errorMessage(e));
    }
  };

  if (query.isLoading) return <div className="adm-page"><LoadingBlock rows={6} /></div>;
  if (query.error) return <div className="adm-page"><ErrorBlock error={query.error} onRetry={() => query.refetch()} /></div>;
  if (!draft) return null;

  return (
    <div className="adm-page adm-page--narrow">
      <p style={{ marginBottom: "1rem" }}>
        <Link className="adm-btn adm-btn--quiet adm-btn--sm" href="/me/birthdays">
          <ArrowLeft /> All birthday pages
        </Link>
      </p>
      <PageHeader
        title={`For ${draft.recipientName || "…"}`}
        where={
          <>
            {draft.isPublished ? "Published" : "Draft"} · <span className="adm-code">/birthdaywish/{query.data?.slug}</span>
            {draft.isDefault && " · main page"}
          </>
        }
        actions={
          <>
            <Button icon={<Eye />} onClick={openPreview}>
              {draft.isPublished ? "Open page" : "Preview draft"}
            </Button>
            <Button
              icon={<Copy />}
              onClick={async () => {
                const slug = `${query.data!.slug}-copy-${Math.random().toString(36).slice(2, 6)}`;
                try {
                  const p = await api.post<BirthdayPage>(`birthdays/${id}/duplicate`, { slug });
                  qc.invalidateQueries({ queryKey: ["birthdays"] });
                  toast.ok("Copy created as a draft.");
                  router.push(`/me/birthdays/${p._id}`);
                } catch (e) {
                  toast.bad(errorMessage(e));
                }
              }}
            >
              Duplicate
            </Button>
            <Button
              variant="danger"
              icon={<Trash2 />}
              onClick={async () => {
                if (!(await confirm({ title: `Delete the page for ${draft.recipientName}?`, body: "Its address stops working. Photos that came from your gallery stay in the gallery.", confirmLabel: "Delete page", danger: true }))) return;
                try {
                  await api.del(`birthdays/${id}`);
                  qc.invalidateQueries({ queryKey: ["birthdays"] });
                  toast.ok("Birthday page deleted.");
                  router.replace("/me/birthdays");
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

      <div className="adm-tabs" role="tablist" aria-label="Page sections">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "basics" && (
        <>
          <Section title="Publishing">
            <div className="adm-stack">
              <Toggle
                label="Published"
                hint={draft.isPublished ? "Anyone with the link can open this page." : "Only you can see it, using Preview draft."}
                checked={draft.isPublished}
                onChange={(isPublished) => set({ isPublished })}
              />
              <TextField
                label="Page address"
                code
                hint="Changing it breaks links you already shared."
                value={draft.slug}
                onChange={(slug) => set({ slug: slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })}
              />
            </div>
          </Section>
          <Section title="Who it's for">
            <div className="adm-grid adm-grid--2">
              <TextField label="Name" value={draft.recipientName} onChange={(recipientName) => set({ recipientName })} />
              <TextField label="Nickname" hint="Optional, used in a few playful spots." value={draft.nickname} onChange={(nickname) => set({ nickname })} optional />
              <TextField label="Birthday" type="date" value={draft.birthdayDate} onChange={(birthdayDate) => set({ birthdayDate })} optional />
              <TextField label="From" value={draft.fromName} onChange={(fromName) => set({ fromName })} optional />
              <TextField label="Browser tab title" placeholder={`Happy Birthday, ${draft.recipientName}`} value={draft.seoTitle} onChange={(seoTitle) => set({ seoTitle })} optional className="adm-span-2" />
            </div>
          </Section>
          <Section title="Sections" description="Turn parts of the page on or off.">
            <div className="adm-grid adm-grid--2">
              {draft.sections.map((s, i) => (
                <Toggle
                  key={s.key}
                  label={SECTION_LABELS[s.key]}
                  checked={s.enabled}
                  onChange={(enabled) => set({ sections: draft.sections.map((x, j) => (j === i ? { ...x, enabled } : x)) })}
                />
              ))}
            </div>
          </Section>
        </>
      )}

      {tab === "look" && (
        <>
          <Section title="Colour palette">
            <div className="adm-swatches">
              {(Object.keys(BIRTHDAY_PRESETS) as PresetKey[]).map((k) => {
                const p = BIRTHDAY_PRESETS[k];
                return (
                  <button
                    key={k}
                    type="button"
                    className="adm-swatch"
                    aria-pressed={draft.theme.preset === k}
                    onClick={() => nest("theme", { preset: k, mode: p.mode, primary: p.primary, secondary: p.secondary, accent: p.accent, background: p.background })}
                  >
                    <span className="adm-swatch__chips" aria-hidden="true">
                      <i style={{ background: p.background }} />
                      <i style={{ background: p.primary }} />
                      <i style={{ background: p.secondary }} />
                      <i style={{ background: p.accent }} />
                    </span>
                    <span className="adm-small">{p.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="adm-grid adm-grid--2" style={{ marginTop: "1.25rem" }}>
              {(["primary", "secondary", "accent", "background"] as const).map((c) => (
                <div className="adm-field" key={c}>
                  <label className="adm-label" htmlFor={`c-${c}`}>
                    {{ primary: "Main colour", secondary: "Soft colour", accent: "Highlight", background: "Background" }[c]}
                  </label>
                  <div className="adm-color">
                    <input id={`c-${c}`} type="color" value={draft.theme[c]} onChange={(e) => nest("theme", { [c]: e.target.value, preset: "custom" })} />
                    <input className="adm-input adm-input--code" aria-label={`${c} hex`} value={draft.theme[c]} onChange={(e) => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && nest("theme", { [c]: e.target.value, preset: "custom" })} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Segmented label="Brightness" value={draft.theme.mode} onChange={(mode) => nest("theme", { mode })} options={[{ value: "dark", label: "Night" }, { value: "light", label: "Daylight" }]} />
            </div>
          </Section>
          <Section title="Style">
            <div className="adm-grid adm-grid--2">
              <SelectField
                label="Card style"
                value={draft.theme.cardStyle}
                onChange={(cardStyle) => nest("theme", { cardStyle })}
                options={[
                  { value: "glass", label: "Liquid glass" },
                  { value: "clay", label: "Soft clay" },
                  { value: "neumorphic", label: "Pillow (neumorphic)" },
                  { value: "paper", label: "Paper & stickers" },
                ]}
              />
              <SelectField
                label="Lettering"
                value={draft.theme.fontStyle}
                onChange={(fontStyle) => nest("theme", { fontStyle })}
                options={[
                  { value: "romantic", label: "Romantic script" },
                  { value: "playful", label: "Playful rounded" },
                  { value: "elegant", label: "Elegant serif" },
                ]}
              />
            </div>
          </Section>
          <Section title="Decorations" description="Animated details floating around the page. They pause automatically for visitors who prefer less motion.">
            <div className="adm-grid adm-grid--2">
              {(["flowers", "hearts", "butterflies", "sparkles", "balloons", "confetti"] as const).map((k) => (
                <Toggle key={k} label={{ flowers: "Flowers", hearts: "Hearts", butterflies: "Butterflies", sparkles: "Sparkles", balloons: "Balloons", confetti: "Confetti when candles are blown" }[k]} checked={draft.effects[k]} onChange={(v) => nest("effects", { [k]: v })} />
              ))}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <Segmented label="Amount" value={draft.effects.intensity} onChange={(intensity) => nest("effects", { intensity })} options={[{ value: "calm", label: "Calm" }, { value: "lively", label: "Lively" }, { value: "festive", label: "Festive" }]} />
            </div>
          </Section>
        </>
      )}

      {tab === "words" && (
        <>
          <Section title="Welcome screen" description="Shown first, before the page opens.">
            <div className="adm-stack">
              <TextField label="Title" value={draft.welcome.title} onChange={(title) => nest("welcome", { title })} />
              <TextArea label="Message" value={draft.welcome.message} onChange={(message) => nest("welcome", { message })} />
              <TextField label="Button" value={draft.welcome.buttonLabel} onChange={(buttonLabel) => nest("welcome", { buttonLabel })} />
            </div>
          </Section>
          <Section title="Greeting">
            <div className="adm-stack">
              <TextField label="Small line above" value={draft.hero.eyebrow} onChange={(eyebrow) => nest("hero", { eyebrow })} />
              <TextField label="Big title" hint="The name is added automatically below it." value={draft.hero.title} onChange={(title) => nest("hero", { title })} />
              <TextArea label="Message" value={draft.hero.message} onChange={(message) => nest("hero", { message })} />
            </div>
          </Section>
          <Section title="Cake & candles">
            <div className="adm-grid adm-grid--2">
              <TextField label="Title" value={draft.cake.title} onChange={(title) => nest("cake", { title })} />
              <SelectField label="Candles" value={draft.cake.candles} onChange={(candles) => nest("cake", { candles })} options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }))} />
              <TextField label="Instruction" value={draft.cake.message} onChange={(message) => nest("cake", { message })} />
              <TextField label="After blowing" value={draft.cake.celebrateMessage} onChange={(celebrateMessage) => nest("cake", { celebrateMessage })} />
            </div>
          </Section>
          <Section title="Memories timeline">
            <div className="adm-stack">
              <TextField label="Heading" value={draft.timelineTitle} onChange={(timelineTitle) => set({ timelineTitle })} />
              <ObjectList
                label="Moments"
                itemLabel="moment"
                items={draft.timeline}
                onChange={(timeline) => set({ timeline })}
                blank={() => ({ label: "", title: "", body: "" })}
                render={(t, u) => (
                  <>
                    <div className="adm-grid adm-grid--2">
                      <TextField label="When" value={t.label} onChange={(label) => u({ label })} />
                      <TextField label="Title" value={t.title} onChange={(title) => u({ title })} />
                    </div>
                    <TextArea label="Story" value={t.body} onChange={(body) => u({ body })} />
                  </>
                )}
              />
            </div>
          </Section>
          <Section title="Letter" description="Typed out letter by letter on the page.">
            <div className="adm-stack">
              <div className="adm-grid adm-grid--2">
                <TextField label="Heading" value={draft.letter.title} onChange={(title) => nest("letter", { title })} />
                <TextField label="Greeting" value={draft.letter.greeting} onChange={(greeting) => nest("letter", { greeting })} />
              </div>
              <StringList label="Paragraphs" itemLabel="paragraph" multiline items={draft.letter.paragraphs} onChange={(paragraphs) => nest("letter", { paragraphs })} />
              <div className="adm-grid adm-grid--2">
                <TextField label="Sign-off" value={draft.letter.signoff} onChange={(signoff) => nest("letter", { signoff })} />
                <TextField label="Signature" value={draft.letter.signature} onChange={(signature) => nest("letter", { signature })} />
              </div>
            </div>
          </Section>
          <Section title="Reasons you're amazing">
            <div className="adm-stack">
              <TextField label="Heading" value={draft.reasonsTitle} onChange={(reasonsTitle) => set({ reasonsTitle })} />
              <ObjectList
                label="Reasons"
                itemLabel="reason"
                items={draft.reasons}
                onChange={(reasons) => set({ reasons })}
                blank={() => ({ title: "", body: "", icon: "heart" })}
                render={(r, u) => (
                  <>
                    <div className="adm-grid adm-grid--2">
                      <TextField label="Title" value={r.title} onChange={(title) => u({ title })} />
                      <SelectField label="Icon" value={r.icon || "sparkles"} onChange={(icon) => u({ icon })} options={ICONS} />
                    </div>
                    <TextArea label="Text" value={r.body} onChange={(body) => u({ body })} />
                  </>
                )}
              />
            </div>
          </Section>
          <Section title="Floating wishes">
            <div className="adm-stack">
              <TextField label="Heading" value={draft.wishesTitle} onChange={(wishesTitle) => set({ wishesTitle })} />
              <StringList label="Wishes" itemLabel="wish" items={draft.wishes} onChange={(wishes) => set({ wishes })} />
            </div>
          </Section>
          <Section title="Final surprise">
            <div className="adm-grid adm-grid--2">
              <TextField label="Heading" value={draft.ending.title} onChange={(title) => nest("ending", { title })} />
              <TextField label="Button" value={draft.ending.buttonLabel} onChange={(buttonLabel) => nest("ending", { buttonLabel })} />
              <TextArea label="Message" value={draft.ending.message} onChange={(message) => nest("ending", { message })} className="adm-span-2" />
              <TextField label="Revealed message" value={draft.ending.surpriseMessage} onChange={(surpriseMessage) => nest("ending", { surpriseMessage })} className="adm-span-2" />
            </div>
          </Section>
        </>
      )}

      {tab === "photos" && <PhotosTab draft={draft} set={set} />}
      {tab === "music" && <MusicTab draft={draft} nest={nest} />}

      <SaveBar dirty={dirty} saving={save.isPending} onSave={onSave} onDiscard={reset} />
    </div>
  );
}

function PhotosTab({ draft, set }: { draft: BirthdayPage; set: (p: Partial<BirthdayPage>) => void }) {
  const toast = useToast();
  const [progress, setProgress] = useState<number | null>(null);
  const picker = useRef<HTMLDialogElement>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const gallery = useQuery({ queryKey: ["gallery", "active"], queryFn: () => api.get<{ photos: GalleryPhoto[] }>("gallery/admin"), enabled: false });

  const upload = async (files: File[]) => {
    const added: BirthdayPhoto[] = [];
    for (let i = 0; i < files.length; i += 1) {
      try {
        const a = await uploadFile(files[i], "birthday", (p) => setProgress((i + p) / files.length));
        added.push({ url: a.url, publicId: a.publicId, width: a.width, height: a.height, alt: "", caption: "" });
      } catch (e) {
        toast.bad(`${files[i].name}: ${errorMessage(e)}`);
      }
    }
    setProgress(null);
    if (added.length) {
      set({ photos: [...draft.photos, ...added] });
      toast.info("Photos added. Save to keep them.");
    }
  };

  const usedGalleryIds = useMemo(() => new Set(draft.photos.map((p) => p.galleryPhotoId).filter(Boolean) as string[]), [draft.photos]);

  return (
    <>
      <Section title="Photos" description="Shown as an interactive photo stack. Upload new photos, or pick ones from your gallery.">
        <div className="adm-stack">
          <TextField label="Heading" value={draft.photosTitle} onChange={(photosTitle) => set({ photosTitle })} />
          <div className="adm-grid adm-grid--2">
            <DropZone kind="birthday" multiple label="Upload photos" hint="Only used on this page" onFiles={upload} disabled={progress !== null} />
            <button
              type="button"
              className="adm-drop"
              onClick={() => {
                setPicked(new Set());
                gallery.refetch();
                picker.current?.showModal();
              }}
            >
              <Images aria-hidden="true" />
              <b>Choose from gallery</b>
              <span className="adm-small adm-muted">Reuse photos you already uploaded</span>
            </button>
          </div>
          {progress !== null && <Progress value={progress} />}
          <ObjectList
            label="On this page"
            itemLabel="photo"
            items={draft.photos}
            onChange={(photos) => set({ photos })}
            blank={(): BirthdayPhoto => ({ url: "", alt: "", caption: "" })}
            hideAdd
            render={(p, u) => (
              <div className="adm-row" style={{ alignItems: "flex-start", flexWrap: "nowrap" }}>
                <div className="adm-thumb" style={{ width: 84, height: 84, flex: "none" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.url && <img src={small(p.url, 200)} alt="" />}
                </div>
                <div className="adm-stack" style={{ flex: 1, gap: 6 }}>
                  <input className="adm-input" aria-label="Caption" placeholder="Caption, e.g. Golden light" value={p.caption} onChange={(e) => u({ caption: e.target.value })} />
                  <input className="adm-input" aria-label="Description for screen readers" placeholder="Describe the photo (for screen readers)" value={p.alt} onChange={(e) => u({ alt: e.target.value })} />
                  {p.galleryPhotoId && <span className="adm-badge adm-badge--info" style={{ justifySelf: "start" }}>From gallery</span>}
                </div>
              </div>
            )}
          />
        </div>
      </Section>

      <dialog ref={picker} className="adm-dialog adm-dialog--wide" aria-label="Choose gallery photos">
        <div className="adm-dialog__body">
          <h2 className="adm-dialog__title">Choose from your gallery</h2>
          <p className="adm-muted adm-small" style={{ marginBottom: "1rem" }}>
            Selected photos are linked, not copied — editing them in the gallery keeps this page up to date.
          </p>
          {gallery.isFetching && <LoadingBlock rows={2} />}
          {gallery.data && (
            <div className="adm-pick">
              {gallery.data.photos.map((g) => {
                const already = usedGalleryIds.has(g._id);
                return (
                  <button
                    key={g._id}
                    type="button"
                    aria-pressed={picked.has(g._id)}
                    disabled={already}
                    title={already ? "Already on this page" : g.caption}
                    style={already ? { opacity: 0.35 } : undefined}
                    onClick={() =>
                      setPicked((s) => {
                        const n = new Set(s);
                        if (n.has(g._id)) n.delete(g._id);
                        else n.add(g._id);
                        return n;
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={small(g.url, 220)} alt={g.caption || "Gallery photo"} loading="lazy" />
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
              const chosen = (gallery.data?.photos || []).filter((g) => picked.has(g._id));
              set({ photos: [...draft.photos, ...chosen.map((g) => ({ url: g.url, publicId: g.publicId, width: g.width, height: g.height, alt: g.caption || "", caption: g.caption || "", galleryPhotoId: g._id }))] });
              picker.current?.close();
              toast.info(`${chosen.length} photo${chosen.length === 1 ? "" : "s"} added. Save to keep them.`);
            }}
          >
            Add {picked.size || ""} photo{picked.size === 1 ? "" : "s"}
          </Button>
        </div>
      </dialog>
    </>
  );
}

function MusicTab({ draft, nest }: { draft: BirthdayPage; nest: <K extends keyof BirthdayPage>(k: K, patch: Partial<BirthdayPage[K]>) => void }) {
  const toast = useToast();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (audio.current) audio.current.volume = draft.music.volume;
  }, [draft.music.volume]);

  const upload = async (file: File) => {
    setProgress(0);
    try {
      const a = await uploadFile(file, "music", setProgress);
      nest("music", { url: a.url, publicId: a.publicId, title: draft.music.title || file.name.replace(/\.[^.]+$/, "") });
      toast.info("Song uploaded. Save to use it on the page.");
    } catch (e) {
      toast.bad(errorMessage(e));
    } finally {
      setProgress(null);
    }
  };

  return (
    <Section title="Background music" description="Visitors see a small player and choose when to start it — music never plays by surprise.">
      <div className="adm-stack">
        {draft.music.url ? (
          <div className="adm-card" style={{ padding: "1rem" }}>
            <div className="adm-row">
              <Button
                variant="primary"
                iconOnly
                icon={playing ? <Pause /> : <Play />}
                onClick={() => {
                  if (!audio.current) return;
                  if (playing) audio.current.pause();
                  else audio.current.play().catch(() => toast.bad("This file can't be played in the browser."));
                }}
              >
                {playing ? "Pause" : "Play"}
              </Button>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{draft.music.title || "Untitled song"}</p>
                <p className="adm-small adm-muted">{draft.music.artist || "Unknown artist"}</p>
              </div>
              <Button size="sm" icon={<Upload />} onClick={() => input.current?.click()} loading={progress !== null}>
                Replace
              </Button>
              <Button size="sm" variant="quiet" iconOnly icon={<Trash2 />} onClick={() => nest("music", { url: "", publicId: "", title: "", artist: "" })}>
                Remove music
              </Button>
            </div>
            <audio ref={audio} src={draft.music.url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} preload="none" />
          </div>
        ) : (
          <button type="button" className="adm-drop" onClick={() => input.current?.click()} disabled={progress !== null}>
            <Music aria-hidden="true" />
            <b>Upload a song</b>
            <span className="adm-small adm-muted">MP3, M4A, OGG or WAV up to 20 MB</span>
          </button>
        )}
        {progress !== null && <Progress value={progress} />}
        <input
          ref={input}
          type="file"
          hidden
          accept="audio/*,.mp3,.m4a"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) upload(f);
          }}
        />
        <div className="adm-grid adm-grid--2">
          <TextField label="Song title" value={draft.music.title} onChange={(title) => nest("music", { title })} optional />
          <TextField label="Artist" value={draft.music.artist} onChange={(artist) => nest("music", { artist })} optional />
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="vol">
            Starting volume — {Math.round(draft.music.volume * 100)}%
          </label>
          <input id="vol" type="range" min={0} max={1} step={0.05} value={draft.music.volume} onChange={(e) => nest("music", { volume: Number(e.target.value) })} />
        </div>
        <Toggle label="Repeat the song" checked={draft.music.loop} onChange={(loop) => nest("music", { loop })} />
        {!draft.music.url && <Note>Without music the player is hidden on the page.</Note>}
      </div>
    </Section>
  );
}
