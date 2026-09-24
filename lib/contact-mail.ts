import nodemailer from "nodemailer";
import { nirmalIdentity } from "@/lib/seo";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** True when a direct-SMTP fallback is configured (all four vars set). */
export function mailFallbackConfigured() {
  return Boolean(
    process.env.CONTACT_SMTP_HOST && process.env.CONTACT_SMTP_USER && process.env.CONTACT_SMTP_PASS,
  );
}

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Last-resort delivery used when the Collective backend is unreachable, so a
 * visitor's message is never lost. Sends to the site owner only.
 */
export async function sendContactByMail({ name, email, subject, message }: ContactPayload) {
  const port = Number(process.env.CONTACT_SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.CONTACT_SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.CONTACT_SMTP_USER, pass: process.env.CONTACT_SMTP_PASS },
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const to = process.env.CONTACT_TO || nirmalIdentity.email;
  const clean = (v: string) => v.replace(/[\r\n]+/g, " ");

  await transport.sendMail({
    from: process.env.CONTACT_SMTP_FROM || process.env.CONTACT_SMTP_USER,
    to,
    replyTo: email,
    subject: `[Portfolio] ${clean(name)}: ${clean(subject)}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p><p>${esc(subject)}</p><pre style="font-family:inherit;white-space:pre-wrap">${esc(message)}</pre>`,
  });
}
