import type { Building } from "@/domain/university/types";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

type DestinationFormProps = {
  buildings: Building[];
  buildingId?: string;
  arrivalAt?: string;
  isInvalid?: boolean;
};

export function DestinationForm({
  buildings,
  buildingId = "b1",
  arrivalAt = "10:30",
  isInvalid = false,
}: DestinationFormProps) {
  const errorId = isInvalid ? "recommendation-query-error" : undefined;

  return (
    <form action="/recommend" className="flex flex-col gap-5" method="get">
      <FieldGroup>
        <Field data-invalid={isInvalid || undefined}>
          <FieldLabel htmlFor="buildingId">목적지 건물</FieldLabel>
          <NativeSelect
            aria-describedby={errorId}
            aria-invalid={isInvalid || undefined}
            defaultValue={buildingId}
            id="buildingId"
            name="buildingId"
          >
            {buildings.map((building) => (
              <NativeSelectOption key={building.buildingId} value={building.buildingId}>
                {building.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field data-invalid={isInvalid || undefined}>
          <FieldLabel htmlFor="arrivalAt">도착 예정 시간</FieldLabel>
          <Input
            aria-describedby={errorId}
            aria-invalid={isInvalid || undefined}
            defaultValue={arrivalAt}
            id="arrivalAt"
            name="arrivalAt"
            required
            type="time"
          />
        </Field>
        {isInvalid ? (
          <FieldError id={errorId}>
            목적지와 시간을 다시 확인해 주세요.
          </FieldError>
        ) : null}
      </FieldGroup>
      <Button className="h-12 w-full shadow-[0_10px_24px_rgb(3_78_162/0.2)]" type="submit">
        추천 결과 보기
      </Button>
    </form>
  );
}
