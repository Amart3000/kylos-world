"use client";

import { useState, useRef } from "react";
import { Reorder } from "framer-motion";
import { format, parseISO } from "date-fns";
import type { TimelineEvent } from "@/lib/types";
import NewEventForm from "./NewEventForm";

const CATEGORIES: TimelineEvent["category"][] = [
  "milestone", "first", "medical", "trip", "birthday",
];

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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="4" y="3" width="2" height="2" rx="1" />
      <rect x="4" y="7" width="2" height="2" rx="1" />
      <rect x="4" y="11" width="2" height="2" rx="1" />
      <rect x="10" y="3" width="2" height="2" rx="1" />
      <rect x="10" y="7" width="2" height="2" rx="1" />
      <rect x="10" y="11" width="2" height="2" rx="1" />
    </svg>
  );
}

type Draft = { title: string; date: string; category: TimelineEvent["category"]; note: string };

export default function DraggableTimeline({ initialEvents }: { initialEvents: TimelineEvent[] }) {
  const [events, setEvents] = useState(initialEvents);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // editing / deleting state
  const [editingId, setEditingId]           = useState<string | null>(null);
  const [draft, setDraft]                   = useState<Draft>({ title: "", date: "", category: "milestone", note: "" });
  const [saving, setSaving]                 = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  /* ── reorder ── */
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

  /* ── create ── */
  function handleAdded(event: TimelineEvent) {
    setEvents((prev) => [...prev, event]);
  }

  /* ── edit ── */
  function startEdit(event: TimelineEvent) {
    setDraft({ title: event.title, date: event.date, category: event.category, note: event.note ?? "" });
    setEditingId(event.id);
    setConfirmDeleteId(null);
  }

  async function saveEdit(id: string) {
    setSaving(true);
    const res = await fetch(`/api/timeline/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      const { event } = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === id ? event : e)));
      setEditingId(null);
    }
    setSaving(false);
  }

  /* ── delete ── */
  async function confirmDelete(id: string) {
    const res = await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setConfirmDeleteId(null);
    }
  }

  return (
    <>
      <NewEventForm onAdded={handleAdded} />

      {events.length === 0 ? (
        <p className="text-warm-400 italic">No milestones yet — add one above.</p>
      ) : (
        <Reorder.Group axis="y" values={events} onReorder={handleReorder} className="outline-none">
          {events.map((event) => {
            const isEditing = editingId === event.id;
            const isConfirmingDelete = confirmDeleteId === event.id;

            return (
              <Reorder.Item
                key={event.id}
                value={event}
                className="flex gap-4 cursor-default outline-none"
              >
                {/* Grip + dot + line */}
                <div className="flex flex-col items-center">
                  <div className="cursor-grab active:cursor-grabbing mt-1 touch-none text-warm-300 hover:text-warm-500 transition-colors">
                    <GripIcon />
                  </div>
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${categoryDots[event.category]}`} />
                  <div className="w-px flex-1 bg-warm-200 mt-2" />
                </div>

                {/* Card body */}
                <div className="pb-10 flex-1">
                  {isEditing ? (
                    /* ── Inline edit form ── */
                    <div className="rounded-xl border border-warm-200 bg-warm-50 p-4 space-y-3">
                      <input
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        placeholder="Title"
                        className="w-full rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={draft.date}
                          onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                          className="rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <select
                          value={draft.category}
                          onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as TimelineEvent["category"] }))}
                          className="rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-sm text-warm-900 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        value={draft.note}
                        onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                        placeholder="Note (optional)"
                        className="w-full rounded-lg border border-warm-200 bg-white px-3 py-1.5 text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-sm text-warm-500 hover:text-warm-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(event.id)}
                          disabled={saving}
                          className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {saving ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Read view ── */
                    <div className="group">
                      <p className="text-warm-400 text-xs mb-1">
                        {format(parseISO(event.date), "MMMM d, yyyy")}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading text-xl text-warm-900">{event.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[event.category]}`}>
                          {event.category}
                        </span>
                        {/* Action buttons */}
                        <div className="flex gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(event)}
                            title="Edit"
                            className="p-1 rounded text-warm-400 hover:text-accent transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 2l3 3-9 9H2v-3l9-9z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => { setConfirmDeleteId(event.id); setEditingId(null); }}
                            title="Delete"
                            className="p-1 rounded text-warm-400 hover:text-red-500 transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 4 13 4" />
                              <path d="M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
                              <path d="M6 7v5M10 7v5" />
                              <rect x="2" y="4" width="12" height="10" rx="1" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {event.note && (
                        <p className="mt-2 text-warm-600 leading-relaxed">{event.note}</p>
                      )}

                      {/* Delete confirmation */}
                      {isConfirmingDelete && (
                        <div className="mt-3 flex items-center gap-3">
                          <span className="text-sm text-warm-600">Delete this entry?</span>
                          <button
                            onClick={() => confirmDelete(event.id)}
                            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-sm text-warm-400 hover:text-warm-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </>
  );
}
