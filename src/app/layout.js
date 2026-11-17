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
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || ""}`}
        />
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[190px_minmax(0,1fr)_190px]">
          <aside className="z-20 hidden px-2 pt-8 lg:block">
            <div className="ad-frame sticky top-8 mx-auto h-[300px] w-[180px]">
              <AdContainer className="h-[300px] w-[180px]" format="sidebar" slotId="five-hearts-left-sidebar" />
            </div>
          </aside>
          <div className="h-full min-h-0 min-w-0 overflow-hidden">{children}</div>
          <aside className="z-20 hidden px-2 pt-8 lg:block">
            <div className="ad-frame sticky top-8 mx-auto h-[300px] w-[180px]">
              <AdContainer className="h-[300px] w-[180px]" format="sidebar" slotId="five-hearts-right-sidebar" />
            </div>
          </aside>
        </div>
        <div className="ad-anchor ad-frame fixed inset-x-0 z-50 flex h-[50px] items-center justify-center border-x-0 border-b-0 bg-white/95 px-2 shadow-[0_-4px_16px_rgb(45_55_72_/_0.1)] backdrop-blur lg:h-[90px]">
          <div className="block h-[50px] w-[320px] lg:hidden">
            <AdContainer
              className="h-[50px] w-[320px]"
              format="mobile"
              slotId="five-hearts-mobile-anchor"
            />
          </div>
          <div className="hidden h-[90px] w-[728px] lg:block">
            <AdContainer
              className="h-[90px] w-[728px]"
              format="anchor"
              slotId="five-hearts-desktop-anchor"
            />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
