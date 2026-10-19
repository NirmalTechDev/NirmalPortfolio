"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, ArrowLeft, Copy, Inbox as InboxIcon, Mail, MailOpen, Phone, Send, Star, Trash2 } from "lucide-react";
import { api, errorMessage } from "@/features/admin/api";
import { AutoTextarea, Button, Empty, ErrorBlock, LoadingBlock, Note, PageHeader, Segmented, timeAgo, useConfirm, useToast } from "@/features/admin/ui";
import type { ContactMessage, MessageStatus } from "@/features/admin/types";

type Filter = "ACTIVE" | "NEW" | "REPLIED" | "ARCHIVED" | "STARRED";

const filterQuery = (f: Filter, q: string) => {
  const p = new URLSearchParams();
  if (f === "STARRED") p.set("starred", "1");
  else if (f !== "ACTIVE") p.set("status", f);
  if (q.trim()) p.set("q", q.trim());
  return p.toString();
};

function InboxInner() {
  const params = useSearchParams();
  const router = useRouter();
  const selected = params.get("id");
  const [filter, setFilter] = useState<Filter>("ACTIVE");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  const list = useQuery({
    queryKey: ["messages", filter, debounced],
    queryFn: async () => {
      const all = await api.get<ContactMessage[]>(`contact/messages?${filterQuery(filter, debounced)}`);
      return filter === "ACTIVE" ? all.filter((m) => m.status !== "ARCHIVED") : all;
    },
    refetchInterval: 60_000,
  });
  const summary = useQuery({ queryKey: ["inbox-summary"], queryFn: () => api.get<Record<MessageStatus, number>>("contact/summary"), refetchInterval: 60_000 });
  const emailStatus = useQuery({ queryKey: ["email-status"], queryFn: () => api.get<{ configured: boolean; ok?: boolean; error?: string }>("contact/email-status"), staleTime: 300_000 });

  const open = (id: string | null) => router.replace(id ? `/me/inbox?id=${id}` : "/me/inbox", { scroll: false });

  return (
    <div className="adm-page">
      <PageHeader
        title="Inbox"
        description="Messages from the contact form on your website. Reply here and the email is sent from your address."
        where={summary.data ? `${summary.data.NEW} new · ${summary.data.READ} read · ${summary.data.REPLIED} replied · ${summary.data.ARCHIVED} archived` : undefined}
      />
      {emailStatus.data && !emailStatus.data.configured && (
        <div style={{ marginBottom: "1rem" }}>
          <Note tone="warn">
            <b>Replies can&apos;t be sent yet.</b> The server needs a Gmail app password (SMTP settings). You can still read, star and archive messages.
          </Note>
        </div>
      )}
      <div className="adm-inbox" data-open={Boolean(selected)}>
        <div className="adm-inbox__list-wrap adm-stack" style={{ gap: "0.75rem" }}>
          <input className="adm-input" type="search" placeholder="Search name, email or text" aria-label="Search messages" value={q} onChange={(e) => setQ(e.target.value)} />
          <Segmented
            label="Show"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "ACTIVE", label: "Inbox" },
              { value: "NEW", label: "New" },
              { value: "REPLIED", label: "Replied" },
              { value: "STARRED", label: "Starred" },
              { value: "ARCHIVED", label: "Archived" },
            ]}
          />
          {list.isLoading && <LoadingBlock rows={4} />}
          {list.error && <ErrorBlock error={list.error} onRetry={() => list.refetch()} />}
          {list.data && list.data.length === 0 && (
            <Empty title={debounced ? "No matches" : "Nothing here"}>{debounced ? "Try a different search." : "New messages from your contact form will show up here."}</Empty>
          )}
          {list.data && list.data.length > 0 && (
            <div className="adm-rows adm-inbox__list" role="list">
              {list.data.map((m) => (
                <button
                  key={m._id}
                  type="button"
                  role="listitem"
                  className="adm-msg"
                  aria-current={selected === m._id}
                  data-unread={m.status === "NEW"}
                  onClick={() => open(m._id)}
                >
                  <span className="adm-msg__top">
                    <span className="adm-msg__name">{m.name}</span>
                    {m.starred && <Star size={14} aria-label="Starred" fill="currentColor" style={{ color: "var(--warn)" }} />}
                    <span className="adm-small adm-muted">{timeAgo(m.createdAt)}</span>
                  </span>
                  <span className="adm-msg__subject" style={{ display: "block" }}>
                    {m.subject}
                  </span>
                  <span className="adm-msg__preview" style={{ display: "block" }}>
                    {m.status === "REPLIED" ? "↩ Replied · " : ""}
                    {m.message}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="adm-inbox__detail">
          {selected ? (
            <MessageDetail id={selected} onClose={() => open(null)} canReply={emailStatus.data?.configured !== false} emailProblem={emailStatus.data?.configured && emailStatus.data.ok === false ? emailStatus.data.error : undefined} />
          ) : (
            <div className="adm-empty" style={{ minHeight: "18rem", alignContent: "center" }}>
              <InboxIcon aria-hidden="true" />
              <p>Choose a message to read it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageDetail({ id, onClose, canReply, emailProblem }: { id: string; onClose: () => void; canReply: boolean; emailProblem?: string }) {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const msg = useQuery({ queryKey: ["message", id], queryFn: () => api.get<ContactMessage>(`contact/messages/${id}`) });
  const [reply, setReply] = useState("");
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState<string | null>(null);

  useEffect(() => {
    if (msg.data) {
      setSubject(`Re: ${msg.data.subject}`);
      setNotes(msg.data.notes || "");
      qc.invalidateQueries({ queryKey: ["overview"] });
      qc.invalidateQueries({ queryKey: ["inbox-summary"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg.data?._id]);

  const refresh = (m?: ContactMessage) => {
    if (m) qc.setQueryData(["message", id], m);
    qc.invalidateQueries({ queryKey: ["messages"] });
    qc.invalidateQueries({ queryKey: ["inbox-summary"] });
    qc.invalidateQueries({ queryKey: ["overview"] });
  };
  const update = useMutation({ mutationFn: (body: Partial<ContactMessage>) => api.patch<ContactMessage>(`contact/messages/${id}`, body), onSuccess: refresh });
  const send = useMutation({
    mutationFn: () => api.post<ContactMessage>(`contact/messages/${id}/reply`, { subject, body: reply }),
    onSuccess: (m) => {
      refresh(m);
      setReply("");
    },
    onError: () => qc.invalidateQueries({ queryKey: ["message", id] }),
  });
  const remove = useMutation({ mutationFn: () => api.del(`contact/messages/${id}`) });
  const removeReply = useMutation({
    mutationFn: (replyId: string) => api.del<ContactMessage>(`contact/messages/${id}/replies/${replyId}`),
    onSuccess: (m) => refresh(m),
  });

  if (msg.isLoading) return <LoadingBlock rows={4} />;
  if (msg.error) return <ErrorBlock error={msg.error} onRetry={() => msg.refetch()} />;
  const m = msg.data!;
  const received = new Date(m.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

  return (
    <article className="adm-section" aria-labelledby="msg-subject">
      <div className="adm-row" style={{ marginBottom: "1rem" }}>
        <Button size="sm" variant="quiet" icon={<ArrowLeft />} onClick={onClose}>
          Back
        </Button>
        <span className="adm-spacer" />
        <Button size="sm" variant="quiet" iconOnly icon={<Star fill={m.starred ? "currentColor" : "none"} />} onClick={() => update.mutate({ starred: !m.starred })}>
          {m.starred ? "Remove star" : "Star"}
        </Button>
        <Button size="sm" variant="quiet" iconOnly icon={m.status === "NEW" ? <MailOpen /> : <Mail />} onClick={() => update.mutate({ status: m.status === "NEW" ? "READ" : "NEW" })}>
          {m.status === "NEW" ? "Mark as read" : "Mark as unread"}
        </Button>
        <Button
          size="sm"
          icon={<Archive />}
          onClick={async () => {
            await update.mutateAsync({ status: m.status === "ARCHIVED" ? "READ" : "ARCHIVED" });
            toast.ok(m.status === "ARCHIVED" ? "Moved back to the inbox." : "Archived.");
          }}
        >
          {m.status === "ARCHIVED" ? "Unarchive" : "Archive"}
        </Button>
        <Button
          size="sm"
          variant="quiet"
          iconOnly
          icon={<Trash2 />}
          onClick={async () => {
            if (!(await confirm({ title: "Delete this message?", body: `From ${m.name}. It will no longer appear anywhere in the dashboard.`, confirmLabel: "Delete message", danger: true }))) return;
            try {
              await remove.mutateAsync();
              refresh();
              toast.ok("Message deleted.");
              onClose();
            } catch (err) {
              toast.bad(errorMessage(err));
            }
          }}
        >
          Delete
        </Button>
      </div>

      <h2 id="msg-subject" style={{ fontFamily: "var(--f-title)", fontWeight: 400, fontSize: "2rem", lineHeight: 1.1 }}>
        {m.subject}
      </h2>
      <p className="adm-row adm-small adm-muted" style={{ margin: "0.6rem 0 1.25rem" }}>
        <b style={{ color: "var(--ink)" }}>{m.name}</b>
        <a href={`mailto:${m.email}`}>{m.email}</a>
        <Button
          size="sm"
          variant="quiet"
          iconOnly
          icon={<Copy />}
          onClick={() => {
            navigator.clipboard?.writeText(m.email);
            toast.info("Email address copied.");
          }}
        >
          Copy email address
        </Button>
        {m.phone && (
          <a href={`tel:${m.phone}`} className="adm-row" style={{ gap: 4 }}>
            <Phone size={14} /> {m.phone}
          </a>
        )}
        <span>· {received}</span>
      </p>

      <div className="adm-letter">{m.message}</div>

      {m.replies.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <p className="adm-label" style={{ marginBottom: "0.5rem" }}>
            Your replies
          </p>
          <div className="adm-thread">
            {m.replies.map((r) => (
              <div key={r._id} className={`adm-bubble${r.status === "FAILED" ? " adm-bubble--failed" : ""}`}>
                <p className="adm-row adm-small" style={{ marginBottom: 6 }}>
                  {r.status === "SENT" ? <span className="adm-badge adm-badge--ok">Sent</span> : <span className="adm-badge adm-badge--bad">Not delivered</span>}
                  <span className="adm-muted">{new Date(r.sentAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
                </p>
                <p className="adm-letter adm-small">{r.body}</p>
                {r.status === "FAILED" && (
                  <div className="adm-reply-fail">
                    <p className="adm-error">{r.error}</p>
                    {r.errorDetail && r.errorDetail !== r.error && (
                      <details className="adm-small adm-muted">
                        <summary>Technical details</summary>
                        <code style={{ wordBreak: "break-word" }}>{r.errorDetail}</code>
                      </details>
                    )}
                    <div className="adm-row" style={{ gap: "0.5rem" }}>
                      <Button size="sm" onClick={() => setReply(r.body)}>
                        Put back in the editor
                      </Button>
                      <Button
                        size="sm"
                        variant="quiet"
                        loading={removeReply.isPending && removeReply.variables === r._id}
                        onClick={async () => {
                          try {
                            await removeReply.mutateAsync(r._id);
                            toast.ok("Removed the undelivered reply.");
                          } catch (err) {
                            toast.bad(errorMessage(err));
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <form
        className="adm-stack"
        style={{ marginTop: "1.75rem", gap: "0.6rem" }}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await send.mutateAsync();
            toast.ok(`Reply sent to ${m.email}.`);
          } catch (err) {
            toast.bad(errorMessage(err));
          }
        }}
      >
        <p className="adm-label">Reply to {m.name.split(" ")[0]}</p>
        {emailProblem && (
          <Note tone="warn">
            <b>Replies can&apos;t be emailed right now.</b> {emailProblem}
          </Note>
        )}
        <input className="adm-input" aria-label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={250} />
        <AutoTextarea
          aria-label="Your reply"
          placeholder={`Hi ${m.name.split(" ")[0]},`}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          style={{ minHeight: "9rem" }}
        />
        <p className="adm-hint">Your signature and their original message are added automatically.</p>
        <div className="adm-row">
          <Button type="submit" variant="primary" icon={<Send />} loading={send.isPending} disabled={!canReply || reply.trim().length < 2 || !subject.trim()}>
            Send reply
          </Button>
          {!canReply && <span className="adm-hint">Email isn&apos;t set up on the server yet.</span>}
        </div>
      </form>

      <div className="adm-field" style={{ marginTop: "1.75rem" }}>
        <label className="adm-label" htmlFor="notes">
          Private notes
        </label>
        <AutoTextarea id="notes" placeholder="Only you can see these." value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} />
        {notes !== null && notes !== (m.notes || "") && (
          <div>
            <Button
              size="sm"
              loading={update.isPending}
              onClick={async () => {
                await update.mutateAsync({ notes });
                toast.ok("Notes saved.");
              }}
            >
              Save notes
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function InboxPage() {
  return (
    <Suspense>
      <InboxInner />
    </Suspense>
  );
}
