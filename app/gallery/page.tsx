import type { Metadata } from "next";
import { getAllAlbums } from "@/lib/gallery";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import AlbumGrid from "@/components/gallery/AlbumGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photo albums from Kylo's life.",
};

export default function GalleryPage() {
  const albums = getAllAlbums();

  return (
    <PageWrapper>
      <SectionHeading
        title="Gallery"
        subtitle="A growing collection of moments, big and small."
      />
      <AlbumGrid albums={albums} />
    </PageWrapper>
  );
}
