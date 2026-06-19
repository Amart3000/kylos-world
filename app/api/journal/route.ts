import { addJournalEntry } from "@/lib/journal";
import type { JournalEntry } from "@/lib/types";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, author, excerpt, content } = body as {
    title: string;
    author: string;
    excerpt?: string;
    content: string;
  };

  if (!title?.trim() || !author?.trim() || !content?.trim()) {
    return Response.json({ error: "title, author, and content are required" }, { status: 400 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const slug = toSlug(title) || "entry";

    const entry: JournalEntry = {
      slug,
      title: title.trim(),
      date: today,
      author: author.trim(),
      excerpt: excerpt?.trim() || undefined,
      featured: false,
      content: content.trim(),
    };

    const savedSlug = await addJournalEntry(entry);
    return Response.json({ slug: savedSlug });
  } catch (err) {
    console.error("[journal POST]", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
