import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  SITE_URL,
  createPageMetadata,
} from "../lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  ...createPageMetadata({
    path: "/",
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
  }),
  metadataBase: new URL(SITE_URL),
  keywords: [
    "free trivia game",
    "group party game",
    "shared screen quiz",
    "multiplayer trivia",
    "browser board game",
    "family trivia battle",
  ],
  other: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID
    ? {
        "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_PUB_ID,
      }
    : undefined,
};

export const viewport = {
  viewportFit: "cover",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#application`,
  name: "Five Hearts Trivia",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  description: DEFAULT_SEO_DESCRIPTION,
  genre: ["Party Game", "Trivia", "Multiplayer"],
  operatingSystem: "Any (Web Browser)",
  applicationCategory: "GameApplication",
  applicationSubCategory: "BrowserGame",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-[100dvh] flex-col overflow-hidden bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <Script
            async
            crossOrigin="anonymous"
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}
            strategy="beforeInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
          />
        )}
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
