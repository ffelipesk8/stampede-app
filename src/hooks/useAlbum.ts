import { useQuery } from "@tanstack/react-query";

export function useAlbum() {
  return useQuery({
    queryKey: ["album", "me"],
    queryFn: async () => {
      const res = await fetch("/api/album/me");
      if (!res.ok) throw new Error("Failed to fetch album");
      return res.json();
    },
    staleTime: 60_000,
  });
}
