export function photoSrc(albumSlug: string, filename: string): string {
  return `/images/${albumSlug}/${filename}`;
}
