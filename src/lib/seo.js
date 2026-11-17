export const SITE_URL = "https://www.fiveheartsgames.com";

export const DEFAULT_SEO_TITLE =
  "Five Hearts | Free Shared-Screen Party Trivia Game for Groups";

export const DEFAULT_SEO_DESCRIPTION =
  "Gather around the TV, tablet, or phone for Five Hearts—a fast, zero-install multiplayer trivia battle. Protect your five hearts and compete with friends!";

const SOCIAL_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Five Hearts free shared-screen party trivia game",
};

export function createPageMetadata({ path, title, description }) {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: path,
      siteName: "Five Hearts",
      title,
      description,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SOCIAL_IMAGE.url],
    },
  };
}
