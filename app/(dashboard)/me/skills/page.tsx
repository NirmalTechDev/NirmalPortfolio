"use client";

import { ErrorBlock, LoadingBlock, ObjectList, PageHeader, SaveBar, Section, TextArea, TextField, useDraft, useToast } from "@/features/admin/ui";
import { useSaveSiteContent, useSiteContent } from "@/features/admin/site-content";
import { errorMessage } from "@/features/admin/api";
import type { Capability } from "@/lib/content/types";

interface Draft {
  principles: { title: string; body: string }[];
  capabilities: Capability[];
}

export default function SkillsPage() {
  const { data, isLoading, error, refetch } = useSiteContent();
  const save = useSaveSiteContent();
  const toast = useToast();
  const source = data ? { principles: data.content.principles, capabilities: data.content.capabilities } : undefined;
  const { draft, setDraft, dirty, reset } = useDraft<Draft>(source);

  const onSave = async () => {
    if (!draft) return;
    const cleaned: Draft = {
      principles: draft.principles.filter((p) => p.title.trim() || p.body.trim()),
      capabilities: draft.capabilities
        .filter((c) => c.group.trim())
        .map((c) => ({ group: c.group, items: c.items.filter((i) => i.name.trim()).map((i) => ({ name: i.name, ...(i.note?.trim() ? { note: i.note } : {}) })) })),
    };
    try {
      await save.mutateAsync(cleaned);
      toast.ok("Saved. The home page is updated.");
    } catch (err) {
      toast.bad(errorMessage(err));
    }
  };

  return (
    <div className="adm-page adm-page--narrow">
      <PageHeader title="Skills & habits" description="The capability map and the working habits on your home page." where="Shown on: Home page" />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {draft && (
        <>
          <Section title="Capabilities" description="Grouped by where they sit in a product. Add a short note where your depth is limited — there are no scores.">
            <ObjectList
              label="Groups"
              itemLabel="group"
              addLabel="Add group"
              items={draft.capabilities}
              onChange={(capabilities) => setDraft({ ...draft, capabilities })}
              blank={(): Capability => ({ group: "", items: [{ name: "", note: "" }] })}
              render={(g, update) => (
                <>
                  <TextField label="Group name" placeholder="Mobile, Backend, Data…" value={g.group} onChange={(group) => update({ group })} />
                  <ObjectList
                    label="Skills"
                    itemLabel="skill"
                    items={g.items}
                    onChange={(items) => update({ items })}
                    blank={(): Capability["items"][number] => ({ name: "", note: "" })}
                    render={(it, upd) => (
                      <div className="adm-grid adm-grid--2">
                        <TextField label="Skill" value={it.name} onChange={(name) => upd({ name })} />
                        <TextField label="Note" placeholder="e.g. working, basic" value={it.note || ""} onChange={(note) => upd({ note })} optional />
                      </div>
                    )}
                  />
                </>
              )}
            />
          </Section>
          <Section title="How I build" description="Your working habits, shown as a numbered list.">
            <ObjectList
              label="Habits"
              itemLabel="habit"
              items={draft.principles}
              onChange={(principles) => setDraft({ ...draft, principles })}
              blank={() => ({ title: "", body: "" })}
              render={(p, update) => (
                <>
                  <TextField label="Title" value={p.title} onChange={(title) => update({ title })} />
                  <TextArea label="Explanation" value={p.body} onChange={(body) => update({ body })} />
                </>
              )}
            />
          </Section>
        </>
      )}
      <SaveBar dirty={dirty} saving={save.isPending} onSave={onSave} onDiscard={reset} />
    </div>
  );
}
