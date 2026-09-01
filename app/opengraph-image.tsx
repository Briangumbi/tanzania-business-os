import { ImageResponse } from "next/og";

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
          background: "#f3ecdc",
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 46px, rgba(30,33,48,0.14) 46px, rgba(30,33,48,0.14) 47px)",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#7a2331",
            fontFamily: "Georgia, serif",
          }}
        >
          Case Study
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            fontWeight: 700,
            color: "#1e2130",
            fontFamily: "Georgia, serif",
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          Tanzania Business OS
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 32,
            color: "#56503f",
            fontFamily: "Georgia, serif",
          }}
        >
          A ledger book, rebuilt as software.
        </div>
      </div>
    ),
    { ...size }
  );
}
