import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 68,
        color: "#ffffff",
        background:
          "linear-gradient(135deg, #090a0f 0%, #171126 58%, #08212c 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            color: "#090a0f",
            fontSize: 44,
            fontWeight: 900,
            background: "linear-gradient(135deg, #67e8f9, #d946ef)",
          }}
        >
          5
        </div>
        <div
          style={{
            color: "#67e8f9",
            fontSize: 25,
            fontWeight: 800,
            letterSpacing: "0.16em",
          }}
        >
          FIVE HEARTS TRIVIA
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            maxWidth: 1000,
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          The party trivia game everyone can join
        </div>
        <div
          style={{
            marginTop: 28,
            color: "#cbd5e1",
            fontSize: 27,
          }}
        >
          Gather around one screen. Protect your five hearts.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          paddingTop: 22,
          color: "#e2e8f0",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}
      >
        <span>FREE · NO DOWNLOADS · PLAY TOGETHER</span>
        <span style={{ color: "#fb7185", fontSize: 28 }}>♥ ♥ ♥ ♥ ♥</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
