"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setError(data.error || "بيانات الدخول غير صحيحة.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="admin-label">
          البريد الإلكتروني
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className="admin-input" />
      </div>
      <div>
        <label htmlFor="password" className="admin-label">
          كلمة المرور
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="admin-input" />
      </div>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      <button type="submit" disabled={loading} className="admin-btn admin-btn-primary w-full">
        {loading ? "جارٍ الدخول..." : "دخول"}
      </button>
    </form>
  );
}
