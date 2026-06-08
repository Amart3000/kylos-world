import fs from "fs";
import path from "path";
import type { GalleryAlbum } from "./types";
import { hasBlob, readJson, writeJson } from "./blob-store";
import { del } from "@vercel/blob";

const GALLERY_DIR = path.join(process.cwd(), "content", "gallery");
const BLOB_PATH = "data/gallery/albums.json";

function loadAlbumsFromFiles(): GalleryAlbum[] {
  if (!fs.existsSync(GALLERY_DIR)) return [];
  const slugs = fs
    .readdirSync(GALLERY_DIR)
    .filter((entry) => fs.statSync(path.join(GALLERY_DIR, entry)).isDirectory());
  return slugs
    .map((slug) => {
      const albumFile = path.join(GALLERY_DIR, slug, "album.json");
      if (!fs.existsSync(albumFile)) return null;
      return JSON.parse(fs.readFileSync(albumFile, "utf8")) as GalleryAlbum;
    })
    .filter(Boolean) as GalleryAlbum[];
}

export async function getAllAlbums(): Promise<GalleryAlbum[]> {
  const albums = await readJson<GalleryAlbum[]>(BLOB_PATH);
  const list = albums ?? loadAlbumsFromFiles();
  return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getAlbumBySlug(slug: string): Promise<GalleryAlbum | null> {
  const albums = await getAllAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}

export async function saveAlbum(album: GalleryAlbum): Promise<void> {
  const albums = await getAllAlbums();
  const idx = albums.findIndex((a) => a.slug === album.slug);
  if (idx === -1) albums.push(album);
  else albums[idx] = album;

  if (hasBlob) {
    await writeJson(BLOB_PATH, undefined, albums);
  } else {
    const filePath = path.join(GALLERY_DIR, album.slug, "album.json");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(album, null, 2));
  }
}

export async function deleteAlbum(slug: string): Promise<void> {
  const albums = await getAllAlbums();
  const filtered = albums.filter((a) => a.slug !== slug);

  if (hasBlob) {
    await writeJson(BLOB_PATH, undefined, filtered);
  } else {
    const albumDir = path.join(GALLERY_DIR, slug);
    if (fs.existsSync(albumDir)) fs.rmSync(albumDir, { recursive: true });
  }
}

export async function deletePhoto(albumSlug: string, filename: string): Promise<void> {
  const album = await getAlbumBySlug(albumSlug);
  if (!album) throw new Error("Album not found");

  album.photos = album.photos.filter((p) => p.filename !== filename);
  if (album.coverPhoto === filename) {
    album.coverPhoto = album.photos[0]?.filename ?? "";
  }

  if (hasBlob && filename.startsWith("https://")) {
    await del(filename);
  }

  await saveAlbum(album);
}
