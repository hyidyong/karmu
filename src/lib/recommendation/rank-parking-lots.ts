import type { RankableParkingLot } from "@/domain/parking/types";
import type { ParkingRank } from "@/domain/recommendation/types";

export function rankParkingLots(parkingLots: RankableParkingLot[]): ParkingRank[] {
  const rankedParkingLots = parkingLots
    .filter((parkingLot) => parkingLot.status !== "full" && parkingLot.predictedAvailable > 0)
    .map((parkingLot) => {
      const availability = Math.min(parkingLot.predictedAvailable / parkingLot.capacity, 1) * 50;
      const distance = Math.max(0, 1 - parkingLot.walkMinutes / 20) * 30;
      const confidence = (parkingLot.confidence / 100) * 20;

      return {
        parkingLotId: parkingLot.parkingLotId,
        score: Math.round((availability + distance + confidence) * 10) / 10,
        walkMinutes: parkingLot.walkMinutes,
        reasons: [
          `도착 시 ${parkingLot.predictedAvailable}면 예상`,
          `목적지까지 도보 ${parkingLot.walkMinutes}분`,
          `예측 신뢰도 ${parkingLot.confidence}%`,
        ],
      };
    })
    .sort((left, right) => right.score - left.score || left.walkMinutes - right.walkMinutes)
    .slice(0, 3);

  return rankedParkingLots.map((rank) => ({
    parkingLotId: rank.parkingLotId,
    score: rank.score,
    reasons: rank.reasons,
  }));
}
