import { updateJournalEntry, deleteJournalEntry } from "@/lib/journal";
import type { JournalEntry } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = (await request.json()) as Partial<Pick<JournalEntry, "title" | "author" | "excerpt" | "content">>;

  try {
    await updateJournalEntry(slug, body);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[journal PATCH]", err);
    const msg = String(err);
    return Response.json({ error: msg }, { status: msg.includes("not found") ? 404 : 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await deleteJournalEntry(slug);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[journal DELETE]", err);
    const msg = String(err);
    return Response.json({ error: msg }, { status: msg.includes("not found") ? 404 : 500 });
  }
}
