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
  const [photoUrl, setPhotoUrl] = useState<string | null>(fallback || null);
  const [loaded, setLoaded]     = useState(false);
  const [error, setError]       = useState(false);

  useEffect(() => {
    setPhotoUrl(fallback || null);
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
