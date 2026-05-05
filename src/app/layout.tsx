import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://www.kartazo.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "KARTAZO | Plataforma Fan del Mundial 2026",
  description:
    "La plataforma fan del Mundial 2026. Album digital, eventos, coach IA y experiencia premium para coleccionistas.",
  keywords: ["Mundial 2026", "FIFA", "album de estampas", "futbol", "plataforma fan"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "KARTAZO",
    description: "No solo veas el Mundial. Juegalo.",
    url: "https://kartazo.com",
    siteName: "KARTAZO",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KARTAZO",
    description: "No solo veas el Mundial. Juegalo.",
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
      <html lang="es" className="dark">
        <body className="bg-bg text-t1 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
