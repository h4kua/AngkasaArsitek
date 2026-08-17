import { ImageResponse } from "next/og";
import { company } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#f6f1e9",
          color: "#2a2520",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            ANGKASA
          </span>
          <span style={{ fontSize: 40, fontWeight: 700, color: "#8c6836" }}>
            .
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <span
            style={{
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8c6836",
              marginBottom: 24,
            }}
          >
            Architecture Studio · Pekanbaru, Riau
          </span>
          <span style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.15 }}>
            {company.motto}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#6b6255",
            letterSpacing: 1,
          }}
        >
          {`Since ${company.founded} · ${company.cities.join(" · ")}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
