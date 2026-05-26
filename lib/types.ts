export interface JournalMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt?: string;
  featured?: boolean;
}

export interface JournalEntry extends JournalMeta {
  content: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: "milestone" | "medical" | "trip" | "first" | "birthday";
  note?: string;
  icon?: string;
}

export interface Photo {
  filename: string;
  caption?: string;
  width: number;
  height: number;
}

export interface GalleryAlbum {
  slug: string;
  title: string;
  date: string;
  description?: string;
  coverPhoto: string;
  photos: Photo[];
}
