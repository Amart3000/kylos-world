import { put, list, del, BlobNotFoundError } from "@vercel/blob";

export const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// --- Versioned (anti-CDN-cache) reads/writes ---
//
// Vercel's public blob CDN ignores cache-bust query strings on a fixed path:
// each edge holds its own (sometimes-stale) snapshot for ~60s+, and different
// regions can serve different snapshots. The only reliable workaround is to
// give every write a unique URL via addRandomSuffix:true. The newest blob
// under a known prefix is the "current" version. Older blobs hang around as
// backups (useful when a save mysteriously vanishes).

type VersionedReadResult<T> = {
  data: T;
  pathname: string;
};

// Vercel's addRandomSuffix inserts the suffix *before* the extension, so
// `path/name.json` becomes `path/name-<random>.json`. To list every version,
// we match the prefix `path/name-`.
function listPrefixFor(basePath: string): string {
  const lastDot = basePath.lastIndexOf(".");
  if (lastDot < 0) return `${basePath}-`;
  return `${basePath.slice(0, lastDot)}-`;
}

export async function readJsonVersioned<T>(
  basePath: string
): Promise<VersionedReadResult<T> | null> {
  if (!hasBlob) return null;
  const prefix = listPrefixFor(basePath);
  try {
    const { blobs } = await list({ prefix });
    if (blobs.length === 0) return null;
    // Latest write wins. uploadedAt is set server-side on put().
    blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const latest = blobs[0];
    // The URL is unique (random suffix) so no CDN edge has it cached yet.
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Versioned blob fetch ${res.status} ${latest.pathname}`);
    const data = (await res.json()) as T;
    return { data, pathname: latest.pathname };
  } catch (err) {
    if (!(err instanceof BlobNotFoundError)) {
      console.error("[blob-store] readJsonVersioned failed:", prefix, err);
    }
    return null;
  }
}

// Write a new versioned blob. Best-effort prunes older snapshots beyond
// `keepBackups` so blob storage doesn't grow unbounded.
export async function writeJsonVersioned<T>(
  basePath: string,
  data: T,
  keepBackups = 5
): Promise<{ pathname: string }> {
  if (!hasBlob) throw new Error("writeJsonVersioned requires BLOB_READ_WRITE_TOKEN");
  const result = await put(basePath, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 0,
  });

  try {
    const prefix = listPrefixFor(basePath);
    const { blobs } = await list({ prefix });
    blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
    const stale = blobs.slice(keepBackups + 1);
    if (stale.length > 0) {
      await del(stale.map((b) => b.url));
    }
  } catch (err) {
    console.warn("[blob-store] writeJsonVersioned prune failed:", basePath, err);
  }

  return { pathname: result.pathname };
}

// Newest-first list of every snapshot under the same base path. Useful for
// recovery: each save leaves the previous N snapshots intact as backups.
export async function listVersionedBackups(basePath: string) {
  if (!hasBlob) return [];
  const { blobs } = await list({ prefix: listPrefixFor(basePath) });
  blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  return blobs;
}
