import type { ParkingTrendPoint } from "@/domain/parking/types";

type OccupancyTrendProps = {
  trend: ParkingTrendPoint[];
  arrivalAt: string;
};

export function OccupancyTrend({ trend, arrivalAt }: OccupancyTrendProps) {
  const max = Math.max(...trend.map((point) => point.available), 1);
  const points = trend
    .map((point, index) => {
      const x = trend.length === 1 ? 160 : 16 + (index * 288) / (trend.length - 1);
      const y = 112 - (point.available / max) * 88;
      return `${x},${y}`;
    })
    .join(" ");
  const lowest = trend.reduce((min, point) => (point.available < min.available ? point : min));

  return (
    <figure className="rounded-[var(--radius)] bg-muted p-4" aria-labelledby="occupancy-trend-heading">
      <figcaption id="occupancy-trend-heading" className="font-bold">
        시간대별 잔여면 예측
      </figcaption>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        {arrivalAt} 도착 기준 · 가장 붐비는 시간은 {lowest.hour}시 전후예요.
      </p>
      <svg
        aria-label="06시부터 22시까지 예상 잔여 주차면 변화"
        className="mt-4 h-auto w-full overflow-visible"
        role="img"
        viewBox="0 0 320 145"
      >
        <line stroke="var(--border)" strokeWidth="1" x1="16" x2="304" y1="24" y2="24" />
        <line stroke="var(--border)" strokeWidth="1" x1="16" x2="304" y1="68" y2="68" />
        <line stroke="var(--border)" strokeWidth="1" x1="16" x2="304" y1="112" y2="112" />
        <polyline
          fill="none"
          points={points}
          stroke="var(--primary)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        {trend.map((point, index) => {
          const x = trend.length === 1 ? 160 : 16 + (index * 288) / (trend.length - 1);
          const y = 112 - (point.available / max) * 88;

          return (
            <g key={point.hour}>
              <circle cx={x} cy={y} fill="white" r="4" stroke="var(--primary)" strokeWidth="3" />
              <text fill="var(--muted-ink)" fontSize="10" textAnchor="middle" x={x} y="137">
                {point.hour}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
