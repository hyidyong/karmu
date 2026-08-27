# Karmu Automatic Departure Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace manual arrival-time entry with a current-location departure flow that computes Google road ETA, predicts arrival-time parking congestion, and demonstrates student parking at Keimyung University with richer mock data.

**Architecture:** A client departure component requests browser geolocation and posts a tenant-scoped building ID plus origin coordinates to a small Next.js Route Handler. The server calls Google Routes when possible and returns a normalized ETA, otherwise it returns a deterministic demo estimate. The existing repository boundary remains in place; recommendation data is enriched at read time with time interpolation, student access filtering, and a parking-to-building access matrix.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Vitest, Tailwind CSS 4, shadcn/ui source components, Google Routes REST API, Google Maps JavaScript API.

**Spec:** `docs/superpowers/specs/2026-08-27-karmu-auto-departure-demo-design.md`

## Global Constraints

- Do not add Supabase or Docker for this demo.
- Keep every displayed count, coordinate, vehicle, date, and prediction labeled as mock data in documentation.
- Keep `universityId`, `campusId`, and `parkingLotId` tenant boundaries on every repository read.
- Use KM Blue `#034EA2` for primary actions and KM Red `#E23D3F` only for full, urgent, or error states.
- Buttons and interactive surfaces have no decorative border, use the shared `var(--radius)`, and expose at least a 44px touch target.
- Store real credentials only in ignored `.env.local`; commit only empty names and instructions in `.env.example`.
- The location-denied, Routes-disabled, invalid-key, and network-failure paths must complete with `source: "demo-estimate"`.
- The student recommendation result must exclude `accessType: "staff"` lots.
- Google map code remains route-local to `/map` and dynamically imported.

---

### Task 1: Add normalized ETA domain and Next.js API

**Files:**
- Create: `src/domain/eta/types.ts`
- Create: `src/lib/eta/compute-eta.ts`
- Create: `src/app/api/eta/route.ts`
- Test: `tests/domain/eta.test.ts`

**Interfaces:**
- Consumes: `Coordinates`, `universityRepository.listBuildings(DEFAULT_TENANT)`, `GOOGLE_ROUTES_API_KEY`
- Produces: `EtaRequest`, `EtaResponse`, `parseEtaRequest(value)`, `estimateDemoEta(options)`, `computeEta(options)`, `POST(request)`

- [ ] **Step 1: Write the failing ETA tests**

Create `tests/domain/eta.test.ts` with real input validation, deterministic fallback math, and an injected external fetch:

```ts
import { describe, expect, it } from "vitest";

import { computeEta, estimateDemoEta, parseEtaRequest } from "@/lib/eta/compute-eta";

const building = {
  buildingId: "b1",
  universityId: "kmu",
  campusId: "kmu-seongseo",
  name: "동산도서관",
  coordinates: { lat: 35.8546, lng: 128.4873 },
};
const now = new Date("2026-08-27T03:00:00.000Z");

describe("ETA computation", () => {
  it("rejects an out-of-range coordinate", () => {
    expect(parseEtaRequest({ buildingId: "b1", origin: { lat: 91, lng: 128 } })).toBeNull();
  });

  it("returns a stable demo ETA with a minimum driving time", () => {
    const result = estimateDemoEta({
      building,
      origin: { lat: 35.846, lng: 128.491 },
      departureAt: now,
    });
    expect(result.source).toBe("demo-estimate");
    expect(result.travelMinutes).toBeGreaterThanOrEqual(8);
    expect(result.departureAt).toBe("12:00");
  });

  it("normalizes a successful Google Routes response", async () => {
    const fetchImpl: typeof fetch = async () =>
      new Response(JSON.stringify({ routes: [{ duration: "924s", distanceMeters: 6400 }] }), {
        status: 200,
      });
    const result = await computeEta({
      apiKey: "server-key",
      building,
      departureAt: now,
      fetchImpl,
      origin: { lat: 35.82, lng: 128.53 },
    });
    expect(result).toMatchObject({ source: "google-routes", travelMinutes: 16, distanceMeters: 6400 });
    expect(result.arrivalAt).toBe("12:16");
  });

  it("falls back when Google Routes rejects the request", async () => {
    const fetchImpl: typeof fetch = async () => new Response("denied", { status: 403 });
    const result = await computeEta({
      apiKey: "restricted-key",
      building,
      departureAt: now,
      fetchImpl,
      origin: { lat: 35.82, lng: 128.53 },
    });
    expect(result.source).toBe("demo-estimate");
  });
});
```

- [ ] **Step 2: Run the ETA tests and verify the red state**

