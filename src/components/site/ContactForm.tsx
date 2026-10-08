"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      body: fd.get("body"),
      company: fd.get("company"), // honeypot
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("done");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return (
      <div className="surface flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 size={40} className="text-accent" />
        <h3 className="display text-2xl font-bold">Message sent</h3>
        <p className="text-muted">Thanks for reaching out — we&apos;ll be in touch soon.</p>
        <button className="btn btn-ghost mt-2" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface flex flex-col gap-4 p-6 md:p-8">
      {/* Honeypot (hidden from users) */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required className="input" placeholder="Your name" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="subject">Subject</label>
        <input id="subject" name="subject" className="input" placeholder="What's this about?" />
      </div>
      <div>
        <label className="label" htmlFor="body">Message</label>
        <textarea id="body" name="body" required rows={6} className="textarea" placeholder="Tell us about your project..." />
      </div>

      {status === "error" && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={status === "loading"} className="btn btn-accent self-start disabled:opacity-60">
        {status === "loading" ? "Sending..." : <>Send message <Send size={16} /></>}
      </button>
    </form>
  );
}
