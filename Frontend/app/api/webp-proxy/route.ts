import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { fetchSafeExternalImage } from "@/lib/ssrfValidator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.trim()) {
    return new NextResponse(JSON.stringify({ error: "Missing or invalid 'url' parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const cleanUrl = imageUrl.trim();

  try {
    // 1. Handle base64 data URLs directly
    if (cleanUrl.startsWith("data:image/")) {
      // Disallow SVG base64 data to prevent XSS
      if (cleanUrl.startsWith("data:image/svg+xml")) {
        return new NextResponse(JSON.stringify({ error: "SVG format is not supported" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parts = cleanUrl.split(",");
      const base64Data = parts[1];
      if (!base64Data) {
        return new NextResponse(JSON.stringify({ error: "Invalid base64 image data" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const buffer = Buffer.from(base64Data, "base64");
      const webpBuffer = await sharp(buffer).toFormat("webp", { quality: 85 }).toBuffer();

      return new NextResponse(new Uint8Array(webpBuffer), {
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": 'inline; filename="image.webp"',
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // 2. Fetch external image safely with full SSRF protection (DNS inspection, IP checks, redirect filtering)
    const fetchResult = await fetchSafeExternalImage(cleanUrl);

    if (!fetchResult.ok || !fetchResult.buffer) {
      return new NextResponse(
        JSON.stringify({
          error: fetchResult.error || "Failed to fetch image securely",
        }),
        {
          status: fetchResult.status || 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 3. Convert ANY input image format (AVIF, PNG, JPEG, GIF) into pure WebP format!
    const webpBuffer = await sharp(fetchResult.buffer).toFormat("webp", { quality: 85 }).toBuffer();

    return new NextResponse(new Uint8Array(webpBuffer), {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": 'inline; filename="article-image.webp"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Internal image conversion error";
    console.error("WebP proxy conversion error:", err);
    return new NextResponse(JSON.stringify({ error: "Image processing failed", details: errorMsg }), {
      status: 422,
      headers: { "Content-Type": "application/json" },
    });
  }
}