Run: `npm test -- --run tests/domain/eta.test.ts`

Expected: FAIL because `@/lib/eta/compute-eta` does not exist.

- [ ] **Step 3: Implement the ETA types and pure computation**

Define in `src/domain/eta/types.ts`:

```ts
export type EtaSource = "google-routes" | "demo-estimate";
export type EtaRequest = {
  buildingId: string;
  origin?: { lat: number; lng: number };
  useDemoOrigin?: boolean;
};
export type EtaResponse = {
  buildingId: string;
  departureAt: string;
  arrivalAt: string;
  travelMinutes: number;
  distanceMeters: number;
  source: EtaSource;
};
```

Implement `parseEtaRequest` with finite-number and coordinate-range checks. Implement Haversine distance, a `1.35` road-distance factor, `28km/h` demo city speed, and an 8-minute minimum. Format all times in `Asia/Seoul`. `computeEta` posts to `https://routes.googleapis.com/directions/v2:computeRoutes` with `DRIVE`, `TRAFFIC_AWARE`, `X-Goog-Api-Key`, and `X-Goog-FieldMask: routes.duration,routes.distanceMeters`. Parse Google duration seconds, round up to whole minutes, and call `estimateDemoEta` for every failure.

- [ ] **Step 4: Implement the tenant-scoped Route Handler**

`POST` parses JSON, validates the building against `DEFAULT_TENANT`, returns `400` for malformed data or an unknown building, then calls `computeEta` with `process.env.GOOGLE_ROUTES_API_KEY`. Never return the upstream error body or key.

- [ ] **Step 5: Verify Task 1 and commit**

Run:

```powershell
npm test -- --run tests/domain/eta.test.ts
npm run typecheck
npm run lint
```

Expected: all commands exit `0` with no warnings from app code.

Commit:

```powershell
git add src/domain/eta src/lib/eta src/app/api/eta tests/domain/eta.test.ts
git commit -m "feat: add automatic route eta api"
```

---

### Task 2: Expand KMU mock data and predict arrival-time student parking

**Files:**
- Modify: `src/domain/parking/types.ts`
- Modify: `src/data/mock/fixtures.ts`
- Create: `src/data/mock/parking-access.ts`
- Create: `src/lib/recommendation/predict-parking-at.ts`
- Modify: `src/data/mock/repositories.ts`
- Modify: `tests/domain/recommendation.test.ts`
- Modify: `tests/domain/repositories.test.ts`

**Interfaces:**
- Consumes: `RecommendationInput { buildingId, arrivalAt }`, `ParkingLot.trend`, `rankParkingLots`
- Produces: `ParkingAccessType`, `ParkingAccess`, `predictParkingAt(parkingLot, arrivalAt)`, tenant-scoped KMU fixtures with 10 buildings and 8 parking lots

- [ ] **Step 1: Write failing prediction and student-access tests**

Add these behaviors to the existing tests:

```ts
it("interpolates arrival availability between adjacent trend points", () => {
  const predicted = predictParkingAt(parkingLots.find((lot) => lot.parkingLotId === "east-gate")!, "10:30");
  expect(predicted.predictedAvailable).toBe(31);
});

it("returns only student-accessible lots and changes first place by destination", async () => {
  const library = await recommendationRepository.recommend(DEFAULT_TENANT, {
    buildingId: "b1",
    arrivalAt: "10:30",
  });
  const engineering = await recommendationRepository.recommend(DEFAULT_TENANT, {
    buildingId: "b6",
    arrivalAt: "10:30",
  });
  expect(library[0].parkingLot.parkingLotId).toBe("east-gate");
  expect(engineering[0].parkingLot.parkingLotId).toBe("south-gate");
  expect(library.every((item) => item.parkingLot.accessType !== "staff")).toBe(true);
});

it("provides the expanded KMU demo inventory", async () => {
  expect((await universityRepository.listBuildings(DEFAULT_TENANT))).toHaveLength(10);
  expect((await parkingRepository.listByCampus(DEFAULT_TENANT))).toHaveLength(8);
});
```

- [ ] **Step 2: Run focused tests and verify they fail for missing behavior**

Run: `npm test -- --run tests/domain/recommendation.test.ts tests/domain/repositories.test.ts`

Expected: FAIL because `predictParkingAt`, `accessType`, the expanded inventory, and destination-sensitive ranking are absent.

- [ ] **Step 3: Add access types and expanded fixtures**

Add to `ParkingLot`:

```ts
export type ParkingAccessType = "student" | "staff" | "shared";
accessType: ParkingAccessType;
```

