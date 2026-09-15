import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    // Handle base64 data URLs directly
    if (imageUrl.startsWith("data:image/")) {
      const base64Data = imageUrl.split(",")[1];
      if (!base64Data) return NextResponse.redirect(imageUrl);
      const buffer = Buffer.from(base64Data, "base64");
      const webpBuffer = await sharp(buffer).toFormat("webp", { quality: 85 }).toBuffer();

      return new NextResponse(webpBuffer, {
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": 'inline; filename="image.webp"',
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Fetch external image (WSJ CDN, Unsplash, etc.)
    const res = await fetch(imageUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(imageUrl);
    }

    const arrayBuffer = await res.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Convert ANY input image format (AVIF, PNG, JPEG, GIF) into pure WebP format!
    const webpBuffer = await sharp(inputBuffer).toFormat("webp", { quality: 85 }).toBuffer();

    return new NextResponse(webpBuffer, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": 'inline; filename="article-image.webp"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("WebP proxy conversion error:", err);
    return NextResponse.redirect(imageUrl);
  }
}
