import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gobela.sg"),
  title: "GoBela — The Operating System for Modern Parenting",
  description:
    "GoBela helps Singapore families decide what to cook, where to dine, what activities to book and how to grow their children — all in one AI-powered app.",
  openGraph: {
    title: "GoBela — The OS for Modern Parenting",
    description: "Cook smarter. Dine better. Play more. Powered by parents.",
    url: "https://gobela.sg",
    siteName: "GoBela",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_SG",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
