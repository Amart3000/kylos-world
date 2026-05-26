import type { JournalMeta } from "@/lib/types";
import JournalCard from "./JournalCard";

export default function JournalList({ entries }: { entries: JournalMeta[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-warm-400 italic">No letters yet — check back soon.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {entries.map((entry) => (
        <JournalCard key={entry.slug} entry={entry} />
      ))}
    </div>
  );
}
