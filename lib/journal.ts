import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { JournalMeta, JournalEntry } from "./types";

const JOURNAL_DIR = path.join(process.cwd(), "content", "journal");

function slugFromFilename(filename: string): string {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");
}

export function getAllJournalEntries(): JournalMeta[] {
  if (!fs.existsSync(JOURNAL_DIR)) return [];

  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".mdx"));

  const entries: JournalMeta[] = files.map((filename) => {
    const raw = fs.readFileSync(path.join(JOURNAL_DIR, filename), "utf8");
    const { data } = matter(raw);
    return {
      slug: slugFromFilename(filename),
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      author: data.author ?? "Mom & Dad",
      excerpt: data.excerpt,
      featured: data.featured ?? false,
    };
  });

  return entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export function getJournalEntryBySlug(slug: string): JournalEntry | null {
  if (!fs.existsSync(JOURNAL_DIR)) return null;

  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith(".mdx"));
  const filename = files.find((f) => slugFromFilename(f) === slug);
  if (!filename) return null;

  const raw = fs.readFileSync(path.join(JOURNAL_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date ?? "",
    author: data.author ?? "Mom & Dad",
    excerpt: data.excerpt,
    featured: data.featured ?? false,
    content,
  };
}
