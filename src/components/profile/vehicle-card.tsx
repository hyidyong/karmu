import { CarFront, CircleCheckBig } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VehicleOverview } from "@/domain/vehicle/types";

type Vehicle = VehicleOverview["vehicles"][number];

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card id="vehicle">
      <CardHeader>
        <CardDescription className="font-semibold text-primary">등록 차량</CardDescription>
        <CardTitle className="text-xl font-bold">{vehicle.plateNumber}</CardTitle>
        <CardAction>
          <span className="flex min-h-8 items-center gap-1.5 rounded-[var(--radius)] bg-accent px-3 text-xs font-bold text-primary">
            <CircleCheckBig aria-hidden="true" className="size-4" />
            승인 완료
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 rounded-[var(--radius)] bg-muted p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] bg-white text-primary">
            <CarFront aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="font-semibold">{vehicle.modelName}</p>
            <p className="mt-1 text-xs text-muted-foreground">계명대학교 성서캠퍼스 등록 차량</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
