"use client";

import { useState } from "react";

const ENGAGEMENTS = ["Full-time role", "Contract or freelance project", "Technical consulting", "Just exploring"];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const v = (k: string) => String(d.get(k) ?? "").trim();

    const next: Errors = {};
    if (!v("name")) next.name = "Please tell me your name.";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) next.email = "Please enter a valid email address.";
    if (v("message").length < 10) next.message = "A sentence or two is enough, but not less.";
    setErrors(next);
    if (Object.keys(next).length) {
      // Wait for React to render aria-invalid before moving focus.
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
      return;
    }

    setState("sending");
    setNote("");
    const meta = [
      v("company") && `Company: ${v("company")}`,
      v("engagement") && `Engagement: ${v("engagement")}`,
      v("building") && `Building: ${v("building")}`,
    ].filter(Boolean);
    const body = `${meta.join("\n")}\n\n${v("message")}`;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v("name"),
          email: v("email"),
          subject: `${v("engagement") || "Enquiry"} — ${v("company") || v("name")}`,
          message: body,
          honeypot: v("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The message could not be sent.");
      setState("sent");
      setNote("Thank you. I have your message and will reply by email.");
      form.reset();
    } catch (err) {
      setState("error");
      setNote(`${err instanceof Error ? err.message : "Something went wrong."} You can also email me directly.`);
    }
  }

  const field = (id: keyof Errors) => ({
    "aria-invalid": errors[id] ? (true as const) : undefined,
    "aria-describedby": errors[id] ? `${id}-err` : undefined,
  });

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" autoComplete="name" required {...field("name")} />
        {errors.name && <p className="err" id="name-err">{errors.name}</p>}
      </div>
      <div className="field">
        <label htmlFor="company">Company (optional)</label>
        <input id="company" name="company" autoComplete="organization" />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required {...field("email")} />
        {errors.email && <p className="err" id="email-err">{errors.email}</p>}
      </div>
      <div className="field">
        <label htmlFor="engagement">Engagement type</label>
        <select id="engagement" name="engagement" defaultValue={ENGAGEMENTS[1]}>
          {ENGAGEMENTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="field field--full">
        <label htmlFor="building">What are you building?</label>
        <input id="building" name="building" />
      </div>
      <div className="field field--full">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required {...field("message")} />
        {errors.message && <p className="err" id="message-err">{errors.message}</p>}
      </div>
      <div className="field--full" style={{ display: "flex", gap: "var(--s-5)", alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true">→</span>
        </button>
        <p className="form-note cap" role="status" aria-live="polite">
          {note}
        </p>
      </div>
    </form>
  );
}
