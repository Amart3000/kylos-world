import { getAllEvents, saveEvents } from "@/lib/events";

export async function PUT(request: Request) {
  const { ids } = (await request.json()) as { ids: string[] };

  if (!Array.isArray(ids)) {
    return Response.json({ error: "ids must be an array" }, { status: 400 });
  }

  const events = await getAllEvents();
  const indexed = new Map(events.map((e) => [e.id, e]));
  const reordered = ids.map((id) => indexed.get(id)).filter(Boolean) as typeof events;

  const inIds = new Set(ids);
  for (const e of events) {
    if (!inIds.has(e.id)) reordered.push(e);
  }

  await saveEvents(reordered);
  return Response.json({ ok: true });
}
