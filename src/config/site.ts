export const siteConfig = {
  name: "Soi chi city",
  shortName: "Soi chi",
  description: "A clean social city feed for posts, replies, profiles, and real-time community conversations.",
  url: "https://soi-chi-city.vercel.app",
  locale: "vi_VN",
  keywords: [
    "Soi chi city",
    "social network",
    "microblog",
    "community",
    "posts",
    "replies",
    "profile",
  ],
};

export function createAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
