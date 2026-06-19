import fs from "fs";
import path from "path";
import type { TimelineEvent } from "./types";
import { hasBlob, readJsonVersioned, writeJsonVersioned } from "./blob-store";

const BLOB_WRITE_PATH = "data/events.json";
const FILE_PATH = path.join(process.cwd(), "content", "events", "events.json");

export async function getAllEvents(): Promise<TimelineEvent[]> {
  if (hasBlob) {
    const result = await readJsonVersioned<TimelineEvent[]>(BLOB_WRITE_PATH);
    if (result) return result.data;
  }
  if (fs.existsSync(FILE_PATH)) {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as TimelineEvent[];
  }
  return [];
}

export async function saveEvents(events: TimelineEvent[]): Promise<void> {
  if (hasBlob) {
    await writeJsonVersioned(BLOB_WRITE_PATH, events);
    return;
  }
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(events, null, 2));
}
