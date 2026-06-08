"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JournalEntry } from "@/lib/types";

type Mode = "view" | "edit" | "confirm-delete";
type Status = "idle" | "saving" | "deleting" | "error";

export default function EntryActions({ entry }: { entry: JournalEntry }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("view");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: entry.title,
    author: entry.author,
    excerpt: entry.excerpt ?? "",
    content: entry.content,
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function cancel() {
    setMode("view");
    setError("");
    setStatus("idle");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      const res = await fetch(`/api/journal/${entry.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      setStatus("idle");
      setMode("view");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function handleDelete() {
    setStatus("deleting");
    setError("");
    try {
      const res = await fetch(`/api/journal/${entry.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/journal");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
      setMode("view");
    }
  }

  if (mode === "view") {
    return (
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => setMode("edit")}
          className="text-sm text-warm-400 hover:text-accent transition-colors"
        >
          Edit
        </button>
        <span className="text-warm-200">·</span>
        <button
          onClick={() => setMode("confirm-delete")}
          className="text-sm text-warm-400 hover:text-red-500 transition-colors"
        >
          Delete
        </button>
      </div>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-700 flex-1">
          Delete this letter permanently? This cannot be undone.
        </p>
        {error && <p className="text-sm text-red-600 w-full">{error}</p>}
        <button
          onClick={handleDelete}
          disabled={status === "deleting"}
          className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
        >
          {status === "deleting" ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={cancel}
          className="text-sm text-warm-500 hover:text-warm-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-warm-200 bg-warm-50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-xl text-warm-900">Edit letter</h2>
        <button
          onClick={cancel}
          className="text-warm-400 hover:text-warm-600 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Written by <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
              className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">
            Short preview{" "}
            <span className="text-warm-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-700 mb-1">
            Letter <span className="text-red-400">*</span>
          </label>
          <textarea
            required
            rows={14}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent resize-y font-mono leading-relaxed"
          />
          <p className="text-warm-400 text-xs mt-1">
            Markdown supported — **bold**, *italic*, etc.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status === "saving"}
            className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
