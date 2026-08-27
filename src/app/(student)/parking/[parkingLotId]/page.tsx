import { ArrowRight, CarFront, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageFrame } from "@/components/app-shell/page-frame";
import { SubpageHeader } from "@/components/app-shell/subpage-header";
import { OccupancyTrend } from "@/components/parking/occupancy-trend";
import { ParkingFacts } from "@/components/parking/parking-facts";
import { StatusLabel } from "@/components/parking/status-label";
import { buttonVariants } from "@/components/ui/button";
import { parkingRepository } from "@/data/mock/repositories";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "주차장 상세",
};

type ParkingDetailPageProps = {
  params: Promise<{ parkingLotId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ParkingDetailPage({ params, searchParams }: ParkingDetailPageProps) {
  const [{ parkingLotId }, query] = await Promise.all([params, searchParams]);
  const parkingLot = await parkingRepository.getById(DEFAULT_TENANT, parkingLotId);

  if (!parkingLot) {
    notFound();
  }

  const arrivalAt =
    typeof query.arrivalAt === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(query.arrivalAt)
      ? query.arrivalAt
      : "10:30";

  return (
    <>
      <SubpageHeader backHref={`/recommend?buildingId=b1&arrivalAt=${encodeURIComponent(arrivalAt)}`} title={parkingLot.name} />
      <PageFrame>
        <section aria-labelledby="parking-detail-heading" className="flex flex-col gap-5 pt-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">{arrivalAt} 도착 예상</p>
              <h1 id="parking-detail-heading" className="mt-1 text-[2rem] font-bold tracking-[-0.04em]">
                {parkingLot.predictedAvailable}면 남아요
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                현재는 {parkingLot.currentAvailable}면을 이용할 수 있어요.
              </p>
            </div>
            <StatusLabel status={parkingLot.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[var(--radius)] bg-accent p-4">
              <CarFront aria-hidden="true" className="size-5 text-primary" />
              <p className="mt-3 text-xs text-primary">예상 잔여면</p>
              <p className="mt-0.5 text-2xl font-bold">{parkingLot.predictedAvailable}면</p>
            </div>
            <div className="rounded-[var(--radius)] bg-muted p-4">
              <ShieldCheck aria-hidden="true" className="size-5 text-primary" />
              <p className="mt-3 text-xs text-muted-foreground">예측 신뢰도</p>
              <p className="mt-0.5 text-2xl font-bold">{parkingLot.confidence}%</p>
            </div>
          </div>
        </section>

        <OccupancyTrend arrivalAt={arrivalAt} trend={parkingLot.trend} />
        <ParkingFacts parkingLot={parkingLot} />

        <Link
          className={cn(
            buttonVariants({ size: "lg" }),
            "sticky bottom-24 z-20 w-full shadow-[0_12px_30px_rgb(3_78_162/0.24)]",
          )}
          href={`/map?parkingLotId=${parkingLot.parkingLotId}`}
        >
          지도에서 위치 보기
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>
      </PageFrame>
    </>
  );
}
