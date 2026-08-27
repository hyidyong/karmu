import { ArrowRight, Building2, ChartNoAxesCombined, ClipboardCheck, Radio } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageFrame } from "@/components/app-shell/page-frame";
import { SubpageHeader } from "@/components/app-shell/subpage-header";
import { ApplicationTimeline } from "@/components/profile/application-timeline";
import { PassCard } from "@/components/profile/pass-card";
import { VehicleCard } from "@/components/profile/vehicle-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { vehicleRepository } from "@/data/mock/repositories";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "내 정보",
};

const adminCapabilities = [
  { label: "실시간 운영", icon: Radio },
  { label: "신청 승인", icon: ClipboardCheck },
  { label: "공지 관리", icon: Building2 },
  { label: "수요 분석", icon: ChartNoAxesCombined },
];

export default async function ProfilePage() {
  const overview = await vehicleRepository.getOverview(DEFAULT_TENANT);
  const vehicle = overview.vehicles[0];

  return (
    <>
      <SubpageHeader eyebrow="계명대학교 성서캠퍼스" title="내 정보" />
      <PageFrame>
        <section id="notifications" aria-labelledby="profile-heading">
          <p className="text-sm font-semibold text-primary">차량 행정까지 한곳에서</p>
          <h1 id="profile-heading" className="mt-1 text-[2rem] font-bold leading-[1.2] tracking-[-0.04em]">
            등록 상태를<br />간단하게 확인하세요
          </h1>
          <p className="mt-2 text-[15px] leading-6 text-muted-foreground">
            차량 등록, 제출 서류, 정기권 진행 상황을 순서대로 보여드려요.
          </p>
        </section>

        {vehicle ? <VehicleCard vehicle={vehicle} /> : null}
        {overview.pass ? <PassCard pass={overview.pass} /> : null}
        <ApplicationTimeline steps={overview.applicationSteps} />

        <Link
          className={cn(buttonVariants({ size: "lg" }), "w-full shadow-[0_10px_24px_rgb(3_78_162/0.2)]")}
          href="/recommend"
        >
          내 차량으로 주차 추천 받기
          <ArrowRight aria-hidden="true" className="size-5" />
        </Link>

        <Card>
          <CardHeader>
            <CardDescription className="font-semibold text-primary">운영자 확장</CardDescription>
            <CardTitle className="text-lg font-bold">관리자 기능은 다음 단계에서 제공돼요</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 gap-2">
              {adminCapabilities.map(({ label, icon: Icon }) => (
                <li className="flex min-h-12 items-center gap-2 rounded-[var(--radius)] bg-muted px-3 text-sm font-semibold" key={label}>
                  <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                  {label}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </PageFrame>
    </>
  );
}
