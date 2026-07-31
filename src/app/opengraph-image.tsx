import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#050505",
          color: "#ffffff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "64px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "1px solid #2f2f2f",
            borderRadius: "40px",
            display: "flex",
            gap: "36px",
            height: "100%",
            justifyContent: "center",
            padding: "56px",
            width: "100%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#ffffff",
              borderRadius: "999px",
              color: "#050505",
              display: "flex",
              fontSize: "88px",
              fontWeight: 800,
              height: "160px",
              justifyContent: "center",
              width: "160px",
            }}
          >
            SC
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ fontSize: "76px", fontWeight: 800, letterSpacing: 0 }}>{siteConfig.name}</div>
            <div style={{ color: "#b8b8b8", fontSize: "32px", lineHeight: 1.35, maxWidth: "720px" }}>
              {siteConfig.description}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
