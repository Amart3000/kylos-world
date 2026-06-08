"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryAlbum } from "@/lib/types";

type Mode = "view" | "edit" | "confirm-delete";

export default function AlbumActions({ album }: { album: GalleryAlbum }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("view");
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/gallery/${album.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setMode("view");
      router.refresh();
    } catch {
      setError("Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      const res = await fetch(`/api/gallery/${album.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/gallery");
      router.refresh();
    } catch {
      setError("Could not delete album.");
      setSaving(false);
    }
  }

  if (mode === "edit") {
    return (
      <form onSubmit={handleSave} className="mt-3 flex flex-col gap-3 p-4 rounded-xl bg-white/50 border border-white/40 backdrop-blur-sm">
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">Album name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-warm-200 bg-white/70 px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-600 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-warm-200 bg-white/70 px-3 py-2 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => { setMode("view"); setTitle(album.title); setDescription(album.description ?? ""); }}
            className="px-4 py-1.5 rounded-lg border border-warm-200 text-warm-600 text-sm hover:bg-warm-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <div className="mt-3 p-4 rounded-xl bg-red-50/80 border border-red-200 backdrop-blur-sm">
        <p className="text-sm text-red-700 font-medium mb-3">
          Delete &ldquo;{album.title}&rdquo;? This will remove the album and all its photos permanently.
        </p>
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Deleting…" : "Yes, Delete"}
          </button>
          <button
            onClick={() => setMode("view")}
            className="px-4 py-1.5 rounded-lg border border-warm-200 text-warm-600 text-sm hover:bg-warm-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => setMode("edit")}
        className="text-xs px-3 py-1.5 rounded-lg border border-warm-200 text-warm-500 hover:text-accent hover:border-accent transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => setMode("confirm-delete")}
        className="text-xs px-3 py-1.5 rounded-lg border border-warm-200 text-warm-500 hover:text-red-600 hover:border-red-300 transition-colors"
      >
        Delete Album
      </button>
    </div>
  );
}
