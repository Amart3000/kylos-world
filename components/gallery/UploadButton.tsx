"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "uploading" | "done" | "error";

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function UploadButton({ albumSlug }: { albumSlug: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setStatus("uploading");
    setMessage(`Uploading ${imageFiles.length} photo${imageFiles.length !== 1 ? "s" : ""}…`);

    try {
      let uploaded = 0;

      for (const file of imageFiles) {
        setMessage(`Uploading ${uploaded + 1} of ${imageFiles.length}…`);

        // Upload directly from browser to Vercel Blob (no size limit)
        const blob = await upload(`gallery/${albumSlug}/${file.name}`, file, {
          access: "public",
          handleUploadUrl: `/api/upload/${albumSlug}`,
        });

        // Get real dimensions from the browser
        const { width, height } = await getImageDimensions(file);

        // Register the photo in the album metadata
        await fetch(`/api/gallery/${albumSlug}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: blob.url, width, height }),
        });

        uploaded++;
      }

      setStatus("done");
      setMessage(`${uploaded} photo${uploaded !== 1 ? "s" : ""} added!`);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Upload failed — please try again.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mb-8 flex items-center gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "uploading" ? "Uploading…" : "Upload Photos"}
      </button>
      {message && (
        <p className={`text-sm ${status === "error" ? "text-red-500" : "text-warm-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
