import { universityRepository } from "@/data/mock/repositories";
import type { Coordinates } from "@/domain/university/types";
import { computeEta, parseEtaRequest } from "@/lib/eta/compute-eta";
import { DEFAULT_TENANT } from "@/lib/tenant/default-tenant";

const DEMO_ORIGIN: Coordinates = { lat: 35.846, lng: 128.491 };

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "요청 형식을 확인해 주세요." }, { status: 400 });
  }

  const parsed = parseEtaRequest(payload);
  if (!parsed) {
    return Response.json({ error: "출발 위치를 확인해 주세요." }, { status: 400 });
  }

  const buildings = await universityRepository.listBuildings(DEFAULT_TENANT);
  const building = buildings.find((item) => item.buildingId === parsed.buildingId);
  if (!building) {
    return Response.json({ error: "목적지를 찾을 수 없습니다." }, { status: 400 });
  }

  const result = await computeEta({
    apiKey: process.env.GOOGLE_ROUTES_API_KEY,
    building,
    departureAt: new Date(),
    origin: parsed.origin ?? DEMO_ORIGIN,
  });

  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
