import type { GalleryAlbum } from "@/lib/types";
import AlbumCard from "./AlbumCard";

export default function AlbumGrid({ albums }: { albums: GalleryAlbum[] }) {
  if (albums.length === 0) {
    return (
      <p className="text-warm-400 italic">No albums yet — check back soon.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <AlbumCard key={album.slug} album={album} />
      ))}
    </div>
  );
}
