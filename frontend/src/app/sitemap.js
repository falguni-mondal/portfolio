const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://byfalguni.com";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      images: [
        `${SITE_URL}/og-image.jpg`,
        `${SITE_URL}/me.webp`,
        `${SITE_URL}/me_light.webp`,
      ],
    },
  ];
}
