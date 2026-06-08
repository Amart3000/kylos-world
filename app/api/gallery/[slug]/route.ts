import { NextResponse } from "next/server";
import { getAlbumBySlug, saveAlbum, deleteAlbum } from "@/lib/gallery";

type Params = { params: Promise<{ slug: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const { title, description, date } = await req.json();

    const album = await getAlbumBySlug(slug);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    if (title?.trim()) album.title = title.trim();
    if (description !== undefined) album.description = description?.trim() || undefined;
    if (date) album.date = date;

    await saveAlbum(album);
    return NextResponse.json(album);
  } catch (err) {
    console.error("[api/gallery/[slug]] PATCH failed:", err);
    return NextResponse.json({ error: "Failed to update album" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const album = await getAlbumBySlug(slug);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    await deleteAlbum(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/gallery/[slug]] DELETE failed:", err);
    return NextResponse.json({ error: "Failed to delete album" }, { status: 500 });
  }
}
