import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { JournalMeta, JournalEntry } from "./types";
import { hasBlob, readJson, writeJson } from "./blob-store";

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");
const BLOB_PATH = "data/journal/entries.json";

function slugFromFilename(filename: string): string {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");
}

function loadEntriesFromFiles(): JournalEntry[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];
  return fs
    .readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(JOURNAL_DIR, filename), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: slugFromFilename(filename),
        title: data.title ?? "Untitled",
        date: data.date ?? "",
        author: data.author ?? "Mom & Dad",
        excerpt: data.excerpt,
        featured: data.featured ?? false,
        content,
      } satisfies JournalEntry;
    });
}

async function getAllEntries(): Promise<JournalEntry[]> {
  const entries = await readJson<JournalEntry[]>(BLOB_PATH);
  return entries ?? loadEntriesFromFiles();
}

export async function getAllJournalEntries(): Promise<JournalMeta[]> {
  const entries = await getAllEntries();
  return entries
    .map(({ slug, title, date, author, excerpt, featured }) => ({
      slug, title, date, author, excerpt, featured,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export async function getJournalEntryBySlug(slug: string): Promise<JournalEntry | null> {
  const entries = await getAllEntries();
  return entries.find((e) => e.slug === slug) ?? null;
}

export async function updateJournalEntry(
  slug: string,
  updates: Partial<Pick<JournalEntry, "title" | "author" | "excerpt" | "content">>
): Promise<void> {
  if (hasBlob) {
    const entries = await getAllEntries();
    const idx = entries.findIndex((e) => e.slug === slug);
    if (idx === -1) throw new Error("Entry not found");
    entries[idx] = {
      ...entries[idx],
      ...(updates.title?.trim() ? { title: updates.title.trim() } : {}),
      ...(updates.author?.trim() ? { author: updates.author.trim() } : {}),
      excerpt: updates.excerpt?.trim() || undefined,
      ...(updates.content?.trim() ? { content: updates.content.trim() } : {}),
    };
    await writeJson(BLOB_PATH, undefined, entries);
  } else {
    if (!fs.existsSync(JOURNAL_DIR)) throw new Error("Entry not found");
    const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".mdx"));
    const filename = files.find((f) => slugFromFilename(f) === slug);
    if (!filename) throw new Error("Entry not found");
    const filePath = path.join(JOURNAL_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const mergedTitle = updates.title?.trim() || (data.title as string);
    const mergedAuthor = updates.author?.trim() || (data.author as string);
    const mergedExcerpt = updates.excerpt?.trim() || undefined;
    const newContent = updates.content?.trim() ?? content;
    const frontmatter = [
      "---",
      `title: ${JSON.stringify(mergedTitle)}`,
      `date: ${JSON.stringify(data.date as string)}`,
      `author: ${JSON.stringify(mergedAuthor)}`,
      mergedExcerpt ? `excerpt: ${JSON.stringify(mergedExcerpt)}` : null,
      "---",
    ].filter(Boolean).join("\n");
    fs.writeFileSync(filePath, `${frontmatter}\n\n${newContent}\n`);
  }
}

export async function deleteJournalEntry(slug: string): Promise<void> {
  if (hasBlob) {
    const entries = await getAllEntries();
    const filtered = entries.filter((e) => e.slug !== slug);
    if (filtered.length === entries.length) throw new Error("Entry not found");
    await writeJson(BLOB_PATH, undefined, filtered);
  } else {
    if (!fs.existsSync(JOURNAL_DIR)) throw new Error("Entry not found");
    const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".mdx"));
    const filename = files.find((f) => slugFromFilename(f) === slug);
    if (!filename) throw new Error("Entry not found");
    fs.unlinkSync(path.join(JOURNAL_DIR, filename));
  }
}

export async function addJournalEntry(entry: JournalEntry): Promise<void> {
  if (hasBlob) {
    const entries = await getAllEntries();
    entries.push(entry);
    await writeJson(BLOB_PATH, undefined, entries);
  } else {
    const filename = `${entry.date}-${entry.slug}.mdx`;
    const filePath = path.join(JOURNAL_DIR, filename);
    const frontmatter = [
      "---",
      `title: ${JSON.stringify(entry.title)}`,
      `date: ${JSON.stringify(entry.date)}`,
      `author: ${JSON.stringify(entry.author)}`,
      entry.excerpt ? `excerpt: ${JSON.stringify(entry.excerpt)}` : null,
      "---",
    ]
      .filter(Boolean)
      .join("\n");
    fs.mkdirSync(JOURNAL_DIR, { recursive: true });
    fs.writeFileSync(filePath, `${frontmatter}\n\n${entry.content.trim()}\n`);
  }
}
