import { NextResponse } from "next/server";
import { collectiveApiFetch, ApiError } from "@/lib/api-client";

/**
 * POST /api/contact — public contact form submission.
 * Proxies to Collective Ledger backend POST /contact
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: true, message: "Message received." });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    await collectiveApiFetch("/contact", {
      method: "POST",
      public: true,
      body: JSON.stringify({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        subject: String(subject || "Portfolio Inquiry").trim(),
        message: String(message).trim(),
        honeypot: "",
      }),
    });

    return NextResponse.json({ success: true, message: "Thank you! Your message has been sent." });
  } catch (err) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Failed to send message.";
    return NextResponse.json({ error: message }, { status });
  }
}
