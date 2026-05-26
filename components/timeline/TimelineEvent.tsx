import { format, parseISO } from "date-fns";
import type { TimelineEvent } from "@/lib/types";

const categoryColors: Record<TimelineEvent["category"], string> = {
  milestone: "bg-amber-100 text-amber-800",
  first: "bg-rose-100 text-rose-800",
  medical: "bg-blue-100 text-blue-800",
  trip: "bg-green-100 text-green-800",
  birthday: "bg-purple-100 text-purple-800",
};

const categoryDots: Record<TimelineEvent["category"], string> = {
  milestone: "bg-amber-400",
  first: "bg-rose-400",
  medical: "bg-blue-400",
  trip: "bg-green-400",
  birthday: "bg-purple-400",
};

export default function TimelineEventCard({ event }: { event: TimelineEvent }) {
  const formattedDate = format(parseISO(event.date), "MMMM d, yyyy");
  const pillClass = categoryColors[event.category];
  const dotClass = categoryDots[event.category];

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${dotClass}`} />
        <div className="w-px flex-1 bg-warm-200 mt-2" />
      </div>
      <div className="pb-10">
        <p className="text-warm-400 text-xs mb-1">{formattedDate}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-heading text-xl text-warm-900">{event.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pillClass}`}>
            {event.category}
          </span>
        </div>
        {event.note && (
          <p className="mt-2 text-warm-600 leading-relaxed">{event.note}</p>
        )}
      </div>
    </div>
  );
}
