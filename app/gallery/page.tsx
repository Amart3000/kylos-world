import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/gallery";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import AlbumGrid from "@/components/gallery/AlbumGrid";
import NewAlbumForm from "@/components/gallery/NewAlbumForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo albums from Kylo's life.",
};

export default async function GalleryPage() {
  const albums = await getAllAlbums();

  return (
    <PageWrapper>
      <SectionHeading
        title="Gallery"
        subtitle="A growing collection of moments, big and small."
      />
      <NewAlbumForm />
      <AlbumGrid albums={albums} />
    </PageWrapper>
  );
}
