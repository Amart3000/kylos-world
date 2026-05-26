"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import Image from "next/image";
import { photoSrc } from "@/lib/utils";
import type { Photo } from "@/lib/types";

export default function LightboxWrapper({
  albumSlug,
  photos,
}: {
  albumSlug: string;
  photos: Photo[];
}) {
  const [index, setIndex] = useState(-1);

  const slides = photos.map((photo) => ({
    src: photoSrc(albumSlug, photo.filename),
    width: photo.width,
    height: photo.height,
    description: photo.caption,
  }));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.filename}
            onClick={() => setIndex(i)}
            className="relative aspect-square rounded-xl overflow-hidden bg-warm-100 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <Image
              src={photoSrc(albumSlug, photo.filename)}
              alt={photo.caption ?? `Photo ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions]}
      />
    </>
  );
}
