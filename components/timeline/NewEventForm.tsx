"use client";

import { useState } from "react";
import type { TimelineEvent } from "@/lib/types";

const CATEGORIES: TimelineEvent["category"][] = [
  "milestone",
  "first",
  "medical",
  "trip",
  "birthday",
];

type Status = "idle" | "submitting" | "done" | "error";

export default function NewEventForm({
  onAdded,
}: {
  onAdded: (event: TimelineEvent) => void;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    category: "milestone" as TimelineEvent["category"],
    note: "",
  });

  function update<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      const { event } = await res.json();
      onAdded(event);
      setStatus("idle");
      setOpen(false);
      setForm({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        category: "milestone",
        note: "",
      });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent text-accent text-sm font-medium hover:bg-accent hover:text-white transition-colors"
      >
        Add milestone
      </button>
    );
  }

  return (
    <div className="mb-10 rounded-2xl border border-warm-200 bg-warm-50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-xl text-warm-900">New milestone</h2>
        <button
          onClick={() => { setOpen(false); setStatus("idle"); setError(""); }}
          className="text-warm-400 hover:text-warm-600 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="First steps"
            className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as TimelineEvent["category"])}
              className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">
            Note <span className="text-warm-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="A few words about this moment…"
            className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Saving…" : "Save milestone"}
          </button>
        </div>
      </form>
    </div>
  );
}
