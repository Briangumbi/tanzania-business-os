"use client";

import { useEffect } from "react";

// Catches errors in the root layout itself, so it can't rely on globals.css
// or the app's own components being intact — plain inline styles only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3ecdc",
          color: "#1e2130",
          fontFamily: "Georgia, serif",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 360, padding: 24 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#7a2331",
            }}
          >
            Something tore
          </p>
          <h1 style={{ fontSize: 22, marginTop: 8 }}>The app hit a snag</h1>
          <p style={{ fontSize: 14, color: "#56503f", marginTop: 8 }}>
            Nothing was lost — your ledger is untouched. Reload to try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#7a2331",
              color: "#faf6ea",
              border: "none",
              borderRadius: 3,
              fontFamily: "sans-serif",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
