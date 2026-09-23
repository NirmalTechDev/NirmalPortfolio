import { ImageResponse } from "next/og";

export const alt = "Nirmal Ranpariya, React Native developer and software engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#efebe1",
          color: "#15140f",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 3, fontFamily: "monospace" }}>
          <span>SOFTWARE ENGINEER — REACT NATIVE</span>
          <span>SURAT, INDIA</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 168, lineHeight: 0.9, letterSpacing: -4 }}>
          <span>Nirmal</span>
          <span style={{ fontStyle: "italic" }}>Ranpariya</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, fontFamily: "monospace" }}>
          <div style={{ width: 16, height: 16, background: "#c23a17" }} />
          <span>nirmalranpariya.in</span>
        </div>
      </div>
    ),
    size,
  );
}
