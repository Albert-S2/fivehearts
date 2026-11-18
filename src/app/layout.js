import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import AdContainer from "../components/AdContainer";
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
        <Script
          async
          crossOrigin="anonymous"
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}
          strategy="beforeInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || ""}`}
        />
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[190px_minmax(0,1fr)_190px]">
          <aside className="z-20 hidden flex-col justify-between px-2 py-8 lg:flex">
            <div className="ad-frame mx-auto h-[300px] w-[180px]">
              <AdContainer
                className="h-[300px] w-[180px]"
                format="sidebar"
                slotId="8746971591"
              />
            </div>
            <div className="ad-frame mx-auto h-[300px] w-[180px]">
              <AdContainer
                className="h-[300px] w-[180px]"
                format="sidebar"
                slotId="5081837565"
              />
            </div>
          </aside>
          <div className="h-full min-h-0 min-w-0 overflow-hidden">{children}</div>
          <aside className="z-20 hidden flex-col justify-between px-2 py-8 lg:flex">
            <div className="ad-frame mx-auto h-[300px] w-[180px]">
              <AdContainer
                className="h-[300px] w-[180px]"
                format="sidebar"
                slotId="6176648570"
              />
            </div>
            <div className="ad-frame mx-auto h-[300px] w-[180px]">
              <AdContainer
                className="h-[300px] w-[180px]"
                format="sidebar"
                slotId="3247232908"
              />
            </div>
          </aside>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
