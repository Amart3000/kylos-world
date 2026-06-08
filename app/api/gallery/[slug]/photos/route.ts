import { NextResponse } from "next/server";
import { deletePhoto, getAlbumBySlug, saveAlbum } from "@/lib/gallery";
import type { Photo } from "@/lib/types";

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const { filename, width, height } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "filename is required" }, { status: 400 });
    }

    const album = await getAlbumBySlug(slug);
    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const existing = new Set(album.photos.map((p: Photo) => p.filename));
    if (!existing.has(filename)) {
      album.photos.push({ filename, width: width || 800, height: height || 600 });
      if (!album.coverPhoto) album.coverPhoto = filename;
      await saveAlbum(album);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/gallery/[slug]/photos] POST failed:", err);
    return NextResponse.json({ error: "Failed to add photo" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json({ error: "filename is required" }, { status: 400 });
    }

    await deletePhoto(slug, filename);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/gallery/[slug]/photos] DELETE failed:", err);
    if (msg.includes("not found")) {
      return NextResponse.json({ error: msg }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
