import type { Photo } from "@/lib/types";
import { getAlbumBySlug, saveAlbum } from "@/lib/gallery";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ album: string }> }
) {
  const { album: albumSlug } = await params;

  try {
    const album = await getAlbumBySlug(albumSlug);
    if (!album) {
      return Response.json({ error: "Album not found" }, { status: 404 });
    }

    const { filename, caption } = (await request.json()) as {
      filename: string;
      caption: string;
    };

    if (!filename) {
      return Response.json({ error: "filename is required" }, { status: 400 });
    }

    const photo = album.photos.find((p: Photo) => p.filename === filename);
    if (!photo) {
      return Response.json({ error: "Photo not found" }, { status: 404 });
    }

    if (caption.trim()) {
      photo.caption = caption.trim();
    } else {
      delete photo.caption;
    }

    await saveAlbum(album);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[caption PATCH]", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
