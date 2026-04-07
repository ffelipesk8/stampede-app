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

export function useStickerImage(
  name: string,
  category: StickerCategory = "player",
  fallback?: string | null
) {
  const getInitialUrl = (value?: string | null) => {
    if (!value) return null;
    if (category !== "player" && category !== "coach") return null;
    if (value.startsWith("/api/image-proxy")) return value;
    if (/^https?:\/\//i.test(value)) {
      return `/api/image-proxy?url=${encodeURIComponent(value)}`;
    }
    return value;
  };

  const [photoUrl, setPhotoUrl] = useState<string | null>(getInitialUrl(fallback));
  const [loaded, setLoaded]     = useState(false);
  const [error, setError]       = useState(false);

  useEffect(() => {
    setPhotoUrl(getInitialUrl(fallback));
    setLoaded(false);
    setError(false);
  }, [name, category, fallback]);

  useEffect(() => {
    if (photoUrl && !error) return;
    let cancelled = false;

    // Players use the dedicated player-photo endpoint (more sources)
    const endpoint =
      category === "player"
        ? `/api/player-photo?name=${encodeURIComponent(name)}`
        : `/api/sticker-image?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;

    fetch(endpoint)
      .then(r => r.json())
      .then(d => {
        if (!cancelled && d.url) {
          setPhotoUrl(d.url);
          setError(false);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [name, category, photoUrl, error]);

  return {
    photoUrl,
    loaded,
    setLoaded,
    error,
    setError,
    showPhoto: !!photoUrl && !error,
  };
}
