"use client";
import { useState, useEffect } from "react";

type StickerCategory =
  | "player"
  | "coach"
  | "stadium"
  | "city"
  | "crest"
  | "moment"
  | "special"
  | string;

const resolvedUrlCache = new Map<string, string | null>();
const requestCache = new Map<string, Promise<string | null>>();
const failedUrlCache = new Set<string>();

function toProxyUrl(value: string, category: StickerCategory) {
  if (value.startsWith("/")) return value;
  if (value.startsWith("/api/image-proxy")) return value;
  if (/^https?:\/\//i.test(value)) {
    return `/api/image-proxy?url=${encodeURIComponent(value)}`;
  }
  if (category !== "player" && category !== "coach") return null;
  return value;
}

export function useStickerImage(
  name: string,
  category: StickerCategory = "player",
  fallback?: string | null
) {
  const requestKey = `${category}::${name.trim().toLowerCase()}::${fallback ?? ""}`;

  const getInitialUrl = (value?: string | null) => {
    if (!value) return null;
    return toProxyUrl(value, category);
  };

  const [photoUrl, setPhotoUrl] = useState<string | null>(
    resolvedUrlCache.get(requestKey) ?? getInitialUrl(fallback)
  );
  const [loaded, setLoaded]     = useState(false);
  const [error, setError]       = useState(false);

  useEffect(() => {
    setPhotoUrl(resolvedUrlCache.get(requestKey) ?? getInitialUrl(fallback));
    setLoaded(false);
    setError(false);
  }, [requestKey, name, category, fallback]);

  useEffect(() => {
    if (!photoUrl || photoUrl.startsWith("/api/player-photo") || photoUrl.startsWith("/api/sticker-image")) {
      return;
    }

    if (typeof window === "undefined") return;
    if (failedUrlCache.has(photoUrl)) return;

    let cancelled = false;
    const img = new Image();

    img.onload = () => {
      if (!cancelled) setLoaded(true);
    };

    img.onerror = () => {
      failedUrlCache.add(photoUrl);
      if (!cancelled) setError(true);
    };

    img.decoding = "async";
    img.src = photoUrl;

    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  useEffect(() => {
    if (photoUrl && !error && resolvedUrlCache.has(requestKey)) return;
    let cancelled = false;

    const existingRequest = requestCache.get(requestKey);
    const request =
      existingRequest ??
      (async () => {
        const endpoint =
          category === "player"
            ? `/api/player-photo?name=${encodeURIComponent(name)}`
            : `/api/sticker-image?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;

        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          const normalizedUrl = data.url ? toProxyUrl(data.url, category) : null;
          resolvedUrlCache.set(requestKey, normalizedUrl);
          return normalizedUrl;
        } catch {
          return null;
        } finally {
          requestCache.delete(requestKey);
        }
      })();

    if (!existingRequest) {
      requestCache.set(requestKey, request);
    }

    request
      .then((nextUrl) => {
        if (cancelled || !nextUrl) return;

        setPhotoUrl((current) => (current === nextUrl ? current : nextUrl));
        setError(false);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [requestKey, name, category, photoUrl, error]);

  return {
    photoUrl,
    loaded,
    setLoaded,
    error,
    setError,
    showPhoto: !!photoUrl && !error,
  };
}
