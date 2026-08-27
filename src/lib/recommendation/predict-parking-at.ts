import type { ParkingLot, ParkingStatus, ParkingTrendPoint } from "@/domain/parking/types";

const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

function toMinutes(value: string): number | null {
  const match = TIME_PATTERN.exec(value);
  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function trendMinutes(point: ParkingTrendPoint): number {
  return Number(point.hour) * 60;
}

function statusFromAvailability(available: number, capacity: number): ParkingStatus {
  if (available === 0 || capacity <= 0) {
    return "full";
  }

  const ratio = available / capacity;
  if (ratio <= 0.12) {
    return "busy";
  }
  if (ratio <= 0.3) {
    return "moderate";
  }
  return "available";
}

export function predictParkingAt(parkingLot: ParkingLot, arrivalAt: string): ParkingLot {
  const targetMinutes = toMinutes(arrivalAt);
  const points = parkingLot.trend.toSorted(
    (left, right) => trendMinutes(left) - trendMinutes(right),
  );

  if (targetMinutes === null || points.length === 0) {
    return { ...parkingLot };
  }

  const first = points[0];
  const last = points.at(-1)!;
  let predictedAvailable: number;

  if (targetMinutes <= trendMinutes(first)) {
    predictedAvailable = first.available;
  } else if (targetMinutes >= trendMinutes(last)) {
    predictedAvailable = last.available;
  } else {
    const upperIndex = points.findIndex((point) => trendMinutes(point) >= targetMinutes);
    const lower = points[upperIndex - 1];
    const upper = points[upperIndex];
    const interval = trendMinutes(upper) - trendMinutes(lower);
    const progress = (targetMinutes - trendMinutes(lower)) / interval;
    predictedAvailable = Math.round(
      lower.available + (upper.available - lower.available) * progress,
    );
  }

  predictedAvailable = Math.min(parkingLot.capacity, Math.max(0, predictedAvailable));

  return {
    ...parkingLot,
    predictedAvailable,
    status: statusFromAvailability(predictedAvailable, parkingLot.capacity),
  };
}
