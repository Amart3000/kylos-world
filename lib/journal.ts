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
