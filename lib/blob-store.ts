import { put, list, del } from "@vercel/blob";
import fs from "fs";
import path from "path";

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function readJson<T>(
  blobPath: string,
  fileFallback: string
): Promise<T | null> {
  if (hasBlob) {
    try {
      const { blobs } = await list({ prefix: blobPath });
      const match = blobs.find((b) => b.pathname === blobPath);
      if (match) {
        const res = await fetch(match.url, { cache: "no-store" });
        return (await res.json()) as T;
      }
    } catch {}
  }

  if (fs.existsSync(fileFallback)) {
    return JSON.parse(fs.readFileSync(fileFallback, "utf8")) as T;
  }
  return null;
}

export async function writeJson<T>(
  blobPath: string,
  fileFallback: string,
  data: T
): Promise<void> {
  if (hasBlob) {
    // Remove existing blob at this path before writing the new one
    const { blobs } = await list({ prefix: blobPath });
    const existing = blobs.find((b) => b.pathname === blobPath);
    if (existing) await del(existing.url);

    await put(blobPath, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return;
  }

  // Local file fallback
  fs.mkdirSync(path.dirname(fileFallback), { recursive: true });
  fs.writeFileSync(fileFallback, JSON.stringify(data, null, 2));
}
