import fs from "fs";
import path from "path";
import type { Photo } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ album: string }> }
) {
  const { album: albumSlug } = await params;

  const albumFile = path.join(
    process.cwd(),
    "content",
    "gallery",
    albumSlug,
    "album.json"
  );

  if (!fs.existsSync(albumFile)) {
    return Response.json({ error: "Album not found" }, { status: 404 });
  }

  const { filename, caption } = (await request.json()) as {
    filename: string;
    caption: string;
  };

  if (!filename) {
    return Response.json({ error: "filename is required" }, { status: 400 });
  }

  const album = JSON.parse(fs.readFileSync(albumFile, "utf8"));
  const photo = album.photos.find((p: Photo) => p.filename === filename);

  if (!photo) {
    return Response.json({ error: "Photo not found" }, { status: 404 });
  }

  if (caption.trim()) {
    photo.caption = caption.trim();
  } else {
    delete photo.caption;
  }

  fs.writeFileSync(albumFile, JSON.stringify(album, null, 2));

  return Response.json({ ok: true });
}
