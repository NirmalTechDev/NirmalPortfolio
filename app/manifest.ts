import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nirmal Ranpariya",
    short_name: "Nirmal",
    description: "React Native developer and software engineer in Surat, India.",
    start_url: "/",
    display: "browser",
    background_color: "#efebe1",
    theme_color: "#efebe1",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
