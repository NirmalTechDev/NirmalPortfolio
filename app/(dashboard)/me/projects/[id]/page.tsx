"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, Plus, Trash2, X } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { DropZone, ImageField, Progress, type ImageValue } from "@/features/admin/media";
import { uploadFile } from "@/features/admin/upload";
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
  StringList,
  TextArea,
  TextField,
  Toggle,
  useConfirm,
  useDraft,
  useToast,
} from "@/features/admin/ui";
import type { ProjectDoc } from "@/features/admin/types";
import type { Img } from "@/lib/content/types";

type Draft = Omit<ProjectDoc, "_id" | "createdAt" | "updatedAt"> & { _id?: string };
type Tab = "basics" | "media" | "story" | "system" | "engineering" | "stack";
const TABS: { id: Tab; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "media", label: "Images" },
  { id: "story", label: "Story" },
  { id: "system", label: "Diagram" },
  { id: "engineering", label: "Decisions" },
  { id: "stack", label: "Stack" },
];

const empty = (): Draft => ({
  slug: "",
  number: "",
  title: "",
  kind: "",
  status: "",
  oneLiner: "",
  spec: [{ label: "My role", value: "" }],
  links: [],
  screens: [],
  screenLayout: "phones",
  phoneColumns: 4,
  context: [""],
  problem: [],
  role: { intro: "", items: [] },
  engineering: [],
  experience: [],
  challenges: [],
  outcome: [""],
  stack: [],
  reflection: [],
  isVisible: true,
  order: 0,
});

const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
const texts = (a?: string[]) => (a || []).map((s) => s.trim()).filter(Boolean);
const img = (i?: Img | null): Img | null =>
  i?.src ? { src: i.src, alt: i.alt || "", width: Math.round(i.width || 1200), height: Math.round(i.height || 800), ...(i.caption ? { caption: i.caption } : {}), ...(i.publicId ? { publicId: i.publicId } : {}) } : null;

function toPayload(d: Draft) {
  const lanes = (d.system?.lanes || []).map((l) => ({ label: l.label.trim(), steps: texts(l.steps) })).filter((l) => l.label && l.steps.length);
  return {
    title: d.title.trim(),
    slug: d.slug.trim(),
    number: d.number?.trim() || "",
    kind: d.kind?.trim() || "",
    status: d.status?.trim() || "",
    oneLiner: d.oneLiner?.trim() || "",
    seoDescription: d.seoDescription?.trim() || "",
    isVisible: d.isVisible,
    spec: (d.spec || []).filter((s) => s.label.trim() && s.value.trim()),
    links: (d.links || []).filter((l) => l.label.trim() && l.href.trim()),
    cover: img(d.cover),
    icon: img(d.icon),
    screens: (d.screens || []).map((s) => img(s)).filter(Boolean),
    screenLayout: d.screenLayout,
    phoneColumns: d.phoneColumns || 4,
    context: texts(d.context),
    problem: texts(d.problem),
    role: { intro: d.role?.intro?.trim() || "", items: texts(d.role?.items) },
    system: lanes.length ? { title: d.system?.title?.trim() || "", caption: d.system?.caption?.trim() || "", lanes } : null,
    engineering: (d.engineering || []).filter((e) => e.title.trim() || e.body.trim()),
    experience: texts(d.experience),
    challenges: (d.challenges || []).filter((e) => e.title.trim() || e.body.trim()),
    outcome: texts(d.outcome),
    stack: (d.stack || []).map((s) => ({ group: s.group.trim(), items: texts(s.items) })).filter((s) => s.group && s.items.length),
    reflection: texts(d.reflection),
  };
}

function ScreensEditor({ screens, onChange }: { screens: Img[]; onChange: (s: Img[]) => void }) {
  const [progress, setProgress] = useState<number | null>(null);
  const toast = useToast();
  const add = async (files: File[]) => {
    const added: Img[] = [];
    for (let i = 0; i < files.length; i += 1) {
      try {
        const a = await uploadFile(files[i], "project", (p) => setProgress((i + p) / files.length));
        added.push({ src: a.url, publicId: a.publicId, width: a.width || 1200, height: a.height || 800, alt: "" });
      } catch (err) {
        toast.bad(`${files[i].name}: ${errorMessage(err)}`);
      }
    }
    setProgress(null);
    if (added.length) onChange([...screens, ...added]);
  };
  return (
    <div className="adm-stack">
      <ObjectList
        label="Screens"
        hint="Shown under the cover image, in this order. Add a short description to each for screen readers."
        itemLabel="screen"
        addLabel="Add empty slot"
        items={screens}
        onChange={onChange}
        blank={() => ({ src: "", alt: "", width: 1200, height: 800 })}
        render={(s, update) => (
          <ImageField label="Image" value={s as ImageValue} kind="project" removable={false} withCaption onChange={(v) => v && update({ ...v })} />
        )}
      />
      <DropZone kind="project" multiple label="Drop several screenshots to add them at once" onFiles={add} disabled={progress !== null} />
      {progress !== null && <Progress value={progress} />}
    </div>
  );
}

