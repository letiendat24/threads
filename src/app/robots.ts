import type { MetadataRoute } from "next";

import { createAbsoluteUrl, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/activity",
          "/forgot-password",
          "/more",
          "/post",
          "/profile",
          "/reset-password",
          "/search",
          "/settings",
          "/verify-email",
        ],
      },
    ],
    sitemap: createAbsoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
