import { ArrowRight, CircleCheckBig, MapPin } from "lucide-react";
import Link from "next/link";

import { AppHeader } from "@/components/app-shell/app-header";
import { PageFrame } from "@/components/app-shell/page-frame";
import { ParkingSummary } from "@/components/parking/parking-summary";
import { RecommendedParkingCard } from "@/components/parking/recommended-parking-card";
import { buttonVariants } from "@/components/ui/button";
import {
  parkingRepository,
  recommendationRepository,
  universityRepository,
  vehicleRepository,
} from "@/data/mock/repositories";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [brand, lots, recommendations, vehicleOverview] = await Promise.all([
    universityRepository.getBrand(DEFAULT_TENANT),
    parkingRepository.listByCampus(DEFAULT_TENANT),
    recommendationRepository.recommend(DEFAULT_TENANT, {
      buildingId: "b1",
      arrivalAt: "10:30",
    }),
    vehicleRepository.getOverview(DEFAULT_TENANT),
  ]);
  const topRecommendation = recommendations[0];

  return (
    <>
      <AppHeader campusName={brand.campusName} universityName={brand.name} />
      <PageFrame>
        <section aria-labelledby="home-heading" className="flex flex-col gap-5 pt-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">안녕하세요, 김학생님</p>
            <h1 id="home-heading" className="text-[2rem] font-bold leading-[1.2] tracking-[-0.04em]">
              어디로 가시나요?
            </h1>
            <p className="mt-2 max-w-[22rem] text-[15px] leading-6 text-muted-foreground">
              도착 시간을 알려주면 주차장을 미리 찾아드려요.
            </p>
          </div>

          <Link
            className="flex min-h-16 items-center justify-between gap-3 rounded-[var(--radius)] bg-muted px-4 transition-colors hover:bg-muted/75"
            href="/recommend"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-white text-primary">
                <MapPin aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-muted-foreground">목적지</span>
                <span className="block truncate font-semibold">동산도서관 · 오늘 10:30</span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            className={cn(buttonVariants({ size: "lg" }), "w-full shadow-[0_10px_24px_rgb(3_78_162/0.22)]")}
            href="/recommend?buildingId=b1&arrivalAt=10%3A30"
          >
            주차 추천 받기
          </Link>
        </section>

        {topRecommendation ? (
          <>
            <ParkingSummary lots={lots} recommendedName={topRecommendation.parkingLot.name} />
            <section aria-labelledby="recommended-heading" className="flex flex-col gap-4">
              <h2 id="recommended-heading" className="text-xl font-bold tracking-[-0.02em]">
                도착 전에 확인해 보세요
              </h2>
              <RecommendedParkingCard recommendation={topRecommendation} />
            </section>
          </>
        ) : null}

        {vehicleOverview.vehicles[0] ? (
          <Link
            className="flex min-h-16 items-center justify-between gap-3 rounded-[var(--radius)] bg-muted px-4 transition-colors hover:bg-muted/75"
            href="/profile"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[var(--radius)] bg-accent text-primary">
                <CircleCheckBig aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">차량 등록이 승인됐어요</span>
                <span className="block text-xs text-muted-foreground">
                  {vehicleOverview.vehicles[0].plateNumber} · 정기권 사용 중
                </span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        ) : null}
      </PageFrame>
    </>
  );
}
