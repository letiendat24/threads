import type { MetadataRoute } from "next";

import { createAbsoluteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: createAbsoluteUrl("/"),
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: createAbsoluteUrl("/login"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: createAbsoluteUrl("/register"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
