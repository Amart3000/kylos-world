"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAlbumForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, description }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create album");
      }
      setOpen(false);
      setTitle("");
      setDescription("");
      router.refresh();
      router.push("/gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mb-8 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm"
      >
        <span className="text-lg leading-none">+</span> New Album
      </button>
    );
  }

  return (
    <div className="mb-8 rounded-2xl border border-white/40 bg-white/50 backdrop-blur-sm p-6 shadow-md">
      <h2 className="font-heading text-lg text-warm-900 mb-4">Create New Album</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">Album name *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. First Week Home"
            required
            className="w-full rounded-lg border border-warm-200 bg-white/70 px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">Date</label>
          <input
            type="month"
            value={date.slice(0, 7)}
            onChange={(e) => setDate(e.target.value + "-01")}
            className="w-full rounded-lg border border-warm-200 bg-white/70 px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="A short description of this album…"
            className="w-full rounded-lg border border-warm-200 bg-white/70 px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || !title.trim()}
            className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Creating…" : "Create Album"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-5 py-2 rounded-lg border border-warm-200 text-warm-600 text-sm hover:bg-warm-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
