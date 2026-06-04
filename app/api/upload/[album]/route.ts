import fs from "fs";
import path from "path";
import sharp from "sharp";
import type { Photo } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ album: string }> }
) {
  const { album: albumSlug } = await params;

  const albumFile = path.join(
    process.cwd(),
    "content",
    "gallery",
    albumSlug,
    "album.json"
  );
  const imagesDir = path.join(process.cwd(), "public", "images", albumSlug);

  if (!fs.existsSync(albumFile)) {
    return Response.json({ error: "Album not found" }, { status: 404 });
  }

  fs.mkdirSync(imagesDir, { recursive: true });

  const formData = await request.formData();
  const files = formData.getAll("photos") as File[];

  if (files.length === 0) {
    return Response.json({ error: "No files provided" }, { status: 400 });
  }

  const album = JSON.parse(fs.readFileSync(albumFile, "utf8"));
  const existing = new Set<string>(album.photos.map((p: Photo) => p.filename));
  const added: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;

    fs.writeFileSync(path.join(imagesDir, filename), buffer);

    if (!existing.has(filename)) {
      const meta = await sharp(buffer).metadata();
      album.photos.push({
        filename,
        width: meta.width ?? 800,
        height: meta.height ?? 600,
      } satisfies Photo);
      existing.add(filename);
      added.push(filename);
    }
  }

  fs.writeFileSync(albumFile, JSON.stringify(album, null, 2));

  return Response.json({ added });
}
