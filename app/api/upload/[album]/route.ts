import sharp from "sharp";
import { put } from "@vercel/blob";
import type { Photo } from "@/lib/types";
import { getAlbumBySlug, saveAlbum } from "@/lib/gallery";

export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ album: string }> }
) {
  const { album: albumSlug } = await params;

  try {
    const album = await getAlbumBySlug(albumSlug);
    if (!album) {
      return Response.json({ error: `Album "${albumSlug}" not found` }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll("photos") as File[];

    if (files.length === 0) {
      return Response.json({ error: "No files provided" }, { status: 400 });
    }

    const existing = new Set<string>(album.photos.map((p: Photo) => p.filename));
    const added: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      const blob = await put(`gallery/${albumSlug}/${file.name}`, buffer, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      const blobUrl = blob.url;

      if (!existing.has(blobUrl)) {
        let width = 800;
        let height = 600;
        try {
          const meta = await sharp(buffer).metadata();
          width = meta.width ?? 800;
          height = meta.height ?? 600;
        } catch (sharpErr) {
          console.warn("[upload] sharp metadata failed, using defaults:", sharpErr);
        }

        album.photos.push({ filename: blobUrl, width, height } satisfies Photo);
        if (!album.coverPhoto) album.coverPhoto = blobUrl;
        existing.add(blobUrl);
        added.push(file.name);
      }
    }

    await saveAlbum(album);
    return Response.json({ added });
  } catch (err) {
    console.error("[upload POST]", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
