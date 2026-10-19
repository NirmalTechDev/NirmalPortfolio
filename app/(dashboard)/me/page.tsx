"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, FolderKanban, Images, Inbox, UserRound, Cake } from "lucide-react";
import { useOverview } from "@/features/admin/shell";
import { ErrorBlock, LoadingBlock, Note, PageHeader, Section, timeAgo } from "@/features/admin/ui";

const ACTIONS: Record<string, string> = {
  SITE_CONTENT_UPDATED: "Updated profile & page text",
  PROJECT_CREATED: "Added a project",
  PORTFOLIO_UPDATED: "Edited portfolio content",
  PROJECT_DELETED: "Deleted a project",
  PROJECTS_REORDERED: "Reordered projects",
  RESUME_UPLOADED: "Uploaded a résumé",
  RESUME_UPDATED: "Changed the active résumé",
  RESUME_DELETED: "Deleted a résumé",
  CONTACT_REPLIED: "Replied to a message",
  CONTACT_REPLY_FAILED: "A reply failed to send",
  CONTACT_STATUS_UPDATED: "Updated a message",
  CONTACT_DELETED: "Deleted a message",
  GALLERY_PHOTO_ADDED: "Added a gallery photo",
  GALLERY_PHOTOS_ADDED: "Added gallery photos",
  GALLERY_PHOTO_UPDATED: "Edited a gallery photo",
  GALLERY_PHOTO_REPLACED: "Replaced a gallery photo",
  GALLERY_PHOTOS_UPDATED: "Edited several gallery photos",
  GALLERY_REORDERED: "Reordered the gallery",
  GALLERY_PHOTO_TRASHED: "Moved a photo to trash",
  GALLERY_PHOTO_RESTORED: "Restored a photo",
  GALLERY_PHOTO_DELETED: "Deleted a photo permanently",
  BIRTHDAY_CREATED: "Created a birthday page",
  BIRTHDAY_UPDATED: "Edited a birthday page",
  BIRTHDAY_DUPLICATED: "Duplicated a birthday page",
  BIRTHDAY_DEFAULT_SET: "Changed the main birthday page",
  BIRTHDAY_DELETED: "Deleted a birthday page",
};

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export default function OverviewPage() {
  const { data, isLoading, error, refetch } = useOverview();

  return (
    <div className="adm-page">
      <PageHeader
        title={`${greeting()}, Nirmal`}
        description="Everything on your website, inbox, gallery and birthday pages is managed from here. Changes go live as soon as you save."
        actions={
          <a className="adm-btn" href="/" target="_blank" rel="noopener noreferrer">
            Open website <ArrowUpRight />
          </a>
        }
      />

      {isLoading && <LoadingBlock rows={5} />}
      {error && <ErrorBlock error={error} onRetry={() => refetch()} />}

      {data && (
        <div className="adm-stack" style={{ gap: "1.25rem" }}>
          {!data.siteContentReady && (
            <Note tone="warn">
              <b>Your website is still showing its original built-in content.</b> Run the one-time content migration (see the deployment notes) and every
              section will become editable here. Until then, saving the Profile page creates the content from scratch.
            </Note>
          )}
          {data.services.media.driver === "none" && (
            <Note tone="bad">
              <b>Uploads are switched off.</b> The server has no Cloudinary credentials, so photos, the résumé and music can&apos;t be uploaded yet.
            </Note>
          )}
          {data.services.media.driver === "local" && <Note>Uploads are stored on this computer (local development mode), not on Cloudinary.</Note>}
          {!data.services.emailConfigured && (
            <Note tone="warn">
              <b>Email replies are off.</b> Add the Gmail app password on the server so you can reply to messages from the inbox.
            </Note>
          )}

          <div className="adm-grid adm-grid--2">
            <Section
              title="Inbox"
              description={
                data.counts.newMessages
                  ? `${data.counts.newMessages} new message${data.counts.newMessages === 1 ? "" : "s"} waiting`
                  : "You're all caught up."
              }
              actions={
                <Link className="adm-btn adm-btn--sm" href="/me/inbox">
                  Open inbox
                </Link>
              }
            >
              {data.recentMessages.length === 0 ? (
                <p className="adm-muted">When someone writes through the contact form, it appears here.</p>
              ) : (
                <div className="adm-rows">
                  {data.recentMessages.map((m) => (
                    <Link key={m._id} href={`/me/inbox?id=${m._id}`} className="adm-rowitem">
                      <div className="adm-rowitem__main">
                        <p className="adm-rowitem__title">
                          {m.status === "NEW" && <span className="adm-badge adm-badge--accent" style={{ marginRight: 8 }}>New</span>}
                          {m.name}
                        </p>
                        <p className="adm-rowitem__sub">{m.subject}</p>
                      </div>
                      <span className="adm-small adm-muted">{timeAgo(m.createdAt)}</span>
                    </Link>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Your website" description="What visitors see right now.">
              <div className="adm-rows">
                <Link className="adm-rowitem" href="/me/projects">
                  <FolderKanban aria-hidden="true" />
                  <div className="adm-rowitem__main">
                    <p className="adm-rowitem__title">Projects</p>
                    <p className="adm-rowitem__sub">
                      {data.counts.projects - data.counts.hiddenProjects} shown{data.counts.hiddenProjects ? `, ${data.counts.hiddenProjects} hidden` : ""}
                    </p>
                  </div>
                </Link>
                <Link className="adm-rowitem" href="/me/resume">
                  <FileText aria-hidden="true" />
                  <div className="adm-rowitem__main">
                    <p className="adm-rowitem__title">Résumé</p>
                    <p className="adm-rowitem__sub">{data.resume ? `${data.resume.title} · updated ${timeAgo(data.resume.updatedAt)}` : "Using the built-in PDF"}</p>
                  </div>
                </Link>
                <Link className="adm-rowitem" href="/me/profile">
                  <UserRound aria-hidden="true" />
                  <div className="adm-rowitem__main">
                    <p className="adm-rowitem__title">Profile & page text</p>
                    <p className="adm-rowitem__sub">{data.siteUpdatedAt ? `Last edited ${timeAgo(data.siteUpdatedAt)}` : "Not edited yet"}</p>
                  </div>
                </Link>
              </div>
            </Section>

            <Section title="Personal pages">
              <div className="adm-rows">
                <Link className="adm-rowitem" href="/me/gallery">
                  <Images aria-hidden="true" />
                  <div className="adm-rowitem__main">
                    <p className="adm-rowitem__title">Gallery</p>
                    <p className="adm-rowitem__sub">
                      {data.counts.photos} photo{data.counts.photos === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
                <Link className="adm-rowitem" href="/me/birthdays">
                  <Cake aria-hidden="true" />
                  <div className="adm-rowitem__main">
                    <p className="adm-rowitem__title">Birthday pages</p>
                    <p className="adm-rowitem__sub">
                      {data.counts.birthdays} page{data.counts.birthdays === 1 ? "" : "s"}, {data.counts.publishedBirthdays} published
                    </p>
                  </div>
                </Link>
                <Link className="adm-rowitem" href="/me/inbox">
                  <Inbox aria-hidden="true" />
                  <div className="adm-rowitem__main">
                    <p className="adm-rowitem__title">All messages</p>
                    <p className="adm-rowitem__sub">{data.counts.totalMessages} in total</p>
                  </div>
                </Link>
              </div>
            </Section>

            <Section title="Recent changes" description="Your last edits, newest first.">
              {data.activity.length === 0 ? (
                <p className="adm-muted">Nothing edited yet.</p>
              ) : (
                <ul className="adm-stack" style={{ gap: "0.55rem" }}>
                  {data.activity.map((a) => (
                    <li key={a._id} className="adm-row" style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
                      <span>{ACTIONS[a.action] || a.action.toLowerCase().replace(/_/g, " ")}</span>
                      <span className="adm-small adm-muted" style={{ whiteSpace: "nowrap" }}>
                        {timeAgo(a.timestamp)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}
