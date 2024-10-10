
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://cyb.no/",
      lastModified: new Date(Date.parse("28 Aug 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/aboutCYB",
      lastModified: new Date(Date.parse("28 Aug 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/volunteering",
      lastModified: new Date(Date.parse("08 Sep 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/aboutEscape/rentingEscape",
      lastModified: new Date(Date.parse("08 Sep 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://cyb.no/unauthorized",
      lastModified: new Date(Date.parse("08 Sep 2024 00:00:00 GMT")),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}

