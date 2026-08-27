import { ArrowRight, Clock3, Footprints, ShieldCheck } from "lucide-react";
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

type RecommendationCardProps = {
  recommendation: ParkingRecommendation;
  rank: number;
  detailQuery: string;
};

export function RecommendationCard({
  recommendation,
  rank,
  detailQuery,
}: RecommendationCardProps) {
  const { parkingLot, reasons } = recommendation;

  return (
    <Card className={rank === 1 ? "shadow-[0_16px_40px_rgb(3_78_162/0.14)]" : undefined}>
      <CardHeader>
        <CardDescription className="font-semibold text-primary">추천 {rank}순위</CardDescription>
        <CardTitle className="text-xl font-bold">{parkingLot.name}</CardTitle>
        <CardAction>
          <span className="flex size-9 items-center justify-center rounded-[var(--radius)] bg-accent text-sm font-bold text-primary">
            {rank}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-[var(--radius)] bg-muted p-3">
            <Clock3 aria-hidden="true" className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">예상 잔여</p>
            <p className="mt-0.5 font-bold">{parkingLot.predictedAvailable}면</p>
          </div>
          <div className="rounded-[var(--radius)] bg-muted p-3">
            <Footprints aria-hidden="true" className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">도보</p>
            <p className="mt-0.5 font-bold">{parkingLot.walkMinutes}분</p>
          </div>
          <div className="rounded-[var(--radius)] bg-muted p-3">
            <ShieldCheck aria-hidden="true" className="mb-2 size-4 text-primary" />
            <p className="text-xs text-muted-foreground">신뢰도</p>
            <p className="mt-0.5 font-bold">{parkingLot.confidence}%</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2" aria-label="추천 근거">
          {reasons.map((reason) => (
            <li key={reason} className="rounded-[var(--radius)] bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
              {reason}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="justify-end">
        <Link
          className="flex min-h-11 items-center gap-1 rounded-[var(--radius)] px-2 text-sm font-bold text-primary"
          href={`/parking/${parkingLot.parkingLotId}?${detailQuery}`}
        >
          상세 정보 보기
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
