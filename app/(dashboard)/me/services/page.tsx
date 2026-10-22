"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  Button,
  ErrorBlock,
  LoadingBlock,
  Note,
  ObjectList,
  PageHeader,
  SaveBar,
  Section,
  StringList,
  TextArea,
  TextField,
  Toggle,
  useConfirm,
  useDraft,
  useToast,
} from "@/features/admin/ui";
import {
  useSaveSiteContent,
  useSiteContent,
} from "@/features/admin/site-content";
import { api, errorMessage } from "@/features/admin/api";
import { LOCATION_SLUGS, landingPath } from "@/lib/content/services";
import type { Faq, LandingPage, ServicesContent } from "@/lib/content/types";
import type { ProjectDoc } from "@/features/admin/types";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Length hint with Google's practical limits (titles ~60, descriptions ~155 characters). */
const count = (v: string | undefined, ideal: number) => {
  const n = (v || "").length;
  return n === 0
    ? `Aim for up to ${ideal} characters.`
    : n > ideal
      ? `${n} characters — Google may cut it after ~${ideal}.`
      : `${n} / ${ideal} characters`;
};

function GooglePreview({
  title,
  path,
  description,
}: {
  title: string;
  path: string;
  description: string;
}) {
  return (
    <div className="adm-serp" aria-label="How this page may look in Google">
      <p className="adm-serp__url">
        nirmalranpariya.in
        {path === "/"
          ? ""
          : ` › ${path.replace(/^\//, "").split("/").join(" › ")}`}
      </p>
      <p className="adm-serp__title">{title || "Page title"}</p>
      <p className="adm-serp__desc">
        {description ||
          "Page description shown under the title in search results."}
      </p>
    </div>
  );
}

const faqList = (label: string, items: Faq[], onChange: (v: Faq[]) => void) => (
  <ObjectList
    label={label}
    hint="Real questions clients ask. They appear on the page and can show up directly in Google results."
    itemLabel="question"
    addLabel="Add question"
    items={items}
    onChange={onChange}
    blank={(): Faq => ({ q: "", a: "" })}
    render={(f, update) => (
      <>
        <TextField
          label="Question"
          value={f.q}
          onChange={(q) => update({ q })}
          maxLength={300}
        />
        <TextArea
          label="Answer"
          value={f.a}
          onChange={(a) => update({ a })}
          maxLength={2000}
        />
      </>
    )}
  />
);

