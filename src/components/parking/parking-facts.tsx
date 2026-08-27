import { BadgeCheck, Banknote, BatteryCharging, Clock3 } from "lucide-react";

import type { ParkingLot } from "@/domain/parking/types";

type ParkingFactsProps = {
  parkingLot: ParkingLot;
};

export function ParkingFacts({ parkingLot }: ParkingFactsProps) {
  const facts = [
    { label: "운영 시간", value: parkingLot.operatingHours, icon: Clock3 },
    { label: "주차 요금", value: parkingLot.feeText, icon: Banknote },
    { label: "이용 대상", value: parkingLot.eligibility, icon: BadgeCheck },
    { label: "전기차", value: "충전면 8면 이용 가능", icon: BatteryCharging },
  ];

  return (
    <section aria-labelledby="parking-facts-heading" className="flex flex-col gap-4">
      <h2 id="parking-facts-heading" className="text-xl font-bold tracking-[-0.02em]">
        이용 안내
      </h2>
      <dl className="flex flex-col gap-2 rounded-[var(--radius)] bg-muted p-3">
        {facts.map(({ label, value, icon: Icon }) => (
          <div className="flex min-h-16 items-center gap-3 rounded-[var(--radius)] bg-white px-4" key={label}>
            <Icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 font-semibold">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
