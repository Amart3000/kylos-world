import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { getAllAlbums, getAlbumBySlug } from "@/lib/gallery";
import PageWrapper from "@/components/layout/PageWrapper";
import LightboxWrapper from "@/components/gallery/LightboxWrapper";
import UploadButton from "@/components/gallery/UploadButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ album: string }> };

export async function generateStaticParams() {
  const albums = getAllAlbums();
  return albums.map((a) => ({ album: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album: slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) return {};
  return { title: album.title, description: album.description };
}

export default async function AlbumPage({ params }: Props) {
  const { album: slug } = await params;
  const album = getAlbumBySlug(slug);
  if (!album) notFound();

  return (
    <PageWrapper>
      <div className="mb-4">
        <Link href="/gallery" className="text-warm-400 text-sm hover:text-accent transition-colors">
          ← All albums
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-warm-900">{album.title}</h1>
        <p className="text-warm-400 text-sm mt-1">
          {format(parseISO(album.date), "MMMM yyyy")} &middot; {album.photos.length} photo{album.photos.length !== 1 ? "s" : ""}
        </p>
        {album.description && (
          <p className="text-warm-600 mt-3 text-lg">{album.description}</p>
        )}
      </div>
      <UploadButton albumSlug={album.slug} />
      <LightboxWrapper albumSlug={album.slug} photos={album.photos} />
    </PageWrapper>
  );
}
