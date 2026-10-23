import type { Metadata } from "next";
import Script from "next/script";
import BelaFloatingChat from "@/components/BelaFloatingChat";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL("https://gobela.sg"),
	title: "GoBela — Early Learning, Play & Trial Classes in Singapore",
	description:
		"Discover early learning, creative play and sports programmes in Singapore. Explore your child’s interests and start with a trial. Free on iOS and Android.",
	openGraph: {
		title: "GoBela — Discover a Love of Learning",
		description:
			"Explore early learning, creative play and sports programmes for your child. Free on iOS & Android.",
		url: "https://gobela.sg",
		siteName: "GoBela",
		images: [{ url: "/og.png", width: 1200, height: 630 }],
		locale: "en_SG",
		type: "website",
	},
	twitter: { card: "summary_large_image" },
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="min-h-full flex flex-col">
				{children}
				<BelaFloatingChat />
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-H4JNED050G"
					strategy="afterInteractive"
				/>
				<Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-H4JNED050G');
        `}</Script>
			</body>
		</html>
	);
}
