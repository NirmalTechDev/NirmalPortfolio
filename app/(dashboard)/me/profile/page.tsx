"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ErrorBlock, LoadingBlock, Note, ObjectList, PageHeader, SaveBar, Section, StringList, TextArea, TextField, timeAgo, useDraft, useToast } from "@/features/admin/ui";
import { ImageField } from "@/features/admin/media";
import { pickSections, useSaveSiteContent, useSiteContent } from "@/features/admin/site-content";
import { errorMessage } from "@/features/admin/api";
import type { SiteContent } from "@/lib/content/types";

type Tab = "identity" | "home" | "about" | "pages";
const TABS: { id: Tab; label: string }[] = [
  { id: "identity", label: "You & photo" },
  { id: "home", label: "Home page" },
  { id: "about", label: "About page" },
  { id: "pages", label: "Other pages" },
];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isLink = (v: string) => /^(https?:\/\/|mailto:|\/)/i.test(v);

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useSiteContent();
  const save = useSaveSiteContent();
  const toast = useToast();
  const { draft, setDraft, dirty, reset } = useDraft<SiteContent>(data?.content);
  const [tab, setTab] = useState<Tab>("identity");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!draft) return e;
    if (!draft.identity.firstName.trim()) e.firstName = "Enter your first name.";
    if (draft.identity.email && !isEmail(draft.identity.email)) e.email = "Enter a valid email address.";
    draft.identity.socials.forEach((s, i) => {
      if (s.href && !isLink(s.href)) e[`social${i}`] = "Links must start with https://";
    });
    return e;
  }, [draft]);

  const set = <K extends keyof SiteContent>(k: K, patch: Partial<SiteContent[K]>) =>
    setDraft((d) => (d ? { ...d, [k]: Array.isArray(d[k]) ? patch : { ...(d[k] as object), ...patch } } : d));

  const onSave = async () => {
    if (!draft) return;
    if (Object.keys(errors).length) {
      toast.bad("Fix the highlighted fields before saving.");
      return;
    }
    try {
      await save.mutateAsync(pickSections(draft, ["identity", "home", "about", "workPage", "experiencePage", "contactPage"]) as Partial<SiteContent>);
      toast.ok("Saved. Your website is updated.");
    } catch (err) {
      toast.bad(errorMessage(err));
    }
  };

  return (
    <div className="adm-page adm-page--narrow">
      <PageHeader
        title="Profile & pages"
        description="Your name, photo, contact details and the text on each page of your website."
        where={
          data?.saved ? (
            <>Last saved {timeAgo(data.updatedAt)}</>
          ) : (
            <>Showing your current built-in text. Saving stores it so you can edit it from now on.</>
          )
        }
        actions={
          <a className="adm-btn" href="/" target="_blank" rel="noopener noreferrer">
            Preview site <ArrowUpRight />
          </a>
        }
      />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {draft && (
        <>
          <div className="adm-tabs" role="tablist" aria-label="Sections">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} type="button" onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "identity" && (
            <>
              <Section title="Profile photo" description="Shown on the home and about pages. A square photo works best.">
                <ImageField
                  label="Photo"
                  kind="profile"
                  removable={false}
                  value={{ src: draft.identity.photo.url, alt: draft.identity.photo.alt, width: draft.identity.photo.width, height: draft.identity.photo.height, publicId: draft.identity.photo.publicId }}
                  onChange={(v) => v && set("identity", { photo: { url: v.src, alt: v.alt, width: v.width, height: v.height, publicId: v.publicId } })}
                />
              </Section>
              <Section title="About you" description="Used in the header, footer and search results.">
                <div className="adm-grid adm-grid--2">
                  <TextField label="First name" value={draft.identity.firstName} error={errors.firstName} onChange={(v) => set("identity", { firstName: v })} />
                  <TextField label="Last name" value={draft.identity.lastName} onChange={(v) => set("identity", { lastName: v })} />
                  <TextField label="Job title" value={draft.identity.title} onChange={(v) => set("identity", { title: v })} className="adm-span-2" />
                  <TextField label="Speciality" hint="Short, e.g. “React Native”. Shown next to “Software engineer”." value={draft.identity.shortRole} onChange={(v) => set("identity", { shortRole: v })} />
                  <TextField label="Location" value={draft.identity.location} onChange={(v) => set("identity", { location: v })} />
                  <TextField label="Availability" hint="Shown in the header. Leave empty to hide it." value={draft.identity.availability} onChange={(v) => set("identity", { availability: v })} optional />
                  <TextField label="Languages" value={draft.identity.languages} onChange={(v) => set("identity", { languages: v })} optional />
                  <TextArea label="Short description" hint="One or two sentences for search engines." value={draft.identity.description} onChange={(v) => set("identity", { description: v })} className="adm-span-2" />
                </div>
              </Section>
              <Section title="Contact details">
                <div className="adm-grid adm-grid--2">
                  <TextField label="Public email" type="email" value={draft.identity.email} error={errors.email} onChange={(v) => set("identity", { email: v })} />
                  <TextField label="Phone" type="tel" value={draft.identity.phone} onChange={(v) => set("identity", { phone: v })} optional />
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <ObjectList
                    label="Profiles elsewhere"
                    hint="LinkedIn, GitHub, Upwork… shown on the about and contact pages and in the footer."
                    itemLabel="link"
                    items={draft.identity.socials}
                    onChange={(socials) => set("identity", { socials })}
                    blank={() => ({ label: "", href: "https://" })}
                    render={(s, update, i) => (
                      <div className="adm-grid adm-grid--2">
                        <TextField label="Name" value={s.label} onChange={(label) => update({ label })} />
                        <TextField label="Link" code value={s.href} error={errors[`social${i}`]} onChange={(href) => update({ href })} />
                      </div>
                    )}
                  />
                </div>
              </Section>
            </>
          )}

          {tab === "home" && (
            <>
              <Section title="Introduction" description="The first thing visitors read, under your name.">
                <div className="adm-stack">
                  <TextArea label="Opening paragraph" value={draft.home.lead} onChange={(v) => set("home", { lead: v })} />
                  <ObjectList
                    label="Quick facts"
                    hint="Short label and value pairs beside the introduction, e.g. Now · Shipped · Works in."
                    itemLabel="fact"
                    items={draft.home.specs}
                    onChange={(specs) => set("home", { specs })}
                    blank={() => ({ label: "", value: "" })}
                    render={(s, update) => (
                      <div className="adm-grid adm-grid--2">
                        <TextField label="Label" value={s.label} onChange={(label) => update({ label })} />
                        <TextField label="Text" value={s.value} onChange={(value) => update({ value })} />
                      </div>
                    )}
                  />
                </div>
              </Section>
              <Section title="Section headings" description="Projects, habits and skills are edited on their own pages.">
                <div className="adm-stack">
                  <TextField label="Selected work — heading" value={draft.home.workHeading} onChange={(v) => set("home", { workHeading: v })} />
                  <TextArea label="Selected work — intro" value={draft.home.workIntro} onChange={(v) => set("home", { workIntro: v })} optional />
                  <TextField label="How I build — heading" value={draft.home.buildHeading} onChange={(v) => set("home", { buildHeading: v })} />
                  <TextField label="Capabilities — heading" value={draft.home.capabilitiesHeading} onChange={(v) => set("home", { capabilitiesHeading: v })} />
                  <TextArea label="Capabilities — intro" value={draft.home.capabilitiesIntro} onChange={(v) => set("home", { capabilitiesIntro: v })} optional />
                  <TextField label="Contact — heading" value={draft.home.contactHeading} onChange={(v) => set("home", { contactHeading: v })} />
                  <TextArea label="Contact — line under the heading" value={draft.home.contactLead} onChange={(v) => set("home", { contactLead: v })} optional />
                </div>
              </Section>
            </>
          )}

          {tab === "about" && (
            <>
              <Section title="Story">
                <div className="adm-stack">
                  <div className="adm-grid adm-grid--2">
                    <TextField label="Heading" value={draft.about.heading} onChange={(v) => set("about", { heading: v })} />
                    <TextField label="Heading, second part" hint="Shown in italics after the heading." value={draft.about.headingEmphasis} onChange={(v) => set("about", { headingEmphasis: v })} optional />
                  </div>
                  <TextArea label="Opening paragraph" value={draft.about.lead} onChange={(v) => set("about", { lead: v })} />
                  <StringList label="More paragraphs" itemLabel="paragraph" multiline items={draft.about.paragraphs} onChange={(paragraphs) => set("about", { paragraphs })} />
                </div>
              </Section>
              <Section title="Short answers" description="Label on the left, text on the right — e.g. “Problems I enjoy”.">
                <ObjectList
                  label="Entries"
                  itemLabel="entry"
                  items={draft.about.pairs}
                  onChange={(pairs) => set("about", { pairs })}
                  blank={() => ({ label: "", body: "" })}
                  render={(p, update) => (
                    <>
                      <TextField label="Label" value={p.label} onChange={(label) => update({ label })} />
                      <TextArea label="Text" value={p.body} onChange={(body) => update({ body })} />
                    </>
                  )}
                />
              </Section>
              <Section title="Journey" description="Your timeline, in the order you want it shown.">
                <ObjectList
                  label="Milestones"
                  itemLabel="milestone"
                  items={draft.about.journey}
                  onChange={(journey) => set("about", { journey })}
                  blank={() => ({ year: "", label: "", text: "" })}
                  render={(j, update) => (
                    <>
                      <div className="adm-grid adm-grid--2">
                        <TextField label="When" placeholder="2024 or 2019 — 2021" value={j.year} onChange={(year) => update({ year })} />
                        <TextField label="Title" value={j.label} onChange={(label) => update({ label })} />
                      </div>
                      <TextArea label="What happened" value={j.text} onChange={(text) => update({ text })} />
                    </>
                  )}
                />
              </Section>
              <Section title="Education">
                <ObjectList
                  label="Schools and degrees"
                  itemLabel="qualification"
                  items={draft.about.education}
                  onChange={(education) => set("about", { education })}
                  blank={() => ({ name: "", place: "", when: "" })}
                  render={(e, update) => (
                    <div className="adm-grid adm-grid--3">
                      <TextField label="Qualification" value={e.name} onChange={(name) => update({ name })} />
                      <TextField label="Where" value={e.place} onChange={(place) => update({ place })} />
                      <TextField label="When" value={e.when} onChange={(when) => update({ when })} />
                    </div>
                  )}
                />
              </Section>
            </>
          )}

          {tab === "pages" && (
            <Section title="Page introductions" description="The paragraph under each page title.">
              <div className="adm-stack">
                <TextArea label="Work page" value={draft.workPage.intro} onChange={(v) => set("workPage", { intro: v })} />
                <TextArea label="Experience page" hint="A link to your résumé is added after this text automatically." value={draft.experiencePage.intro} onChange={(v) => set("experiencePage", { intro: v })} />
                <TextArea
                  label="Contact page"
                  value={draft.contactPage.intro}
                  placeholder="Tell me what you are building and where it hurts. I read every message and reply by email."
                  hint="Leave empty to use the default sentence shown in the box."
                  onChange={(v) => set("contactPage", { intro: v })}
                  optional
                />
              </div>
            </Section>
          )}

          {!data?.saved && (
            <div style={{ marginTop: "1.25rem" }}>
              <Note>Nothing has been saved to the database yet. Press Save once to start managing this content from the dashboard.</Note>
            </div>
          )}
        </>
      )}
      <SaveBar dirty={dirty || (!!draft && data?.saved === false)} saving={save.isPending} onSave={onSave} onDiscard={reset} label={data?.saved === false && !dirty ? "Save to start editing from the dashboard" : undefined} />
    </div>
  );
}
