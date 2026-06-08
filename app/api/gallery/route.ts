import { NextResponse } from "next/server";
import { saveAlbum } from "@/lib/gallery";
import type { GalleryAlbum } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { title, date, description } = await req.json();
    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const album: GalleryAlbum = {
      slug,
      title: title.trim(),
      date: date || new Date().toISOString().split("T")[0],
      description: description?.trim() || undefined,
      coverPhoto: "",
      photos: [],
    };

    await saveAlbum(album);
    return NextResponse.json(album, { status: 201 });
  } catch (err) {
    console.error("[api/gallery] POST failed:", err);
    return NextResponse.json({ error: "Failed to create album" }, { status: 500 });
  }
}
