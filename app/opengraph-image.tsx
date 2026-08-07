import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0F",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(217,70,239,0.25) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)",
          }}
        />
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            border: "6px solid #D946EF",
            boxShadow: "0 0 40px rgba(217,70,239,0.6)",
            marginBottom: 32,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            color: "white",
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          connect vibe
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.5)",
            marginTop: 16,
            display: "flex",
          }}
        >
          Find your people. Show up.
        </div>
      </div>
    ),
    { ...size }
  );
}
