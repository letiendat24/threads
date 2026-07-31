import type { MetadataRoute } from "next";

import { createAbsoluteUrl, siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: createAbsoluteUrl("/favicon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: createAbsoluteUrl("/favicon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: createAbsoluteUrl("/apple-icon"),
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
