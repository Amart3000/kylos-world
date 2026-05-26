import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { JournalMeta } from "@/lib/types";

export default function JournalCard({ entry }: { entry: JournalMeta }) {
  return (
    <Link
      href={`/journal/${entry.slug}`}
      className="group block p-6 rounded-2xl border border-warm-200 hover:border-warm-300 hover:shadow-md transition-all"
    >
      <p className="text-warm-400 text-xs mb-2">
        {format(parseISO(entry.date), "MMMM d, yyyy")} &middot; {entry.author}
      </p>
      <h3 className="font-heading text-xl text-warm-900 group-hover:text-accent transition-colors">
        {entry.title}
      </h3>
      {entry.excerpt && (
        <p className="mt-2 text-warm-600 text-sm leading-relaxed line-clamp-3">
          {entry.excerpt}
        </p>
      )}
      <p className="mt-4 text-accent text-sm font-medium">Read letter →</p>
    </Link>
  );
}
