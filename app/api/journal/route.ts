import fs from "fs";
import path from "path";

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

  const today = new Date().toISOString().slice(0, 10);
  const slug = toSlug(title) || "entry";
  const filename = `${today}-${slug}.mdx`;
  const journalDir = path.join(process.cwd(), "content", "journal");

  fs.mkdirSync(journalDir, { recursive: true });

  const filePath = path.join(journalDir, filename);
  if (fs.existsSync(filePath)) {
    return Response.json({ error: "An entry with that title already exists for today" }, { status: 409 });
  }

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(title.trim())}`,
    `date: ${JSON.stringify(today)}`,
    `author: ${JSON.stringify(author.trim())}`,
    excerpt?.trim() ? `excerpt: ${JSON.stringify(excerpt.trim())}` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  fs.writeFileSync(filePath, `${frontmatter}\n\n${content.trim()}\n`);

  return Response.json({ slug });
}
