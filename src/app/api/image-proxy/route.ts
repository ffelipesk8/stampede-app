import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";

function isUnsafeImageHost(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    isIP(host) !== 0 ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
}

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get("url");
  if (!rawUrl) return new NextResponse("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }

  if (target.protocol !== "https:") {
    return new NextResponse("Only HTTPS URLs are supported", { status: 400 });
  }

  if (isUnsafeImageHost(target.hostname)) {
    return new NextResponse("Private or local image URLs are not allowed", { status: 400 });
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        "User-Agent": "KARTAZO-WorldCup/1.0 (image-proxy)",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!upstream.ok) {
      return new NextResponse("Upstream image not available", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.toLowerCase().startsWith("image/")) {
      return new NextResponse("Upstream resource is not an image", { status: 415 });
    }

    const buffer = await upstream.arrayBuffer();
    if (buffer.byteLength > 8 * 1024 * 1024) {
      return new NextResponse("Image too large", { status: 413 });
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