export default function ServicesEditorPage() {
  const { data, isLoading, error, refetch } = useSiteContent();
  const save = useSaveSiteContent();
  const toast = useToast();
  const confirm = useConfirm();
  const projects = useQuery({
    queryKey: ["projects-all"],
    queryFn: () => api.get<ProjectDoc[]>("portfolio/projects?all=1"),
  });
  const { draft, setDraft, dirty, reset } = useDraft<ServicesContent>(
    data?.content.services,
  );
  const [selected, setSelected] = useState<string>("__hub");

  const page = draft?.pages.find((p) => p.slug === selected) || null;
  const pageIndex = draft
    ? draft.pages.findIndex((p) => p.slug === selected)
    : -1;

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!draft) return e;
    const seen = new Set<string>();
    draft.pages.forEach((p) => {
      if (!SLUG_RE.test(p.slug))
        e[p.slug || "_"] =
          `"${p.navLabel || "A page"}" needs a web address with lowercase letters, numbers and dashes.`;
      else if (seen.has(p.slug))
        e[p.slug] = `Two pages use the address "${p.slug}".`;
      if (!p.heading.trim() || !p.navLabel.trim())
        e[`${p.slug}-h`] = `"${p.slug}" needs a menu name and a heading.`;
      seen.add(p.slug);
    });
    return e;
  }, [draft]);

  const set = (patch: Partial<ServicesContent>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));
  const setPage = (patch: Partial<LandingPage>) =>
    setDraft((d) => {
      if (!d || pageIndex < 0) return d;
      const pages = d.pages.slice();
      pages[pageIndex] = { ...pages[pageIndex], ...patch };
      return { ...d, pages };
    });

  const addPage = () => {
    if (!draft) return;
    let slug = "new-service";
    for (let i = 2; draft.pages.some((p) => p.slug === slug); i += 1)
      slug = `new-service-${i}`;
    const blank: LandingPage = {
      slug,
      kind: "service",
      navLabel: "New service",
      heading: "New service",
      metaTitle: "",
      metaDescription: "",
      summary: "",
      intro: "",
      includes: [],
      sections: [],
      faqs: [],
      projects: [],
      isVisible: false,
    };
    setDraft({ ...draft, pages: [...draft.pages, blank] });
    setSelected(slug);
  };

  const removePage = async () => {
    if (!draft || !page) return;
    const ok = await confirm({
      title: `Delete "${page.navLabel}"?`,
      body: "The page disappears from your website after you save. If you only want to hide it, turn off “Show on my website” instead.",
      confirmLabel: "Delete page",
      danger: true,
    });
    if (!ok) return;
    setDraft({
      ...draft,
      pages: draft.pages.filter((p) => p.slug !== page.slug),
    });
    setSelected("__hub");
  };

  const onSave = async () => {
    if (!draft) return;
    const problems = Object.values(errors);
    if (problems.length) {
      toast.bad(problems[0]);
      return;
    }
    const clean: ServicesContent = {
      ...draft,
      engagement: draft.engagement.filter(
        (e) => e.label.trim() && e.value.trim(),
      ),
      process: draft.process.filter((p) => p.title.trim()),
      faqs: draft.faqs.filter((f) => f.q.trim() && f.a.trim()),
      pages: draft.pages.map((p) => ({
        ...p,
        includes: p.includes.filter((i) => i.trim()),
        sections: p.sections.filter((s) => s.heading.trim() && s.body.trim()),
        faqs: p.faqs.filter((f) => f.q.trim() && f.a.trim()),
        isVisible: p.isVisible !== false,
      })),
    };
    try {
      await save.mutateAsync({ services: clean });
      toast.ok("Saved. Your services pages are updated.");
    } catch (err) {
      toast.bad(errorMessage(err));
    }
  };

  const isLocation =
    !!page && (LOCATION_SLUGS as readonly string[]).includes(page.slug);
  const projectOptions = projects.data || [];

  return (
    <div className="adm-page">
      <PageHeader
        title="Services & SEO"
        description="The pages clients find on Google: what you offer, where you work, and the questions they ask. Each page targets one group of searches."
        where="Shown on: /services, each service page, the Surat and India pages, the home page and the footer"
        actions={
          <a
            className="adm-btn"
            href={page ? landingPath(page) : "/services"}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview <ArrowUpRight />
          </a>
        }
      />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {draft && (
        <div className="adm-split">
          <nav className="adm-split__list" aria-label="Pages">
            <button
              type="button"
              className="adm-pick"
              aria-current={selected === "__hub"}
              onClick={() => setSelected("__hub")}
            >
              <Wrench size={16} />
              <span>
                <b>Services overview</b>
                <small>/services</small>
              </span>
            </button>
            {draft.pages.map((p) => (
              <button
                key={p.slug + p.kind}
                type="button"
                className="adm-pick"
                aria-current={selected === p.slug}
                onClick={() => setSelected(p.slug)}
              >
                {p.kind === "location" ? (
                  <MapPin size={16} />
                ) : (
                  <Wrench size={16} />
                )}
                <span>
                  <b>{p.navLabel || "Untitled"}</b>
                  <small>{landingPath(p)}</small>
                </span>
                {p.isVisible === false && (
                  <EyeOff size={14} aria-label="Hidden" />
                )}
              </button>
            ))}
            <Button size="sm" icon={<Plus />} onClick={addPage}>
              Add service page
            </Button>
          </nav>

          <div className="adm-split__main adm-stack">
            {selected === "__hub" && (
              <>
                <Section
                  title="Overview page"
                  description="The main “Hire a React Native developer” page at /services."
                >
                  <div className="adm-stack">
                    <GooglePreview
                      title={draft.metaTitle}
                      path="/services"
                      description={draft.metaDescription}
                    />
                    <TextField
                      label="Google title"
                      hint={count(draft.metaTitle, 60)}
                      value={draft.metaTitle}
                      onChange={(metaTitle) => set({ metaTitle })}
                      maxLength={120}
                    />
                    <TextArea
                      label="Google description"
                      hint={count(draft.metaDescription, 155)}
                      value={draft.metaDescription}
                      onChange={(metaDescription) => set({ metaDescription })}
                      maxLength={320}
                    />
                    <TextField
                      label="Heading"
                      value={draft.heading}
                      onChange={(heading) => set({ heading })}
                      maxLength={200}
                    />
                    <TextArea
                      label="Introduction"
                      value={draft.intro}
                      onChange={(intro) => set({ intro })}
                      maxLength={3000}
                    />
                  </div>
                </Section>
                <Section title="Ways to work together">
                  <ObjectList
                    label="Options"
                    itemLabel="option"
                    addLabel="Add option"
                    items={draft.engagement}
                    onChange={(engagement) => set({ engagement })}
                    blank={() => ({ label: "", value: "" })}
                    render={(e, update) => (
                      <>
                        <TextField
                          label="Name"
                          value={e.label}
                          onChange={(label) => update({ label })}
                          maxLength={100}
                        />
                        <TextArea
                          label="Description"
                          value={e.value}
                          onChange={(value) => update({ value })}
                          maxLength={1000}
                        />
                      </>
                    )}
                  />
                </Section>
                <Section title="Process">
                  <ObjectList
                    label="Steps"
                    itemLabel="step"
                    addLabel="Add step"
                    items={draft.process}
                    onChange={(process) => set({ process })}
                    blank={() => ({ title: "", body: "" })}
                    render={(p, update) => (
                      <>
                        <TextField
                          label="Step"
                          value={p.title}
                          onChange={(title) => update({ title })}
                          maxLength={200}
                        />
                        <TextArea
                          label="Description"
                          value={p.body}
                          onChange={(body) => update({ body })}
                          maxLength={1500}
                        />
                      </>
                    )}
                  />
                </Section>
                <Section title="Questions">
                  {faqList("Questions on /services", draft.faqs, (faqs) =>
                    set({ faqs }),
                  )}
                </Section>
              </>
            )}

            {page && (
              <>
                {isLocation && (
                  <Note>
                    This page has a fixed web address ({landingPath(page)}). You
                    can change all of its text.
                  </Note>
                )}
                <Section
                  title={page.navLabel || "Page"}
                  actions={
                    !isLocation && (
                      <Button
                        size="sm"
                        variant="quiet"
                        icon={<Trash2 />}
                        onClick={removePage}
                      >
                        Delete page
                      </Button>
                    )
                  }
                >
                  <div className="adm-stack">
                    <Toggle
                      label="Show on my website"
                      hint="Hidden pages are removed from the site, the menu and Google's sitemap."
                      checked={page.isVisible !== false}
                      onChange={(v) => setPage({ isVisible: v })}
                    />
                    <GooglePreview
                      title={page.metaTitle || page.heading}
                      path={landingPath(page)}
                      description={page.metaDescription}
                    />
                    <TextField
                      label="Google title"
                      hint={count(page.metaTitle, 60)}
                      value={page.metaTitle}
                      onChange={(metaTitle) => setPage({ metaTitle })}
                      maxLength={120}
                    />
                    <TextArea
                      label="Google description"
                      hint={count(page.metaDescription, 155)}
                      value={page.metaDescription}
                      onChange={(metaDescription) =>
                        setPage({ metaDescription })
                      }
                      maxLength={320}
                    />
                    <div className="adm-grid adm-grid--2">
                      <TextField
                        label="Menu name"
                        hint="Used on cards, in the footer and in breadcrumbs."
                        value={page.navLabel}
                        onChange={(navLabel) => setPage({ navLabel })}
                        maxLength={120}
                      />
                      {isLocation ? (
                        <div className="adm-field">
                          <span className="adm-label">Web address</span>
                          <code
                            className="adm-code"
                            style={{ padding: "0.6rem 0" }}
                          >
                            nirmalranpariya.in{landingPath(page)}
                          </code>
                          <span className="adm-hint">Fixed for this page.</span>
                        </div>
                      ) : (
                        <TextField
                          label="Web address"
                          code
                          hint={`nirmalranpariya.in/services/${page.slug || "…"} — changing it breaks old links.`}
                          error={
                            !SLUG_RE.test(page.slug)
                              ? "Lowercase letters, numbers and dashes only."
                              : undefined
                          }
                          value={page.slug}
                          onChange={(v) => {
                            const slug = slugify(v);
                            setPage({ slug });
                            setSelected(slug);
                          }}
                          maxLength={80}
                        />
                      )}
                    </div>
                    <TextField
                      label="Heading (H1)"
                      hint="The main phrase people search for, e.g. “React Native bug fixing”."
                      value={page.heading}
                      onChange={(heading) => setPage({ heading })}
                      maxLength={200}
                    />
                    <TextArea
                      label="Card summary"
                      hint="One sentence shown on cards."
                      value={page.summary}
                      onChange={(summary) => setPage({ summary })}
                      maxLength={400}
                    />
                    <TextArea
                      label="Introduction"
                      hint="The first paragraph. Use the main phrase naturally once."
                      value={page.intro}
                      onChange={(intro) => setPage({ intro })}
                      maxLength={3000}
                    />
                  </div>
                </Section>
                <Section title="What's included">
                  <StringList
                    label="Points"
                    itemLabel="point"
                    addLabel="Add point"
                    items={page.includes}
                    onChange={(includes) => setPage({ includes })}
                  />
                </Section>
                <Section title="Details">
                  <ObjectList
                    label="Sections"
                    itemLabel="section"
                    addLabel="Add section"
                    items={page.sections}
                    onChange={(sections) => setPage({ sections })}
                    blank={() => ({ heading: "", body: "" })}
                    render={(sec, update) => (
                      <>
                        <TextField
                          label="Heading"
                          value={sec.heading}
                          onChange={(heading) => update({ heading })}
                          maxLength={200}
                        />
                        <TextArea
                          label="Text"
                          hint="Leave an empty line between paragraphs."
                          value={sec.body}
                          onChange={(body) => update({ body })}
                          maxLength={5000}
                        />
                      </>
                    )}
                  />
                </Section>
                <Section
                  title="Related work"
                  description="Case studies shown as proof on this page."
                >
                  {projects.isLoading && <LoadingBlock rows={2} />}
                  <div className="adm-stack" style={{ gap: "0.4rem" }}>
                    {projectOptions.map((p) => (
                      <Toggle
                        key={p._id}
                        label={p.title}
                        checked={page.projects.includes(p.slug)}
                        onChange={(on) =>
                          setPage({
                            projects: on
                              ? [...page.projects, p.slug]
                              : page.projects.filter((s) => s !== p.slug),
                          })
                        }
                      />
                    ))}
                  </div>
                </Section>
                <Section title="Questions">
                  {faqList("Questions on this page", page.faqs, (faqs) =>
                    setPage({ faqs }),
                  )}
                </Section>
                {page.isVisible === false && (
                  <Note tone="warn">
                    <Eye size={14} style={{ verticalAlign: "-2px" }} /> This
                    page is hidden. Turn on “Show on my website” when it is
                    ready.
                  </Note>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <SaveBar
        dirty={dirty}
        saving={save.isPending}
        onSave={onSave}
        onDiscard={reset}
      />
    </div>
  );
}
