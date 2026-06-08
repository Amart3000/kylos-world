import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAlbumBySlug } from "@/lib/gallery";

export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ album: string }> }
) {
  const { album: albumSlug } = await params;

  const album = await getAlbumBySlug(albumSlug);
  if (!album) {
    return Response.json({ error: `Album "${albumSlug}" not found` }, { status: 404 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/heic",
          "image/heif",
        ],
        addRandomSuffix: false,
        maximumSizeInBytes: 50 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {
        // Album metadata is registered via POST /api/gallery/[slug]/photos
      },
    });
    return Response.json(jsonResponse);
  } catch (err) {
    console.error("[upload] handleUpload error:", err);
    return Response.json({ error: String(err) }, { status: 400 });
  }
}
