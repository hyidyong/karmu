import { CalendarDays, CircleCheckBig, FileCheck2 } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VehicleOverview } from "@/domain/vehicle/types";

type Pass = NonNullable<VehicleOverview["pass"]>;

type PassCardProps = {
  pass: Pass;
};

const requiredDocuments = ["자동차 등록증", "재학증명서", "보험증서"];

export function PassCard({ pass }: PassCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-semibold text-primary">주차 정기권</CardDescription>
        <CardTitle className="text-xl font-bold">{pass.name}</CardTitle>
        <CardAction>
          <span className="rounded-[var(--radius)] bg-accent px-3 py-2 text-xs font-bold text-primary">
            사용 중
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-[var(--radius)] bg-muted p-4">
          <CalendarDays aria-hidden="true" className="size-5 shrink-0 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">유효 기간</p>
            <p className="mt-0.5 font-semibold">{pass.validFrom} – {pass.validTo}</p>
          </div>
        </div>
        <div>
          <p className="mb-3 flex items-center gap-2 font-bold">
            <FileCheck2 aria-hidden="true" className="size-5 text-primary" />
            제출 서류
          </p>
          <ul className="flex flex-col gap-2">
            {requiredDocuments.map((document) => (
              <li className="flex min-h-11 items-center justify-between rounded-[var(--radius)] bg-muted px-4" key={document}>
                <span className="text-sm font-medium">{document}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-primary">
                  <CircleCheckBig aria-hidden="true" className="size-4" />
                  제출 완료
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
