import { differenceInMonths, differenceInDays } from "date-fns";
import { siteConfig } from "@/lib/config";
import { getAllEvents } from "@/lib/events";
import { getAllJournalEntries } from "@/lib/journal";
import { getAllAlbums } from "@/lib/gallery";

export default function QuickStats() {
  const now = new Date();
  const months = differenceInMonths(now, siteConfig.birthdate);
  const days = differenceInDays(now, siteConfig.birthdate);

  const ageLabel =
    months < 1
      ? `${days} day${days !== 1 ? "s" : ""} old`
      : `${months} month${months !== 1 ? "s" : ""} old`;

  const events = getAllEvents();
  const entries = getAllJournalEntries();
  const albums = getAllAlbums();

  const stats = [
    { value: ageLabel, label: "Right now" },
    { value: events.length.toString(), label: "Milestones" },
    { value: albums.length.toString(), label: "Albums" },
    { value: entries.length.toString(), label: "Letters" },
  ];

  return (
    <section className="bg-warm-100 py-12 px-4">
      <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map(({ value, label }) => (
          <div key={label}>
            <p className="font-heading text-3xl text-warm-900">{value}</p>
            <p className="text-warm-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
