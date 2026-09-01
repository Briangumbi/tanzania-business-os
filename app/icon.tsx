import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3ecdc",
          borderRadius: 6,
          border: "2px solid #7a2331",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#7a2331",
            fontFamily: "Georgia, serif",
          }}
        >
          T
        </div>
      </div>
    ),
    { ...size }
  );
}
