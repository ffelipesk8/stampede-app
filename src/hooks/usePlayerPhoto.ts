"use client";
import { useState, useEffect } from "react";

export function usePlayerPhoto(name: string, fallback?: string | null) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(fallback || null);
  const [loaded, setLoaded]     = useState(false);
  const [error, setError]       = useState(false);

  useEffect(() => {
    if (photoUrl && !error) return; // already have a working URL
    let cancelled = false;
    fetch(`/api/player-photo?name=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(d => { if (!cancelled && d.url) setPhotoUrl(d.url); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [name]);

  return {
    photoUrl,
    loaded,
    setLoaded,
    error,
    setError,
    showPhoto: !!photoUrl && !error,
  };
}
