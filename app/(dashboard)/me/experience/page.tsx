"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { Button, Empty, ErrorBlock, LoadingBlock, ObjectList, PageHeader, Section, StringList, TextArea, TextField, Toggle, useConfirm, useToast } from "@/features/admin/ui";
import type { ExperienceDoc } from "@/features/admin/types";

type Editable = Omit<ExperienceDoc, "_id"> & { _id?: string };

const blank = (): Editable => ({
  company: "",
  position: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: null,
  current: true,
  description: "",
  technologies: [],
  location: "",
  datesLabel: "",
  responsibilities: [],
  systems: [],
  isVisible: true,
});

const FIELDS = ["company", "position", "startDate", "endDate", "current", "description", "technologies", "location", "datesLabel", "responsibilities", "systems", "isVisible", "order"] as const;
const toPayload = (e: Editable) => {
  const out: Record<string, unknown> = {};
  for (const k of FIELDS) if (e[k] !== undefined) out[k] = e[k];
  out.startDate = String(e.startDate).slice(0, 10);
  out.endDate = e.current || !e.endDate ? null : String(e.endDate).slice(0, 10);
  out.description = e.description || e.responsibilities[0] || e.position;
  return out;
};

function Editor({ initial, onDone }: { initial: Editable; onDone: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [e, setE] = useState<Editable>(() => ({ ...initial, startDate: String(initial.startDate).slice(0, 10), endDate: initial.endDate ? String(initial.endDate).slice(0, 10) : null }));
  const set = (patch: Partial<Editable>) => setE((x) => ({ ...x, ...patch }));
  const save = useMutation({
    mutationFn: () => (e._id ? api.patch(`portfolio/experience/${e._id}`, toPayload(e)) : api.post("portfolio/experience", toPayload(e))),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experience"] }),
  });
  const invalid = !e.company.trim() || !e.position.trim();

  return (
    <div className="adm-stack">
      <div className="adm-grid adm-grid--2">
        <TextField label="Company" value={e.company} onChange={(company) => set({ company })} />
        <TextField label="Role" value={e.position} onChange={(position) => set({ position })} />
        <TextField label="Started" type="date" value={e.startDate} onChange={(startDate) => set({ startDate })} />
        {!e.current && <TextField label="Ended" type="date" value={e.endDate || ""} onChange={(endDate) => set({ endDate })} />}
        <div className="adm-span-2">
          <Toggle label="I work here now" checked={!!e.current} onChange={(current) => set({ current })} />
        </div>
        <TextField label="Dates as shown on the site" hint="Leave empty to generate it, e.g. “June 2024 — Present”." value={e.datesLabel || ""} onChange={(datesLabel) => set({ datesLabel })} optional />
        <TextField label="Location" value={e.location || ""} onChange={(location) => set({ location })} optional />
      </div>
      <TextArea label="One-line summary" hint="Used if no responsibilities are listed." value={e.description} onChange={(description) => set({ description })} />
      <StringList label="Responsibilities" itemLabel="responsibility" multiline items={e.responsibilities} onChange={(responsibilities) => set({ responsibilities })} />
      <ObjectList
        label="Projects at this job"
        hint="Links to case studies, e.g. /work/opigo"
        itemLabel="project link"
        items={e.systems}
        onChange={(systems) => set({ systems })}
        blank={() => ({ name: "", href: "/work/" })}
        render={(s, update) => (
          <div className="adm-grid adm-grid--2">
            <TextField label="Name" value={s.name} onChange={(name) => update({ name })} />
            <TextField label="Link" code value={s.href} onChange={(href) => update({ href })} />
          </div>
        )}
      />
      <StringList label="Technologies" itemLabel="technology" items={e.technologies} onChange={(technologies) => set({ technologies })} />
      <div className="adm-row">
        <Button
          variant="primary"
          loading={save.isPending}
          disabled={invalid}
          onClick={async () => {
            try {
              await save.mutateAsync();
              toast.ok(e._id ? "Role updated." : "Role added to your experience page.");
              onDone();
            } catch (err) {
              toast.bad(errorMessage(err));
            }
          }}
        >
          {e._id ? "Save role" : "Add role"}
        </Button>
        <Button variant="quiet" onClick={onDone}>
          Cancel
        </Button>
        {invalid && <span className="adm-hint">Company and role are required.</span>}
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["experience"], queryFn: () => api.get<ExperienceDoc[]>("portfolio/experience?all=1") });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const toggle = useMutation({
    mutationFn: (x: ExperienceDoc) => api.patch(`portfolio/experience/${x._id}`, { isVisible: !x.isVisible }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["experience"] }),
  });
  const remove = useMutation({ mutationFn: (id: string) => api.del(`portfolio/experience/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ["experience"] }) });

  return (
    <div className="adm-page adm-page--narrow">
      <PageHeader
        title="Experience"
        description="The roles on your experience page, newest first."
        where={
          <>
            Shown on:{" "}
            <a href="/experience" target="_blank" rel="noopener noreferrer">
              /experience
            </a>
          </>
        }
        actions={
          <Button variant="primary" icon={<Plus />} onClick={() => setEditing("new")} disabled={editing === "new"}>
            Add role
          </Button>
        }
      />
      {isLoading && <LoadingBlock />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
      {editing === "new" && (
        <Section title="New role">
          <Editor initial={blank()} onDone={() => setEditing(null)} />
        </Section>
      )}
      {data && data.length === 0 && editing !== "new" && (
        <Empty title="No roles yet" action={<Button onClick={() => setEditing("new")}>Add your first role</Button>}>
          Until you add one, the site shows your built-in experience.
        </Empty>
      )}
      {data?.map((x) =>
        editing === x._id ? (
          <Section key={x._id} title={`Editing ${x.company}`}>
            <Editor initial={x} onDone={() => setEditing(null)} />
          </Section>
        ) : (
          <Section
            key={x._id}
            title={x.company}
            description={`${x.position}${x.location ? ` · ${x.location}` : ""}${x.isVisible === false ? " · hidden from the site" : ""}`}
            actions={
              <div className="adm-row">
                <Button size="sm" icon={x.isVisible === false ? <Eye /> : <EyeOff />} onClick={() => toggle.mutate(x)}>
                  {x.isVisible === false ? "Show" : "Hide"}
                </Button>
                <Button size="sm" icon={<Pencil />} onClick={() => setEditing(x._id)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="quiet"
                  iconOnly
                  icon={<Trash2 />}
                  onClick={async () => {
                    if (!(await confirm({ title: `Delete ${x.company}?`, body: "It disappears from your experience page.", confirmLabel: "Delete role", danger: true }))) return;
                    try {
                      await remove.mutateAsync(x._id);
                      toast.ok("Role deleted.");
                    } catch (err) {
                      toast.bad(errorMessage(err));
                    }
                  }}
                >
                  {`Delete ${x.company}`}
                </Button>
              </div>
            }
          >
            <ul className="adm-stack" style={{ gap: "0.35rem" }}>
              {(x.responsibilities?.length ? x.responsibilities : [x.description]).slice(0, 3).map((r, i) => (
                <li key={i} className="adm-muted adm-small">
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        )
      )}
    </div>
  );
}
