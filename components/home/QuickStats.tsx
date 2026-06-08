import { differenceInMonths, differenceInDays } from "date-fns";
import { siteConfig } from "@/lib/config";
import { getAllEvents } from "@/lib/events";
import { getAllJournalEntries } from "@/lib/journal";
import { getAllAlbums } from "@/lib/gallery";
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
    <section className="relative py-16 px-4 pb-24">
      <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {stats.map(({ value, label }) => (
          <StatCounter key={label} value={value} label={label} />
        ))}
      </div>
    </section>
  );
}
