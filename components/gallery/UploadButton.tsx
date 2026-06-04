"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "uploading" | "done" | "error";

export default function UploadButton({ albumSlug }: { albumSlug: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append("photos", file);
    }

    setStatus("uploading");
    setMessage(`Uploading ${files.length} photo${files.length !== 1 ? "s" : ""}…`);

    try {
      const res = await fetch(`/api/upload/${albumSlug}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const count = data.added.length;
      setStatus("done");
      setMessage(`${count} photo${count !== 1 ? "s" : ""} added!`);
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Upload failed — please try again.");
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
        <p
          className={`text-sm ${
            status === "error" ? "text-red-500" : "text-warm-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
