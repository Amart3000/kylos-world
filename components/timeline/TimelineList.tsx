import type { TimelineEvent } from "@/lib/types";
import TimelineEventCard from "./TimelineEvent";

export default function TimelineList({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-warm-400 italic">
        No milestones yet — check back soon.
      </p>
    );
  }

  return (
    <div>
      {events.map((event) => (
        <TimelineEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
