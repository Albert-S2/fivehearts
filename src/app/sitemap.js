import { SITE_URL } from "../lib/seo";

export default function sitemap() {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/game`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/game/battle`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
