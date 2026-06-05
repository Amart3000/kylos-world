import sharp from "sharp";
import { put } from "@vercel/blob";
import type { Photo } from "@/lib/types";
import { getAlbumBySlug, saveAlbum } from "@/lib/gallery";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ album: string }> }
) {
  const { album: albumSlug } = await params;
  const album = await getAlbumBySlug(albumSlug);

  if (!album) {
    return Response.json({ error: "Album not found" }, { status: 404 });
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

    const blob = await put(`${albumSlug}/${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    const blobUrl = blob.url;

    if (!existing.has(blobUrl)) {
      const meta = await sharp(buffer).metadata();
      album.photos.push({
        filename: blobUrl,
        width: meta.width ?? 800,
        height: meta.height ?? 600,
      } satisfies Photo);
      existing.add(blobUrl);
      added.push(file.name);
    }
  }

  await saveAlbum(album);
  return Response.json({ added });
}
