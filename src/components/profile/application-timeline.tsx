import { CircleCheckBig } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VehicleOverview } from "@/domain/vehicle/types";

type ApplicationTimelineProps = {
  steps: VehicleOverview["applicationSteps"];
};

export function ApplicationTimeline({ steps }: ApplicationTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-semibold text-primary">차량 등록 신청</CardDescription>
        <CardTitle className="text-xl font-bold">처리 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-2">
          {steps.map((step, index) => (
            <li className="flex gap-3" key={step.label}>
              <div className="flex flex-col items-center">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius)] bg-accent text-primary">
                  <CircleCheckBig aria-hidden="true" className="size-4" />
                </span>
                {index < steps.length - 1 ? <span className="my-1 h-7 w-0.5 bg-accent" /> : null}
              </div>
              <div className="pt-1">
                <p className="font-semibold">{step.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{step.completedAt}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
