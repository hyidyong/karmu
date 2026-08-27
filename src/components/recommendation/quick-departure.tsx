"use client";

import { LoaderCircle, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  buildRecommendationUrl,
  requestDepartureEta,
  type DeparturePhase,
} from "./departure-client";

type QuickDepartureProps = {
  buildingId: string;
};

export function QuickDeparture({ buildingId }: QuickDepartureProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<DeparturePhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const isBusy = phase === "locating" || phase === "calculating" || phase === "fallback";

  async function depart() {
    setError(null);
    try {
      const eta = await requestDepartureEta(buildingId, { onPhase: setPhase });
      setPhase("idle");
      router.push(buildRecommendationUrl(eta));
    } catch (caught) {
      setPhase("error");
      setError(caught instanceof Error ? caught.message : "경로를 계산하지 못했어요.");
    }
  }

  const status = error ?? (
    phase === "locating"
      ? "현재 위치 확인 중…"
      : phase === "calculating"
        ? "실시간 경로 계산 중…"
        : phase === "fallback"
          ? "데모 경로로 계산 중…"
          : "동산도서관까지 도착 시간과 혼잡도를 자동 계산해요."
  );

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="h-12 w-full shadow-[0_10px_24px_rgb(3_78_162/0.22)]"
        disabled={isBusy}
        onClick={depart}
        size="lg"
        type="button"
      >
        {isBusy ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" data-icon="inline-start" />
        ) : (
          <Navigation aria-hidden="true" data-icon="inline-start" />
        )}
        {isBusy ? "도착 시간 계산 중" : "현재 위치에서 지금 출발"}
      </Button>
      <p
        aria-live="polite"
        className={cn("text-center text-xs", error ? "text-destructive" : "text-muted-foreground")}
      >
        {status}
      </p>
    </div>
  );
}
