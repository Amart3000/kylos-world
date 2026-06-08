import { differenceInMonths, differenceInDays } from "date-fns";
import { siteConfig } from "@/lib/config";
import { getAllEvents } from "@/lib/events";
import { getAllJournalEntries } from "@/lib/journal";
import { getAllAlbums } from "@/lib/gallery";
import ForestMark from "@/components/ui/WolfMark";
import StatCounter from "@/components/home/StatCounter";

export default async function QuickStats() {
  const now = new Date();
  const months = differenceInMonths(now, siteConfig.birthdate);
  const days = differenceInDays(now, siteConfig.birthdate);

  const ageLabel =
    months < 1
      ? `${days} day${days !== 1 ? "s" : ""} old`
      : `${months} month${months !== 1 ? "s" : ""} old`;

  const events = await getAllEvents();
  const entries = await getAllJournalEntries();
  const albums = await getAllAlbums();

  const stats = [
    { value: ageLabel, label: "Right now" },
    { value: events.length.toString(), label: "Milestones" },
    { value: albums.length.toString(), label: "Albums" },
    { value: entries.length.toString(), label: "Letters" },
  ];

  return (
    <section className="relative bg-warm-100 py-16 px-4 overflow-hidden">
      {/* Decorative corner trees */}
      <ForestMark size={56} className="absolute left-2 top-1/2 -translate-y-1/2 text-warm-200 -rotate-6 pointer-events-none select-none" />
      <ForestMark size={48} className="absolute left-14 top-2 text-warm-200 rotate-3 pointer-events-none select-none" />
      <ForestMark size={56} className="absolute right-2 top-1/2 -translate-y-1/2 text-warm-200 rotate-6 pointer-events-none select-none" />
      <ForestMark size={48} className="absolute right-14 bottom-2 text-warm-200 -rotate-3 pointer-events-none select-none" />

      <div className="relative max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {stats.map(({ value, label }) => (
          <StatCounter key={label} value={value} label={label} />
        ))}
      </div>
    </section>
  );
}
