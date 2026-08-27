import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karmu",
    short_name: "Karmu",
    description: "도착 시간을 기준으로 대학 주차장을 예측하고 추천합니다.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F8",
    theme_color: "#034EA2",
    lang: "ko",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/karmu.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/karmu-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
