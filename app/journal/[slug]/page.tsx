import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getJournalEntryBySlug } from "@/lib/journal";
import PageWrapper from "@/components/layout/PageWrapper";
import EntryActions from "@/components/journal/EntryActions";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry) return {};
  return { title: entry.title, description: entry.excerpt };
}

export default async function JournalEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = await getJournalEntryBySlug(slug);
  if (!entry) notFound();

  return (
    <PageWrapper className="max-w-2xl">
      <div className="mb-6">
        <Link href="/journal" className="text-warm-400 text-sm hover:text-accent transition-colors">
          ← All letters
        </Link>
      </div>

      <header className="mb-8 border-b border-warm-200 pb-6">
        <h1 className="font-heading text-4xl text-warm-900 leading-tight">
          {entry.title}
        </h1>
        <p className="text-warm-400 text-sm mt-2">
          {format(parseISO(entry.date), "MMMM d, yyyy")} &middot; Written by {entry.author}
        </p>
        <EntryActions entry={entry} />
      </header>

      <div className="prose prose-lg max-w-none">
        <MDXRemote source={entry.content} />
      </div>
    </PageWrapper>
  );
}
