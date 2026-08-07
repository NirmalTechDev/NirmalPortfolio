"use client";

import React, { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const inputStyle: React.CSSProperties = {
    padding: "14px 16px",
    borderRadius: 12,
    background: "hsl(var(--bg)/.6)",
    border: "1px solid hsl(var(--text)/.1)",
    color: "inherit",
    outline: "none",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `Portfolio inquiry from ${name}`,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message.");

      setStatus("success");
      setFeedback("Message sent! I'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setFeedback(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, display: "grid", gap: 12 }}>
      {/* Honeypot — hidden from users, catches bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />

      <input
        placeholder="Your Name or Company"
        aria-label="Name"
        required
        minLength={2}
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />
      <input
        placeholder="Your Email"
        aria-label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <textarea
        placeholder="Tell me what masterpiece you want to build (or ask a question)"
        rows={4}
        aria-label="Message"
        required
        minLength={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={inputStyle}
      />

      {feedback && (
        <p
          style={{
            fontSize: 14,
            color: status === "success" ? "hsl(142 76% 45%)" : "hsl(0 84% 60%)",
          }}
        >
          {feedback}
        </p>
      )}

      <div className="goo">
        <button type="submit" className="btn primary magnet" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send Message ✦"}
        </button>
        <button
          type="reset"
          className="btn magnet"
          onClick={() => {
            setName("");
            setEmail("");
            setMessage("");
            setStatus("idle");
            setFeedback("");
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
