import { Clock3, MapPin, Route } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecommendationTrip } from "@/domain/recommendation/types";

type TripSummaryProps = {
  arrivalAt: string;
  destinationName: string;
  trip: RecommendationTrip;
};

export function TripSummary({ arrivalAt, destinationName, trip }: TripSummaryProps) {
  const distance = trip.distanceMeters >= 1_000
    ? `${(trip.distanceMeters / 1_000).toFixed(1)}km`
    : `${trip.distanceMeters}m`;

  return (
    <Card className="shadow-[0_16px_40px_rgb(3_78_162/0.12)]">
      <CardHeader>
        <CardDescription className="font-semibold text-primary">
          {trip.source === "google-routes" ? "Google 교통 반영" : "데모 경로 추정"}
        </CardDescription>
        <CardTitle className="text-xl font-bold">{destinationName}까지 약 {trip.travelMinutes}분</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-2">
          <div className="rounded-[var(--radius)] bg-accent p-3">
            <Clock3 aria-hidden="true" className="size-4 text-primary" />
            <dt className="mt-2 text-xs text-muted-foreground">도착</dt>
            <dd className="mt-0.5 font-bold">{arrivalAt}</dd>
          </div>
          <div className="rounded-[var(--radius)] bg-muted p-3">
            <Route aria-hidden="true" className="size-4 text-primary" />
            <dt className="mt-2 text-xs text-muted-foreground">이동</dt>
            <dd className="mt-0.5 font-bold">약 {trip.travelMinutes}분</dd>
          </div>
          <div className="rounded-[var(--radius)] bg-muted p-3">
            <MapPin aria-hidden="true" className="size-4 text-primary" />
            <dt className="mt-2 text-xs text-muted-foreground">거리</dt>
            <dd className="mt-0.5 font-bold">{distance}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
