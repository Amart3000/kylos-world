import fs from "fs";
import path from "path";
import type { TimelineEvent } from "./types";

const EVENTS_FILE = path.join(process.cwd(), "content", "events", "events.json");

export function getAllEvents(): TimelineEvent[] {
  if (!fs.existsSync(EVENTS_FILE)) return [];

  const raw = fs.readFileSync(EVENTS_FILE, "utf8");
  const events: TimelineEvent[] = JSON.parse(raw);

  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
