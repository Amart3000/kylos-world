"use client";

import { useState, useRef } from "react";
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
  const [index, setIndex] = useState(-1);
  const [captions, setCaptions] = useState<Record<string, string>>(
    () => Object.fromEntries(photos.map((p) => [p.filename, p.caption ?? ""]))
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
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

  const slides = photos.map((photo) => ({
    src: photoSrc(albumSlug, photo.filename),
    width: photo.width,
    height: photo.height,
    description: captions[photo.filename] || undefined,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => {
          const caption = captions[photo.filename] ?? "";
          const isEditing = editing === photo.filename;

          return (
            <div key={photo.filename} className="flex flex-col gap-1">
              <button
                onClick={() => setIndex(i)}
                className="relative aspect-square rounded-xl overflow-hidden bg-warm-100 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <Image
                  src={photoSrc(albumSlug, photo.filename)}
                  alt={caption || `Photo ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </button>

              {isEditing ? (
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
