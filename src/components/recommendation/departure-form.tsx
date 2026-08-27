"use client";

import { LoaderCircle, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import type { Building } from "@/domain/university/types";

import {
  buildRecommendationUrl,
  requestDepartureEta,
  type DeparturePhase,
} from "./departure-client";

type DepartureFormProps = {
  buildings: Building[];
  initialBuildingId?: string;
  isInvalid?: boolean;
};

const phaseCopy: Record<DeparturePhase, string> = {
  idle: "현재 위치는 출발 버튼을 누를 때만 사용해요.",
  locating: "현재 위치를 확인하고 있어요…",
  calculating: "실시간 교통으로 도착 시간을 계산하고 있어요…",
  fallback: "위치를 쓸 수 없어 계명대 데모 경로로 계산하고 있어요…",
  error: "경로를 계산하지 못했어요.",
};

export function DepartureForm({
  buildings,
  initialBuildingId = "b1",
  isInvalid = false,
}: DepartureFormProps) {
  const router = useRouter();
  const [buildingId, setBuildingId] = useState(initialBuildingId);
  const [phase, setPhase] = useState<DeparturePhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const isBusy = phase === "locating" || phase === "calculating" || phase === "fallback";
  const errorId = error || isInvalid ? "departure-error" : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const eta = await requestDepartureEta(buildingId, { onPhase: setPhase });
      setPhase("idle");
      router.push(buildRecommendationUrl(eta));
    } catch (caught) {
      setPhase("error");
      setError(caught instanceof Error ? caught.message : "경로를 계산하지 못했어요.");
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-disabled={isBusy || undefined} data-invalid={Boolean(errorId) || undefined}>
          <FieldLabel htmlFor="buildingId">목적지 건물</FieldLabel>
          <NativeSelect
            aria-describedby={errorId ?? "departure-status"}
            aria-invalid={Boolean(errorId) || undefined}
            disabled={isBusy}
            id="buildingId"
            onChange={(event) => setBuildingId(event.target.value)}
            value={buildingId}
          >
            {buildings.map((building) => (
              <NativeSelectOption key={building.buildingId} value={building.buildingId}>
                {building.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        {errorId ? (
          <FieldError id={errorId}>
            {error ?? "자동 출발 정보가 올바르지 않아요. 목적지를 다시 선택해 주세요."}
          </FieldError>
        ) : null}
      </FieldGroup>
      <Button className="h-12 w-full shadow-[0_10px_24px_rgb(3_78_162/0.2)]" disabled={isBusy} type="submit">
        {isBusy ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" data-icon="inline-start" />
        ) : (
          <Navigation aria-hidden="true" data-icon="inline-start" />
        )}
        {isBusy ? "도착 시간 계산 중" : "현재 위치에서 지금 출발"}
      </Button>
      <p aria-live="polite" className="text-center text-xs leading-5 text-muted-foreground" id="departure-status">
        {phaseCopy[phase]}
      </p>
    </form>
  );
}
