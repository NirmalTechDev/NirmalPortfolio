import { NextResponse } from "next/server";
import { ApiError, collectiveApiFetch } from "@/lib/api-client";
import { mailFallbackConfigured, sendContactByMail } from "@/lib/contact-mail";
import { nirmalIdentity } from "@/lib/seo";

// The backend runs on a free-tier host that can take ~50s to wake up.
export const maxDuration = 60;
export const dynamic = "force-dynamic";
const BACKEND_TIMEOUT_MS = 50_000;

const BACKEND_ORIGIN = (
  process.env.NEXT_PUBLIC_COLLECTIVE_API_URL || "https://collective-onc6.onrender.com/api/v1"
).replace(/\/api\/v1\/?$/, "");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** GET: fire-and-forget wake-up ping so the backend is warm by the time the form is submitted. */
export async function GET() {
  try {
    await fetch(`${BACKEND_ORIGIN}/api/health`, { signal: AbortSignal.timeout(55_000), cache: "no-store" });
  } catch {
    // Warm-up only; failures are irrelevant here.
  }
  return new NextResponse(null, { status: 204 });
}

/**
 * POST /api/contact: public contact form.
 * 1) stores it via the Collective backend (shows up in the staff dashboard);
 * 2) if the backend is unreachable, falls back to direct email so nothing is lost.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const name = str("name");
  const email = str("email").toLowerCase();
  const subject = str("subject") || "Portfolio enquiry";
  const message = str("message");

  // Bots that fill the hidden field get a silent success.
  if (str("honeypot")) return NextResponse.json({ success: true, message: "Message received." });

  if (name.length < 2 || name.length > 100) return fail("Please enter your name.", 400);
  if (!EMAIL_RE.test(email) || email.length > 254) return fail("Please enter a valid email address.", 400);
  if (message.length < 5 || message.length > 5000) return fail("Please write a message (up to 5,000 characters).", 400);
  const payload = { name, email, subject: subject.slice(0, 200), message };

  try {
    await collectiveApiFetch("/contact", {
      method: "POST",
      public: true,
      timeout: BACKEND_TIMEOUT_MS,
      body: JSON.stringify({ ...payload, honeypot: "" }),
    });
    return NextResponse.json({ success: true, message: "Thank you! Your message has been sent." });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    console.error("[contact] backend delivery failed:", err instanceof Error ? err.message : err);

    // Validation / rate-limit answers from the backend are the visitor's to see.
    if (err instanceof ApiError && status >= 400 && status < 500) {
      return fail(err.message, status);
    }

    if (mailFallbackConfigured()) {
      try {
        await sendContactByMail(payload);
        return NextResponse.json({ success: true, message: "Thank you! Your message has been sent." });
      } catch (mailErr) {
        console.error("[contact] email fallback failed:", mailErr instanceof Error ? mailErr.message : mailErr);
      }
    }

    return fail(`The message service is unavailable right now. Please email ${nirmalIdentity.email} directly.`, 503);
  }
}
