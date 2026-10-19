/** Colour presets shared by the dashboard editor (kept in sync with the Birthday-Wish app). */
export const BIRTHDAY_PRESETS = {
  blush: { label: "Blush", mode: "dark", primary: "#ff4fa3", secondary: "#ffb3d1", accent: "#ffd166", background: "#12060d" },
  lavender: { label: "Lavender", mode: "dark", primary: "#9b7bff", secondary: "#d9ccff", accent: "#ffd6a5", background: "#120d1f" },
  sunset: { label: "Sunset", mode: "dark", primary: "#ff7a59", secondary: "#ffc2a8", accent: "#ffd23f", background: "#1a0b07" },
  mint: { label: "Mint garden", mode: "light", primary: "#16a085", secondary: "#9fe8d6", accent: "#ff8fab", background: "#f2fbf8" },
  midnight: { label: "Midnight", mode: "dark", primary: "#7aa2ff", secondary: "#c3d4ff", accent: "#ffe066", background: "#070b18" },
} as const;
export type PresetKey = keyof typeof BIRTHDAY_PRESETS;
