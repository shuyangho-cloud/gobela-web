import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GoBela — The Operating System for Modern Parenting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1A2C4E",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,183,3,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: "white", letterSpacing: -2 }}>
            Go
          </span>
          <span style={{ fontSize: 48, fontWeight: 900, color: "#FFB703", letterSpacing: -2 }}>
            Bela
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: -2,
            marginBottom: 28,
            maxWidth: 760,
          }}
        >
          The OS for Modern Parenting
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.65)",
            marginBottom: 56,
            maxWidth: 660,
            lineHeight: 1.4,
          }}
        >
          Cook smarter. Dine better. Play more. Powered by Singapore parents.
        </div>

        {/* Pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["🍳 Cook", "🍜 Dine", "🎡 Discover", "👨‍👩‍👧 Community"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 40,
                padding: "12px 24px",
                fontSize: 22,
                color: "white",
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom tag */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontSize: 20,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          gobela.sg
        </div>
      </div>
    ),
    { ...size }
  );
}