Keep `east-gate` for route compatibility but rename it `동문 학생주차장`. Replace the KMU inventory with exactly these eight IDs: `east-gate`, `south-gate`, `student-1`, `student-2`, `engineering-student`, `stadium-temp`, `main-staff`, `central`. Add buildings `b4` through `b10`. Give each parking lot its own six-point trend and keep a single duplicate `east-gate` fixture for the existing `hanbit` tenant-isolation test.

Set the `east-gate` 09:00 and 12:00 trend values to `28` and `34`, so the independently checked 10:30 interpolation result is exactly `31`.

- [ ] **Step 4: Add destination access matrix and time interpolation**

Define:

```ts
export type ParkingAccess = {
  parkingLotId: string;
  buildingId: string;
  walkMinutes: number;
  distanceMeters: number;
};
```

Provide an entry for every student/shared KMU lot and every KMU building. `predictParkingAt` parses `HH:mm`, linearly interpolates the surrounding trend values, clamps the result to `0..capacity`, and derives status by available ratio: `0` full, `<= 0.12` busy, `<= 0.3` moderate, otherwise available.

- [ ] **Step 5: Make recommendation repository arrival- and destination-sensitive**

Filter KMU lots to `student` or `shared`, apply `predictParkingAt`, replace each lot's walk/distance values from the access matrix, rank the enriched lots, and return the top three. Keep `ParkingRepository.listByCampus` unfiltered so staff and full lots remain visible on the map.

- [ ] **Step 6: Verify Task 2 and commit**

Run:

```powershell
npm test
npm run typecheck
npm run lint
```

Commit:

```powershell
git add src/domain/parking src/data/mock src/lib/recommendation tests/domain
git commit -m "feat: expand kmu student parking predictions"
```

---

### Task 3: Replace manual time input with app-like departure interactions

**Files:**
- Create: `src/components/recommendation/departure-client.ts`
- Create: `src/components/recommendation/departure-form.tsx`
- Create: `src/components/recommendation/quick-departure.tsx`
- Create: `src/components/recommendation/trip-summary.tsx`
- Delete: `src/components/recommendation/destination-form.tsx`
- Modify: `src/lib/recommendation/search-params.ts`
- Modify: `tests/domain/recommendation-search-params.test.ts`
- Modify: `src/app/(student)/page.tsx`
- Modify: `src/app/(student)/recommend/page.tsx`
- Modify: `src/components/recommendation/recommendation-card.tsx`
- Modify: `src/components/recommendation/recommendation-list.tsx`
- Modify: `src/app/(student)/parking/[parkingLotId]/page.tsx`

**Interfaces:**
- Consumes: `POST /api/eta`, browser geolocation, `Building[]`, `EtaResponse`
- Produces: `requestDepartureEta(buildingId)`, `buildRecommendationUrl(eta)`, `DepartureForm`, `QuickDeparture`, `TripSummary`, parsed trip metadata in recommendation routes

Define a `ParsedRecommendationQuery` result that extends the existing recommendation input with an optional validated `trip` object. Require that object before rendering auto-departure results, while keeping the parser reusable for safe detail/back links.

- [ ] **Step 1: Write failing URL and trip-metadata tests**

Extend `tests/domain/recommendation-search-params.test.ts`:

```ts
it("parses automatic trip metadata", () => {
  expect(
    parseRecommendationQuery(
      {
        buildingId: "b2",
        arrivalAt: "10:30",
        departureAt: "10:12",
        travelMinutes: "18",
        distanceMeters: "6400",
        etaSource: "google-routes",
      },
      ["b1", "b2"],
    ),
  ).toMatchObject({
    buildingId: "b2",
    arrivalAt: "10:30",
    trip: { departureAt: "10:12", travelMinutes: 18, distanceMeters: 6400, source: "google-routes" },
  });
});

it("rejects non-numeric or unsupported trip metadata", () => {
  expect(
    parseRecommendationQuery(
      { buildingId: "b1", arrivalAt: "10:30", travelMinutes: "NaN", etaSource: "other" },
      ["b1"],
    ),
  ).toBeNull();
});
```

- [ ] **Step 2: Run the focused parser test and verify red**

Run: `npm test -- --run tests/domain/recommendation-search-params.test.ts`

Expected: FAIL because the parser does not produce validated trip metadata.

- [ ] **Step 3: Implement the browser departure client**

`requestDepartureEta(buildingId)` first requests geolocation with `enableHighAccuracy: true`, `timeout: 7000`, and `maximumAge: 60000`. POST the coordinates to `/api/eta`. If geolocation rejects, repeat the POST with `{ buildingId, useDemoOrigin: true }`. Throw a Korean user-facing error only when both requests fail.

