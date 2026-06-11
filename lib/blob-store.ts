import { put, head, BlobNotFoundError } from "@vercel/blob";
import fs from "fs";
import path from "path";

export const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function readJson<T>(
  blobPath: string,
  fileFallback?: string
): Promise<T | null> {
  if (hasBlob) {
    try {
      // head() is strongly consistent for a known pathname (list() is not).
      // It also returns the current etag, which we use to bust any CDN cache.
      const meta = await head(blobPath);
      const bustUrl = `${meta.url}?_t=${Date.now()}&_e=${encodeURIComponent(meta.etag)}`;
      const res = await fetch(bustUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (!res.ok) throw new Error(`Blob fetch ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      // Missing blob is expected on first run — fall through to file fallback.
      if (!(err instanceof BlobNotFoundError)) {
        console.error("[blob-store] readJson failed:", blobPath, err);
      }
    }
  }

  if (fileFallback && fs.existsSync(fileFallback)) {
    return JSON.parse(fs.readFileSync(fileFallback, "utf8")) as T;
  }
  return null;
}

export async function writeJson<T>(
  blobPath: string,
  fileFallback: string | undefined,
  data: T
): Promise<void> {
  if (hasBlob) {
    // allowOverwrite replaces in-place without a separate del step.
    // cacheControlMaxAge:0 ensures CDN never serves stale content.
    await put(blobPath, JSON.stringify(data, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return;
  }

  if (fileFallback) {
    fs.mkdirSync(path.dirname(fileFallback), { recursive: true });
    fs.writeFileSync(fileFallback, JSON.stringify(data, null, 2));
  }
}
