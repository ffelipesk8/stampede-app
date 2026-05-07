import type { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.kartazo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms", "/contact"],
        disallow: [
          "/admin",
          "/album",
          "/api",
          "/coach",
          "/dashboard",
          "/events",
          "/marketplace",
          "/onboarding",
          "/packs",
          "/profile",
          "/ranking",
          "/signed-out",
          "/upgrade",
        ],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
