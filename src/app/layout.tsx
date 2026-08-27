import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "Karmu",
    template: "%s | Karmu",
  },
  description: "도착 시간을 기준으로 대학 주차장을 예측하고 추천합니다.",
  applicationName: "Karmu",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Karmu",
  },
  icons: {
    icon: "/icons/karmu.svg",
    apple: "/icons/karmu.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#034EA2",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
