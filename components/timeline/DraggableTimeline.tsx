"use client";

import { useState, useRef } from "react";
import { Reorder } from "framer-motion";
import { format, parseISO } from "date-fns";
import type { TimelineEvent } from "@/lib/types";
import NewEventForm from "./NewEventForm";

const categoryColors: Record<TimelineEvent["category"], string> = {
  milestone: "bg-amber-100 text-amber-800",
  first:     "bg-rose-100 text-rose-800",
  medical:   "bg-blue-100 text-blue-800",
  trip:      "bg-green-100 text-green-800",
  birthday:  "bg-purple-100 text-purple-800",
};

const categoryDots: Record<TimelineEvent["category"], string> = {
  milestone: "bg-amber-400",
  first:     "bg-rose-400",
  medical:   "bg-blue-400",
  trip:      "bg-green-400",
  birthday:  "bg-purple-400",
};

function GripIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="text-warm-300 hover:text-warm-500 transition-colors"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="2" height="2" rx="1" />
      <rect x="4" y="7" width="2" height="2" rx="1" />
      <rect x="4" y="11" width="2" height="2" rx="1" />
      <rect x="10" y="3" width="2" height="2" rx="1" />
      <rect x="10" y="7" width="2" height="2" rx="1" />
      <rect x="10" y="11" width="2" height="2" rx="1" />
    </svg>
  );
}

export default function DraggableTimeline({
  initialEvents,
}: {
  initialEvents: TimelineEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleReorder(newOrder: TimelineEvent[]) {
    setEvents(newOrder);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/timeline/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newOrder.map((e) => e.id) }),
      });
    }, 600);
  }

  function handleAdded(event: TimelineEvent) {
    setEvents((prev) => [...prev, event]);
  }

  return (
    <>
      <NewEventForm onAdded={handleAdded} />

      {events.length === 0 ? (
        <p className="text-warm-400 italic">No milestones yet — add one above.</p>
      ) : (
        <Reorder.Group
          axis="y"
          values={events}
          onReorder={handleReorder}
          className="outline-none"
        >
          {events.map((event) => (
            <Reorder.Item
              key={event.id}
              value={event}
              className="flex gap-4 cursor-default outline-none"
            >
              {/* Drag handle + timeline line */}
              <div className="flex flex-col items-center">
                <div className="cursor-grab active:cursor-grabbing mt-1 touch-none">
                  <GripIcon />
                </div>
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${categoryDots[event.category]}`} />
                <div className="w-px flex-1 bg-warm-200 mt-2" />
              </div>

              {/* Card */}
              <div className="pb-10 flex-1">
                <p className="text-warm-400 text-xs mb-1">
                  {format(parseISO(event.date), "MMMM d, yyyy")}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-xl text-warm-900">{event.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[event.category]}`}>
                    {event.category}
                  </span>
                </div>
                {event.note && (
                  <p className="mt-2 text-warm-600 leading-relaxed">{event.note}</p>
                )}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </>
  );
}