`buildRecommendationUrl` emits:

```text
/recommend?buildingId=<id>&arrivalAt=<HH:mm>&departureAt=<HH:mm>&travelMinutes=<n>&distanceMeters=<n>&etaSource=<source>
```

- [ ] **Step 4: Build `DepartureForm` and `QuickDeparture`**

Both are Client Components with visible idle, locating, route-calculating, fallback, and failure states. `DepartureForm` uses the existing filled `NativeSelect`, removes the time input, and uses a blue `현재 위치에서 지금 출발` submit button. `QuickDeparture` is the home CTA for default `b1`. Both navigate with `router.push(buildRecommendationUrl(response))`; no clickable element is left without a route or state change.

- [ ] **Step 5: Render trip summary and preserve metadata through details**

`TripSummary` renders destination, `약 N분`, `HH:mm 도착`, distance in km, and `Google 교통 반영` or `데모 추정`. Recommendation cards preserve all trip query fields when linking to detail. The detail page preserves them when linking back to recommendations and forward to `/map`.

- [ ] **Step 6: Update home and recommendation copy**

Home copy becomes `목적지만 고르면 도착 시간과 주차 혼잡도를 자동으로 계산해요.` The destination surface contains no fixed `오늘 10:30`. The recommendation page heading becomes `어디로 출발할까요?`, removes all manual time controls, and shows the result section only with valid auto-trip metadata.

- [ ] **Step 7: Verify Task 3 and commit**

Run:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

Commit:

```powershell
git add src/app src/components/recommendation src/lib/recommendation tests/domain/recommendation-search-params.test.ts
git commit -m "feat: add current-location departure flow"
```

---

### Task 4: Configure local keys, verify live/fallback maps, and publish repository

**Files:**
- Modify: `.env.example`
- Create ignored local file: `.env.local`
- Modify: `README.md`
- Modify if browser QA finds a regression: `src/components/map/*`, `src/app/globals.css`, or the affected route component

**Interfaces:**
- Consumes: user-provided Google key, GitHub CLI authenticated as `hyidyong`
- Produces: local Google Maps/Routes configuration, documented environment template, private `hyidyong/karmu` GitHub repository, green mobile QA evidence

- [ ] **Step 1: Configure environment files without committing the credential**

`.env.example` must contain exactly the three empty variables and comments describing restrictions:

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
GOOGLE_ROUTES_API_KEY=
```

Create `.env.local` with the supplied key assigned to `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `GOOGLE_ROUTES_API_KEY`; leave the map ID empty. Confirm `git status --short --ignored` reports `.env.local` as ignored.

- [ ] **Step 2: Update setup and cost documentation**

README must explain Maps JavaScript API plus Routes API enablement, billing/quota behavior, `.env.local` handling, browser/server key separation for deployment, the demo fallback, the expanded KMU mock inventory, and why Supabase is deferred.

- [ ] **Step 3: Run fresh automated verification**

Run in this order:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
git diff --check
```

Expected: 0 failed tests, 0 type errors, 0 lint errors, successful build including `/api/eta`, 0 high vulnerabilities, and no whitespace errors.

- [ ] **Step 4: Run browser validation on the production build**

Start `npm start`. Use the in-app Browser at 320, 375, 390, 430, and 480px. Validate:

- `/` → `현재 위치에서 지금 출발`
- geolocation success when permission is available, otherwise visible demo fallback
- recommendation result contains ETA summary and exactly three student/shared lots
- destination `b1` ranks `east-gate` first and `b6` ranks `south-gate` first
- detail and map links navigate
- live Google map when the key is accepted; accessible list fallback when rejected
- no horizontal overflow, no sub-44px control, no content hidden under bottom navigation
- no Next.js overlay and no unexplained console warning/error

Capture updated home, departure result, and map screenshots outside the repository.

- [ ] **Step 5: Commit configuration and documentation**

```powershell
git add .env.example README.md src tests
git commit -m "docs: configure karmu departure demo"
```

Verify `.env.local` is absent from `git ls-files` and the tree is clean.

- [ ] **Step 6: Create and publish the private GitHub repository**

Run:

```powershell
gh repo create hyidyong/karmu --private --source . --remote origin --description "계명대학교 도착시점 기반 학생 주차 예측 PWA"
git switch -c main
git push -u origin main
gh repo edit hyidyong/karmu --default-branch main
gh repo view hyidyong/karmu --json nameWithOwner,isPrivate,defaultBranchRef,url
```

If `hyidyong/karmu` already exists, inspect it and stop before changing its remote or contents. Do not force-push. The final verification must show a private repository, `main` as default, and `.env.local` absent from the remote history.
