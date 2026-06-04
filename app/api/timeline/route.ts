import fs from "fs";
import path from "path";
import type { TimelineEvent } from "@/lib/types";

const EVENTS_FILE = path.join(process.cwd(), "content", "events", "events.json");

function toId(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 40) +
    "-" +
    Date.now().toString(36)
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, date, category, note } = body as {
    title: string;
    date: string;
    category: TimelineEvent["category"];
    note?: string;
  };

  if (!title?.trim() || !date || !category) {
    return Response.json({ error: "title, date, and category are required" }, { status: 400 });
  }

  const events: TimelineEvent[] = fs.existsSync(EVENTS_FILE)
    ? JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"))
    : [];

  const newEvent: TimelineEvent = {
    id: toId(title),
    title: title.trim(),
    date,
    category,
    ...(note?.trim() ? { note: note.trim() } : {}),
  };

  events.push(newEvent);
  fs.mkdirSync(path.dirname(EVENTS_FILE), { recursive: true });
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));

  return Response.json({ event: newEvent });
}
