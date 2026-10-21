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
  const format = (searchParams.get("format") || "webp").toLowerCase();
  const isPng = format === "png";

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
      const outBuffer = isPng
        ? await sharp(buffer).png().toBuffer()
        : await sharp(buffer).toFormat("webp", { quality: 85 }).toBuffer();

      return new NextResponse(new Uint8Array(outBuffer), {
        headers: {
          "Content-Type": isPng ? "image/png" : "image/webp",
          "Content-Disposition": `inline; filename="image.${isPng ? "png" : "webp"}"`,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
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

    // 3. Convert input image format into pure WebP or PNG format
    const outBuffer = isPng
      ? await sharp(fetchResult.buffer).png().toBuffer()
      : await sharp(fetchResult.buffer).toFormat("webp", { quality: 85 }).toBuffer();

    return new NextResponse(new Uint8Array(outBuffer), {
      headers: {
        "Content-Type": isPng ? "image/png" : "image/webp",
        "Content-Disposition": `inline; filename="article-image.${isPng ? "png" : "webp"}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
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
