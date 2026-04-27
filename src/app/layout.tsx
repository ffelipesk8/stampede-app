import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://kartazo.com"
  ),
  title: "KARTAZO — World Cup 2026 Fan Platform",
  description:
    "The official fan platform for FIFA World Cup 2026. Digital sticker album, fan events, AI coach, and more.",
  keywords: ["World Cup 2026", "FIFA", "sticker album", "football", "fan platform"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "KARTAZO",
    description: "Don't just watch the World Cup. Play it.",
    url: "https://kartazo.com",
    siteName: "KARTAZO",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KARTAZO",
    description: "Don't just watch the World Cup. Play it.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-bg text-t1 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
