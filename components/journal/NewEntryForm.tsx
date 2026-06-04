"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "submitting" | "done" | "error";

export default function NewEntryForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    excerpt: "",
    content: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Submission failed");
      }

      setStatus("done");
      setForm({ title: "", author: "", excerpt: "", content: "" });
      router.refresh();
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
        Write a letter
      </button>
    );
  }

  return (
    <div className="mb-10 rounded-2xl border border-warm-200 bg-warm-50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-xl text-warm-900">Write a letter to Kylo</h2>
        <button
          onClick={() => { setOpen(false); setStatus("idle"); setError(""); }}
          className="text-warm-400 hover:text-warm-600 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>

      {status === "done" ? (
        <div className="text-center py-6">
          <p className="text-warm-700 text-lg font-medium mb-1">Letter saved!</p>
          <p className="text-warm-400 text-sm mb-4">It will appear in the list above.</p>
          <button
            onClick={() => { setStatus("idle"); setOpen(false); }}
            className="text-accent text-sm hover:underline"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="A letter for your first birthday"
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
                placeholder="Mom & Dad"
                className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Short preview <span className="text-warm-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.excerpt}
              onChange={(e) => update("excerpt", e.target.value)}
              placeholder="One sentence shown on the letters page"
              className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-700 mb-1">
              Letter <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              rows={10}
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Dear Kylo,&#10;&#10;..."
              className="w-full rounded-lg border border-warm-200 bg-white px-3 py-2 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent resize-y font-mono leading-relaxed"
            />
            <p className="text-warm-400 text-xs mt-1">Markdown is supported — **bold**, *italic*, etc.</p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Saving…" : "Save letter"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
