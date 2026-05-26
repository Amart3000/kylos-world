import fs from "fs";
import path from "path";
import type { GalleryAlbum } from "./types";

const GALLERY_DIR = path.join(process.cwd(), "content", "gallery");

export function getAllAlbums(): GalleryAlbum[] {
  if (!fs.existsSync(GALLERY_DIR)) return [];

  const slugs = fs
    .readdirSync(GALLERY_DIR)
    .filter((entry) =>
      fs.statSync(path.join(GALLERY_DIR, entry)).isDirectory()
    );

  const albums: GalleryAlbum[] = slugs
    .map((slug) => {
      const albumFile = path.join(GALLERY_DIR, slug, "album.json");
      if (!fs.existsSync(albumFile)) return null;
      const raw = fs.readFileSync(albumFile, "utf8");
      return JSON.parse(raw) as GalleryAlbum;
    })
    .filter(Boolean) as GalleryAlbum[];

  return albums.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getAlbumBySlug(slug: string): GalleryAlbum | null {
  const albumFile = path.join(GALLERY_DIR, slug, "album.json");
  if (!fs.existsSync(albumFile)) return null;
  const raw = fs.readFileSync(albumFile, "utf8");
  return JSON.parse(raw) as GalleryAlbum;
}
