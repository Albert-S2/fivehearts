import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import AdContainer from "../components/AdContainer";
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
  title: "Game Room | Five Hearts",
  description: "Choose a shared-screen game to play.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950">
        <Script
          async
          crossOrigin="anonymous"
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || ""}`}
        />
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[300px_1fr_300px]">
          <aside className="hidden justify-center px-4 pt-8 lg:flex">
            <div className="sticky top-8 h-[600px]">
              <AdContainer format="half-page" slotId="five-hearts-left-half-page" />
            </div>
          </aside>
          <div className="min-w-0 pb-28">{children}</div>
          <aside className="hidden justify-center px-4 pt-8 lg:flex">
            <div className="sticky top-8 h-[600px]">
              <AdContainer format="half-page" slotId="five-hearts-right-half-page" />
            </div>
          </aside>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-[50px] items-center justify-center border-t border-slate-700 bg-slate-900/90 px-2 backdrop-blur lg:h-[90px]">
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
      </body>
    </html>
  );
}
