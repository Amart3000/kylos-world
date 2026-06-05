import fs from "fs";
import path from "path";
import type { TimelineEvent } from "@/lib/types";

const EVENTS_FILE = path.join(process.cwd(), "content", "events", "events.json");

function readEvents(): TimelineEvent[] {
  if (!fs.existsSync(EVENTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"));
}

function writeEvents(events: TimelineEvent[]) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as Partial<TimelineEvent>;

  const events = readEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  events[idx] = {
    ...events[idx],
    ...(body.title?.trim()   ? { title: body.title.trim() }   : {}),
    ...(body.date            ? { date: body.date }             : {}),
    ...(body.category        ? { category: body.category }     : {}),
    note: body.note?.trim() || undefined,
  };

  writeEvents(events);
  return Response.json({ event: events[idx] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const events = readEvents();
  const filtered = events.filter((e) => e.id !== id);

  if (filtered.length === events.length) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  writeEvents(filtered);
  return Response.json({ ok: true });
}