export default function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [tab, setTab] = useState<Tab>("basics");
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const query = useQuery({
    queryKey: ["project", id],
    enabled: !isNew,
    queryFn: async () => {
      const all = await api.get<ProjectDoc[]>("portfolio/projects?all=1");
      const p = all.find((x) => x._id === id);
      if (!p) throw new Error("This project no longer exists.");
      return p;
    },
  });
  const source = useMemo<Draft | undefined>(() => (isNew ? empty() : query.data ? { ...empty(), ...JSON.parse(JSON.stringify(query.data)) } : undefined), [isNew, query.data]);
  const { draft, setDraft, dirty, reset } = useDraft<Draft>(source);
  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const save = useMutation({
    mutationFn: (payload: ReturnType<typeof toPayload>) =>
      isNew ? api.post<ProjectDoc>("portfolio/projects", payload) : api.patch<ProjectDoc>(`portfolio/projects/${id}`, payload),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["overview"] });
      qc.setQueryData(["project", p._id], p);
    },
  });
  const remove = useMutation({ mutationFn: () => api.del(`portfolio/projects/${id}`) });

  const problems = useMemo(() => {
    if (!draft) return [];
    const list: string[] = [];
    if (!draft.title.trim()) list.push("Add a title.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) list.push("The web address can only use lowercase letters, numbers and dashes.");
    return list;
  }, [draft]);
  const missingForSite = draft ? [!draft.oneLiner?.trim() && "one-line summary", !draft.kind?.trim() && "type"].filter(Boolean) : [];

  const onSave = async () => {
    if (!draft) return;
    if (problems.length) {
      toast.bad(problems[0]);
      setTab("basics");
      return;
    }
    try {
      const saved = await save.mutateAsync(toPayload(draft));
      toast.ok(isNew ? "Project created." : "Saved. The case study is updated.");
      if (isNew) router.replace(`/me/projects/${saved._id}`);
    } catch (err) {
      toast.bad(errorMessage(err));
    }
  };

  if (!isNew && query.isLoading) return <div className="adm-page"><LoadingBlock rows={6} /></div>;
  if (!isNew && query.error) return <div className="adm-page"><ErrorBlock error={query.error} onRetry={() => query.refetch()} /></div>;
  if (!draft) return null;

  return (
    <div className="adm-page adm-page--narrow">
      <p style={{ marginBottom: "1rem" }}>
        <Link className="adm-btn adm-btn--quiet adm-btn--sm" href="/me/projects">
          <ArrowLeft /> All projects
        </Link>
      </p>
      <PageHeader
        title={draft.title || "New project"}
        description={isNew ? "Fill in the basics first. You can add images and the full story after saving." : undefined}
        where={draft.slug ? <>Page address: <span className="adm-code">/work/{draft.slug}</span></> : undefined}
        actions={
          !isNew && (
            <>
              <a className="adm-btn" href={`/work/${query.data?.slug}`} target="_blank" rel="noopener noreferrer">
                View on site <ArrowUpRight />
              </a>
              <Button
                variant="danger"
                icon={<Trash2 />}
                onClick={async () => {
                  if (!(await confirm({ title: `Delete “${draft.title}”?`, body: "The case study disappears from your website. This can't be undone from the dashboard.", confirmLabel: "Delete project", danger: true }))) return;
                  try {
                    await remove.mutateAsync();
                    qc.invalidateQueries({ queryKey: ["projects"] });
                    toast.ok("Project deleted.");
                    router.replace("/me/projects");
                  } catch (err) {
                    toast.bad(errorMessage(err));
                  }
                }}
              >
                Delete
              </Button>
            </>
          )
        }
      />

      {missingForSite.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <Note tone="warn">This project stays off your website until it has a {missingForSite.join(" and a ")}.</Note>
        </div>
      )}

      <div className="adm-tabs" role="tablist" aria-label="Case study sections">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "basics" && (
        <>
          <Section title="Basics">
            <div className="adm-grid adm-grid--2">
              <TextField
                label="Title"
                value={draft.title}
                onChange={(title) => set({ title, ...(!slugTouched ? { slug: slugify(title) } : {}) })}
                error={!draft.title.trim() && dirty ? "Add a title." : undefined}
              />
              <TextField
                label="Web address"
                code
                hint="Changing it breaks old links to this case study."
                value={draft.slug}
                onChange={(slug) => {
                  setSlugTouched(true);
                  set({ slug: slugify(slug) });
                }}
              />
              <TextField label="Number" placeholder="01" hint="Shown before the title." value={draft.number} onChange={(number) => set({ number })} />
              <TextField label="Type" placeholder="Social trading · Mobile" value={draft.kind} onChange={(kind) => set({ kind })} />
              <TextField label="Status" placeholder="Live on Google Play and the App Store" value={draft.status} onChange={(status) => set({ status })} className="adm-span-2" />
              <TextArea label="One-line summary" value={draft.oneLiner} onChange={(oneLiner) => set({ oneLiner })} className="adm-span-2" />
              <TextArea label="Search description" hint="Optional. Used by Google; defaults to the summary." value={draft.seoDescription || ""} onChange={(seoDescription) => set({ seoDescription })} optional className="adm-span-2" />
              <div className="adm-span-2">
                <Toggle label="Show on my website" checked={draft.isVisible} onChange={(isVisible) => set({ isVisible })} />
              </div>
            </div>
          </Section>
          <Section title="Fact sheet" description="Label and value pairs at the top of the case study. “My role” is also shown on the work page.">
            <ObjectList
              label="Facts"
              itemLabel="fact"
              items={draft.spec}
              onChange={(spec) => set({ spec })}
              blank={() => ({ label: "", value: "" })}
              render={(s, update) => (
                <div className="adm-grid adm-grid--2">
                  <TextField label="Label" value={s.label} onChange={(label) => update({ label })} />
                  <TextField label="Value" value={s.value} onChange={(value) => update({ value })} />
                </div>
              )}
            />
          </Section>
          <Section title="Links" description="Store pages, live site, repository…">
            <ObjectList
              label="Links"
              itemLabel="link"
              items={draft.links}
              onChange={(links) => set({ links })}
              blank={() => ({ label: "", href: "https://" })}
              render={(l, update) => (
                <div className="adm-grid adm-grid--2">
                  <TextField label="Label" value={l.label} onChange={(label) => update({ label })} />
                  <TextField label="Address" code value={l.href} onChange={(href) => update({ href })} />
                </div>
              )}
            />
          </Section>
        </>
      )}

      {tab === "media" && (
        <>
          <Section title="Layout">
            <div className="adm-stack">
              <Segmented
                label="Screen layout"
                value={draft.screenLayout}
                onChange={(screenLayout) => set({ screenLayout })}
                options={[
                  { value: "phones", label: "Phone screens" },
                  { value: "wide", label: "Wide screenshots" },
                ]}
              />
              {draft.screenLayout === "phones" && (
                <Segmented
                  label="Phones per row"
                  value={String(draft.phoneColumns || 4) as "4" | "5"}
                  onChange={(v) => set({ phoneColumns: Number(v) as 4 | 5 })}
                  options={[
                    { value: "4", label: "4 per row" },
                    { value: "5", label: "5 per row" },
                  ]}
                />
              )}
            </div>
          </Section>
          <Section title="Cover and icon">
            <div className="adm-stack">
              <ImageField label="Cover image" hint="The main picture on the work page." value={draft.cover as ImageValue} onChange={(v) => set({ cover: (v as Img) || undefined })} wide={draft.screenLayout === "wide"} />
              <ImageField label="App icon" hint="Optional, shown beside the title." value={draft.icon as ImageValue} onChange={(v) => set({ icon: (v as Img) || undefined })} />
            </div>
          </Section>
          <Section title="Screens">
            <ScreensEditor screens={draft.screens} onChange={(screens) => set({ screens })} />
          </Section>
        </>
      )}

      {tab === "story" && (
        <>
          <Section title="Context and problem">
            <div className="adm-stack">
              <StringList label="Context" hint="What the product is. The first paragraph also appears on the work page." itemLabel="paragraph" multiline items={draft.context} onChange={(context) => set({ context })} />
              <StringList label="Problem" itemLabel="paragraph" multiline items={draft.problem} onChange={(problem) => set({ problem })} />
            </div>
          </Section>
          <Section title="Your role">
            <div className="adm-stack">
              <TextArea label="Introduction" value={draft.role.intro} onChange={(intro) => set({ role: { ...draft.role, intro } })} />
              <StringList label="What you did" itemLabel="contribution" multiline items={draft.role.items} onChange={(items) => set({ role: { ...draft.role, items } })} />
            </div>
          </Section>
          <Section title="Experience, outcome and reflection">
            <div className="adm-stack">
              <StringList label="User experience" itemLabel="paragraph" multiline items={draft.experience} onChange={(experience) => set({ experience })} />
              <StringList label="Outcome" itemLabel="paragraph" multiline items={draft.outcome} onChange={(outcome) => set({ outcome })} />
              <StringList label="Reflection" itemLabel="paragraph" multiline items={draft.reflection} onChange={(reflection) => set({ reflection })} />
            </div>
          </Section>
        </>
      )}

      {tab === "system" && (
        <Section title="Flow diagram" description="Rows of steps drawn as a diagram on the case study. Leave empty to hide the section.">
          <div className="adm-stack">
            <TextField label="Diagram title" value={draft.system?.title || ""} onChange={(title) => set({ system: { caption: "", lanes: [], ...draft.system, title } })} />
            <TextArea label="Caption" value={draft.system?.caption || ""} onChange={(caption) => set({ system: { title: "", lanes: [], ...draft.system, caption } })} />
            <ObjectList
              label="Rows"
              itemLabel="row"
              items={draft.system?.lanes || []}
              onChange={(lanes) => set({ system: { title: "", caption: "", ...draft.system, lanes } })}
              blank={() => ({ label: "", steps: ["", ""] })}
              render={(l, update) => (
                <>
                  <TextField label="Row name" value={l.label} onChange={(label) => update({ label })} />
                  <div className="adm-field">
                    <p className="adm-label">Steps, left to right</p>
                    <div className="adm-row" style={{ alignItems: "stretch" }}>
                      {l.steps.map((s, i) => (
                        <div key={i} className="adm-row" style={{ gap: 4, flexWrap: "nowrap" }}>
                          <input className="adm-input" style={{ width: "9.5rem" }} aria-label={`Step ${i + 1}`} value={s} onChange={(e) => update({ steps: l.steps.map((x, j) => (j === i ? e.target.value : x)) })} />
                          <Button size="sm" variant="quiet" iconOnly icon={<X />} onClick={() => update({ steps: l.steps.filter((_, j) => j !== i) })}>
                            {`Remove step ${i + 1}`}
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" icon={<Plus />} onClick={() => update({ steps: [...l.steps, ""] })}>
                        Step
                      </Button>
                    </div>
                  </div>
                </>
              )}
            />
            {(draft.system?.lanes?.length ?? 0) > 0 && (
              <div className="adm-card" style={{ padding: "1rem" }} aria-label="Diagram preview">
                <p className="adm-small adm-muted" style={{ marginBottom: 8 }}>
                  Preview
                </p>
                {draft.system!.lanes.map((l, i) => (
                  <p key={i} className="adm-small" style={{ marginBottom: 4 }}>
                    <b>{l.label || "Untitled row"}:</b> {l.steps.filter(Boolean).join("  →  ")}
                  </p>
                ))}
              </div>
            )}
          </div>
        </Section>
      )}

      {tab === "engineering" && (
        <>
          <Section title="Engineering decisions">
            <ObjectList
              label="Decisions"
              itemLabel="decision"
              items={draft.engineering}
              onChange={(engineering) => set({ engineering })}
              blank={() => ({ title: "", body: "" })}
              render={(e, update) => (
                <>
                  <TextField label="Title" value={e.title} onChange={(title) => update({ title })} />
                  <TextArea label="Explanation" value={e.body} onChange={(body) => update({ body })} />
                </>
              )}
            />
          </Section>
          <Section title="Challenges">
            <ObjectList
              label="Challenges"
              itemLabel="challenge"
              items={draft.challenges}
              onChange={(challenges) => set({ challenges })}
              blank={() => ({ title: "", body: "" })}
              render={(e, update) => (
                <>
                  <TextField label="Title" value={e.title} onChange={(title) => update({ title })} />
                  <TextArea label="Explanation" value={e.body} onChange={(body) => update({ body })} />
                </>
              )}
            />
          </Section>
        </>
      )}

      {tab === "stack" && (
        <Section title="Technology stack" description="Grouped. All items are also listed on the work page.">
          <ObjectList
            label="Groups"
            itemLabel="group"
            items={draft.stack}
            onChange={(stack) => set({ stack })}
            blank={() => ({ group: "", items: [""] })}
            render={(s, update) => (
              <>
                <TextField label="Group" placeholder="Mobile, Backend…" value={s.group} onChange={(group) => update({ group })} />
                <StringList label="Technologies" itemLabel="technology" items={s.items} onChange={(items) => update({ items })} />
              </>
            )}
          />
        </Section>
      )}

      <SaveBar dirty={dirty || isNew} saving={save.isPending} onSave={onSave} onDiscard={() => (isNew ? router.push("/me/projects") : reset())} label={isNew ? "New project — not saved yet" : undefined} />
    </div>
  );
}
