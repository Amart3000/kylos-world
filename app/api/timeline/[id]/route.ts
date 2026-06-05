import type { TimelineEvent } from "@/lib/types";
import { getAllEvents, saveEvents } from "@/lib/events";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<TimelineEvent>;

  const events = await getAllEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  events[idx] = {
    ...events[idx],
    ...(body.title?.trim()  ? { title: body.title.trim() }  : {}),
    ...(body.date           ? { date: body.date }            : {}),
    ...(body.category       ? { category: body.category }    : {}),
    note: body.note?.trim() || undefined,
  };

  await saveEvents(events);
  return Response.json({ event: events[idx] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const events = await getAllEvents();
  const filtered = events.filter((e) => e.id !== id);

  if (filtered.length === events.length) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  await saveEvents(filtered);
  return Response.json({ ok: true });
}
