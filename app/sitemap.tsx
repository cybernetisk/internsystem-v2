
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://cyb.no/pages/main/home",
      lastModified: new Date(Date.parse("28 Aug 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/pages/main/aboutCYB",
      lastModified: new Date(Date.parse("28 Aug 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/pages/main/volunteering",
      lastModified: new Date(Date.parse("08 Sep 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/pages/main/aboutEscape/rentingEscape",
      lastModified: new Date(Date.parse("08 Sep 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/pages/main/unauthorized",
      lastModified: new Date(Date.parse("08 Sep 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

