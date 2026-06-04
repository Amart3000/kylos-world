import fs from "fs";
import path from "path";
import type { TimelineEvent } from "@/lib/types";

const EVENTS_FILE = path.join(process.cwd(), "content", "events", "events.json");

export async function PUT(request: Request) {
  const { ids } = (await request.json()) as { ids: string[] };

  if (!Array.isArray(ids)) {
    return Response.json({ error: "ids must be an array" }, { status: 400 });
  }

  const events: TimelineEvent[] = fs.existsSync(EVENTS_FILE)
    ? JSON.parse(fs.readFileSync(EVENTS_FILE, "utf8"))
    : [];

  const indexed = new Map(events.map((e) => [e.id, e]));
  const reordered = ids.map((id) => indexed.get(id)).filter(Boolean) as TimelineEvent[];

  // Preserve any events not included in ids at the end
  const inIds = new Set(ids);
  for (const e of events) {
    if (!inIds.has(e.id)) reordered.push(e);
  }

  fs.writeFileSync(EVENTS_FILE, JSON.stringify(reordered, null, 2));
  return Response.json({ ok: true });
}
