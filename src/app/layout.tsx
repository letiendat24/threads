import type { Metadata, Viewport } from "next";

import { AppProviders } from "@/app/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Threads Clone",
  description: "Frontend foundation for a Threads-like social experience.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
