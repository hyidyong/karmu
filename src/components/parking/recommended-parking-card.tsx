import { ArrowRight, Clock3, Navigation, ShieldCheck } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ParkingRecommendation } from "@/domain/recommendation/types";

import { StatusLabel } from "./status-label";

type RecommendedParkingCardProps = {
  recommendation: ParkingRecommendation;
};

export function RecommendedParkingCard({ recommendation }: RecommendedParkingCardProps) {
  const { parkingLot } = recommendation;

  return (
    <Card className="shadow-[0_16px_40px_rgb(3_78_162/0.12)]">
      <CardHeader>
        <CardDescription className="font-semibold text-primary">오늘의 추천 주차장</CardDescription>
        <CardTitle className="text-xl font-bold tracking-[-0.02em]">{parkingLot.name}</CardTitle>
        <CardAction>
          <StatusLabel status={parkingLot.status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-[var(--radius)] bg-accent p-4">
          <p className="text-xs font-semibold text-primary">도착 시 예상</p>
          <p className="mt-1 text-3xl font-bold tracking-[-0.04em]">
            {parkingLot.predictedAvailable}<span className="ml-1 text-base">면</span>
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-4 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">도보 시간</dt>
              <dd className="font-semibold">{parkingLot.walkMinutes}분</dd>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
            <div>
              <dt className="text-xs text-muted-foreground">예측 신뢰도</dt>
              <dd className="font-semibold">{parkingLot.confidence}%</dd>
            </div>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Navigation aria-hidden="true" className="size-4" />
          목적지와 {parkingLot.distanceMeters}m
        </span>
        <Link
          className="flex min-h-11 items-center gap-1 rounded-[var(--radius)] px-2 text-sm font-bold text-primary"
          href={`/parking/${parkingLot.parkingLotId}`}
        >
          상세 정보
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
