"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink, FileText, Trash2 } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { DropZone, Progress, useUploader } from "@/features/admin/media";
import { Button, Empty, ErrorBlock, LoadingBlock, Note, PageHeader, Section, timeAgo, useConfirm, useToast } from "@/features/admin/ui";
import type { ResumeDoc } from "@/features/admin/types";

const size = (b?: number) => (b ? `${(b / 1e6).toFixed(b > 1e6 ? 1 : 2)} MB` : "");

export default function ResumePage() {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["resumes"], queryFn: () => api.get<ResumeDoc[]>("portfolio/resume") });
  const { upload, progress, busy } = useUploader("resume");
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["resumes"] });
    qc.invalidateQueries({ queryKey: ["overview"] });
  };

  const create = useMutation({
    mutationFn: (body: Partial<ResumeDoc>) => api.post<ResumeDoc>("portfolio/resume", body),
    onSuccess: refresh,
  });
  const activate = useMutation({ mutationFn: (id: string) => api.patch(`portfolio/resume/${id}`, { active: true }), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (id: string) => api.del(`portfolio/resume/${id}`), onSuccess: refresh });

  const onFiles = async ([file]: File[]) => {
    const asset = await upload(file);
    if (!asset) return;
    try {
      const title = file.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ");
      await create.mutateAsync({ title, fileUrl: asset.url, publicId: asset.publicId, fileSize: file.size, fileName: file.name, mimeType: "application/pdf", resourceType: "raw", active: true } as Partial<ResumeDoc>);
      toast.ok("New résumé uploaded and now live on your website.");
    } catch (err) {
      toast.bad(errorMessage(err));
    }
  };

  const active = data?.find((r) => r.active);

  return (
    <div className="adm-page adm-page--narrow">
      <PageHeader
        title="Résumé"
        description="Upload a new PDF and every “Résumé (PDF)” link on your website switches to it straight away."
        where={
          <>
            Public link that never changes:{" "}
            <a href="/resume" target="_blank" rel="noopener noreferrer">
              nirmalranpariya.in/resume
            </a>
          </>
        }
      />
      <Section title="Upload a new version" description="PDF only, up to 10 MB. The previous version is kept below in case you want it back.">
        <div className="adm-stack">
          <DropZone kind="resume" label="Drop your PDF here or choose a file" hint="It becomes the active résumé immediately" onFiles={onFiles} disabled={busy || create.isPending} />
          {progress !== null && <Progress value={progress} />}
        </div>
      </Section>

      <Section title="Versions">
        {isLoading && <LoadingBlock rows={2} />}
        {error && <ErrorBlock error={error} onRetry={() => refetch()} />}
        {data && data.length === 0 && (
          <Empty title="No uploads yet">Your website is using the built-in résumé PDF. Upload one above to replace it.</Empty>
        )}
        {data && data.length > 0 && (
          <div className="adm-rows">
            {data.map((r) => (
              <div className="adm-rowitem" key={r._id}>
                <FileText aria-hidden="true" />
                <div className="adm-rowitem__main">
                  <p className="adm-rowitem__title">
                    {r.title} {r.active && <span className="adm-badge adm-badge--ok" style={{ marginLeft: 6 }}>Live</span>}
                  </p>
                  <p className="adm-rowitem__sub">
                    {r.fileName || "PDF"} {size(r.fileSize) && `· ${size(r.fileSize)}`} · uploaded {timeAgo(r.createdAt)}
                  </p>
                </div>
                <a className="adm-btn adm-btn--sm adm-btn--quiet" href={r.fileUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${r.title}`}>
                  <ExternalLink />
                </a>
                {!r.active && (
                  <>
                    <Button
                      size="sm"
                      icon={<CheckCircle2 />}
                      loading={activate.isPending && activate.variables === r._id}
                      onClick={async () => {
                        try {
                          await activate.mutateAsync(r._id);
                          toast.ok(`“${r.title}” is now live.`);
                        } catch (err) {
                          toast.bad(errorMessage(err));
                        }
                      }}
                    >
                      Make live
                    </Button>
                    <Button
                      size="sm"
                      variant="quiet"
                      iconOnly
                      icon={<Trash2 />}
                      onClick={async () => {
                        if (!(await confirm({ title: `Delete “${r.title}”?`, body: "The file is removed from storage. This can't be undone.", confirmLabel: "Delete", danger: true }))) return;
                        try {
                          await remove.mutateAsync(r._id);
                          toast.ok("Résumé deleted.");
                        } catch (err) {
                          toast.bad(errorMessage(err));
                        }
                      }}
                    >
                      {`Delete ${r.title}`}
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        {active && !active.fileUrl.startsWith("http") && (
          <div style={{ marginTop: "1rem" }}>
            <Note>The live résumé is the PDF bundled with the website ({active.fileUrl}). Upload a new one to manage it here.</Note>
          </div>
        )}
      </Section>
    </div>
  );
}
