import Image from "next/image";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { photoSrc } from "@/lib/utils";
import type { GalleryAlbum } from "@/lib/types";

export default function AlbumCard({ album }: { album: GalleryAlbum }) {
  return (
    <Link
      href={`/gallery/${album.slug}`}
      className="group block rounded-2xl overflow-hidden border border-warm-200 hover:border-warm-300 hover:shadow-md transition-all"
    >
      <div className="relative aspect-[4/3] bg-warm-100 flex items-center justify-center">
        {album.coverPhoto ? (
          <Image
            src={photoSrc(album.slug, album.coverPhoto)}
            alt={album.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl select-none">📷</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg text-warm-900">{album.title}</h3>
        <p className="text-warm-400 text-sm mt-0.5">
          {format(parseISO(album.date), "MMMM yyyy")}
        </p>
        {album.description && (
          <p className="text-warm-600 text-sm mt-2 line-clamp-2">
            {album.description}
          </p>
        )}
      </div>
    </Link>
  );
}
