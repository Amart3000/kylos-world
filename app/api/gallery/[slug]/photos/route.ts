import { NextResponse } from "next/server";
import { deletePhoto } from "@/lib/gallery";

type Params = { params: Promise<{ slug: string }> };

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
