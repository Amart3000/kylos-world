export function photoSrc(albumSlug: string, filename: string): string {
  if (filename.startsWith("https://")) return filename;
  return `/images/${albumSlug}/${filename}`;
}
