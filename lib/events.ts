import path from "path";
import type { TimelineEvent } from "./types";
import { readJson, writeJson } from "./blob-store";

const BLOB_PATH = "data/events.json";
const FILE_PATH = path.join(process.cwd(), "content", "events", "events.json");

export async function getAllEvents(): Promise<TimelineEvent[]> {
  return (await readJson<TimelineEvent[]>(BLOB_PATH, FILE_PATH)) ?? [];
}

export async function saveEvents(events: TimelineEvent[]): Promise<void> {
  await writeJson(BLOB_PATH, FILE_PATH, events);
}
