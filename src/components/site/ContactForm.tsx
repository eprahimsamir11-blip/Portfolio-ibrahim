"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setError(payload.error || "تعذر إرسال الرسالة.");
      return;
    }
    setStatus("ok");
    form.reset();
  }

  if (status === "ok") {
    return (
      <div className="border border-line bg-paper-2 px-6 py-10">
        <p className="font-display text-2xl">وصلت الرسالة</p>
        <p className="mt-3 text-sm leading-7 text-ink-soft">شكراً لتواصلك. سأرد في أقرب وقت ممكن.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="admin-label">
          الاسم
        </label>
        <input id="name" name="name" required className="admin-input bg-transparent" />
      </div>
      <div>
        <label htmlFor="email" className="admin-label">
          البريد الإلكتروني
        </label>
        <input id="email" name="email" type="email" required className="admin-input bg-transparent" />
      </div>
      <div className="hidden">
        <label htmlFor="company">الشركة</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="message" className="admin-label">
          الرسالة
        </label>
        <textarea id="message" name="message" required rows={6} className="admin-textarea bg-transparent" />
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 items-center bg-ink px-6 text-sm text-paper disabled:opacity-60"
      >
        {status === "loading" ? "جارٍ الإرسال..." : "إرسال الرسالة"}
      </button>
    </form>
  );
}
