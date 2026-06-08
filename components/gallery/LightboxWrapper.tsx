"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import type { Photo } from "@/lib/types";

export default function LightboxWrapper({
  albumSlug,
  photos,
}: {
  albumSlug: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(-1);
  const [localPhotos, setLocalPhotos] = useState<Photo[]>(photos);
  const [captions, setCaptions] = useState<Record<string, string>>(
    () => Object.fromEntries(photos.map((p) => [p.filename, p.caption ?? ""]))
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit(filename: string) {
    setDraft(captions[filename] ?? "");
    setEditing(filename);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function saveCaption(filename: string) {
    const trimmed = draft.trim();
    setCaptions((prev) => ({ ...prev, [filename]: trimmed }));
    setEditing(null);

    await fetch(`/api/caption/${albumSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, caption: trimmed }),
    });
  }

  function handleKeyDown(e: React.KeyboardEvent, filename: string) {
    if (e.key === "Enter") saveCaption(filename);
    if (e.key === "Escape") setEditing(null);
  }

  async function handleDeletePhoto(filename: string) {
    setLocalPhotos((prev) => prev.filter((p) => p.filename !== filename));
    setConfirmDelete(null);
    setIndex(-1);

    await fetch(`/api/gallery/${albumSlug}/photos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    router.refresh();
  }

  const slides = localPhotos.map((photo) => ({
    src: photoSrc(albumSlug, photo.filename),
    width: photo.width,
    height: photo.height,
    description: captions[photo.filename] || undefined,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {localPhotos.map((photo, i) => {
          const caption = captions[photo.filename] ?? "";
          const isEditing = editing === photo.filename;
          const isConfirmingDelete = confirmDelete === photo.filename;

          return (
            <div key={photo.filename} className="flex flex-col gap-1">
              <div className="relative group">
                <button
                  onClick={() => setIndex(i)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-warm-100 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent w-full"
                >
                  <Image
                    src={photoSrc(albumSlug, photo.filename)}
                    alt={caption || `Photo ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </button>
                <button
                  onClick={() => setConfirmDelete(photo.filename)}
                  title="Delete photo"
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                >
                  ×
                </button>
              </div>

              {isConfirmingDelete && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-2 py-1.5 text-xs">
                  <p className="text-red-700 mb-1.5">Delete this photo?</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleDeletePhoto(photo.filename)}
                      className="px-2 py-0.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-2 py-0.5 rounded border border-warm-200 text-warm-600 hover:bg-warm-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isConfirmingDelete && (
                isEditing ? (
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => saveCaption(photo.filename)}
                    onKeyDown={(e) => handleKeyDown(e, photo.filename)}
                    placeholder="Add a caption…"
                    className="text-xs text-warm-700 bg-transparent border-b border-accent outline-none px-0.5 py-0.5 w-full"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(photo.filename)}
                    className="text-left text-xs px-0.5 truncate transition-colors"
                    title={caption || "Click to add caption"}
                  >
                    {caption ? (
                      <span className="text-warm-600">{caption}</span>
                    ) : (
                      <span className="text-warm-300 italic">Add caption…</span>
                    )}
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions]}
      />
    </>
  );
}
