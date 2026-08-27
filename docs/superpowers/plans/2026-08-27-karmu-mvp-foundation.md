# Karmu MVP Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fast, installable mobile-first Next.js MVP that lets a university user inspect parking conditions, request an arrival-time recommendation, view a parking lot, and manage vehicle/pass information with mock multi-university data.

**Architecture:** Use Next.js App Router and Server Components for every static/data-composition boundary, with small Client Components only for navigation state, service-worker registration, forms that need local interaction, and Google Maps. Put tenant-aware contracts and mock repositories outside the UI so a later API or Supabase implementation can replace them without changing pages.

**Tech Stack:** Next.js 16.3.3, React 19.2.8, TypeScript 6.0.3, Tailwind CSS 4.3.3, shadcn/ui source components, Vitest 4.1.11, Lucide React 1.34.0, `@vis.gl/react-google-maps` 1.9.0, `@googlemaps/markerclusterer` 2.6.2

**Spec:** `docs/superpowers/specs/2026-08-27-karmu-mvp-foundation-design.md`

## Global Constraints

- Support mobile viewports from 320px wide; center content at a maximum width of 480px on larger screens.
- Use `100dvh`, `env(safe-area-inset-*)`, 44px minimum touch targets, and keyboard-safe bottom padding.
- Use KM BLUE `#034EA2` for primary actions and KM RED `#E23D3F` only for full/error/urgent states.
- Use one `--radius: 1rem` token for buttons, cards, inputs, sheets, alerts, and badges; only inherently circular markers/icon buttons may be round.
- Default buttons, cards, and inputs have no border; use neutral fills, spacing, separators, and a low-opacity shadow for hierarchy.
- Keep inline CSS out of application components except values required by the Google Maps runtime API.
- Do not add chart, global-state, server-state, animation, or heavyweight PWA libraries.
- Do not load Google Maps code on the home, recommendation, parking-detail, or profile routes.
- Keep real secrets out of Git; commit only `.env.example`.
- Every university-scoped entity includes `universityId` and `campusId`; parking entities also include `parkingLotId` or `parkingZoneId` as applicable.
- The provided Google sample is Apache-2.0; preserve its copyright header in any substantially adapted map source.

## File Map

```text
package.json                         dependency and script contract
next.config.ts                      conservative Next.js configuration
tsconfig.json                       strict TypeScript and @/* alias
eslint.config.mjs                   Next.js Core Web Vitals and TypeScript linting
postcss.config.mjs                  Tailwind CSS PostCSS integration
vitest.config.ts                    Node-focused unit test configuration
components.json                     shadcn/ui source-component configuration
.env.example                        public Google Maps key/map ID names only
src/app/layout.tsx                  root metadata, viewport, and service worker registration
src/app/manifest.ts                 installable PWA metadata
src/app/globals.css                 design tokens, reset, mobile shell, focus styles
src/app/(student)/layout.tsx        centered mobile shell and bottom navigation
src/app/(student)/page.tsx          task-first home screen
src/app/(student)/map/page.tsx      map/list route
src/app/(student)/recommend/page.tsx recommendation form and ranked results
src/app/(student)/parking/[parkingLotId]/page.tsx parking detail
src/app/(student)/profile/page.tsx  vehicle/pass/application summary
src/app/not-found.tsx               invalid parking lot/tenant recovery
src/components/app-shell/*          header, navigation, page frame
src/components/parking/*            status, parking cards, small trend SVG
src/components/recommendation/*     destination form and ranked result list
src/components/map/*                no-key fallback, lazy loader, Google map client
src/components/profile/*            vehicle, pass, and application status cards
src/components/pwa/service-worker-register.tsx tiny registration boundary
src/components/ui/button.tsx        shadcn button customized to be borderless
src/domain/*                         stable entity and recommendation types
src/data/contracts/repositories.ts  backend-replaceable repository interfaces
src/data/mock/*                      tenant-aware mock fixtures and repositories
src/lib/recommendation/rank-parking-lots.ts pure explainable ranker
src/lib/tenant/default-tenant.ts     initial KMU tenant context
src/lib/utils/cn.ts                  class merging helper generated with shadcn
public/icons/karmu.svg              lightweight scalable PWA icon
public/icons/karmu-maskable.svg     maskable PWA icon
public/sw.js                         small app-shell/offline service worker
tests/domain/recommendation.test.ts ranking contract tests
tests/domain/repositories.test.ts   tenant isolation tests
tests/ui/navigation.test.ts         active-navigation resolver tests
tests/ui/map-fallback.test.ts       map-key fallback state tests
```

---

### Task 1: Bootstrap the verified Next.js mobile PWA foundation

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `components.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/manifest.ts`
- Create: `src/app/offline/page.tsx`
- Create: `src/components/pwa/service-worker-register.tsx`
- Create: `public/sw.js`
- Create: `public/icons/karmu.svg`
- Create: `public/icons/karmu-maskable.svg`
- Modify: `README.md`

**Interfaces:**
- Consumes: approved design spec and the official KMU color values
- Produces: `npm run dev`, `npm run test`, `npm run typecheck`, `npm run lint`, and `npm run build`; CSS tokens `--primary`, `--critical`, `--radius`; install metadata; service-worker registration

- [ ] **Step 1: Record the pre-bootstrap failure**

Run: `npm run build`

Expected: FAIL because `package.json` does not exist. Preserve the terminal output as the red state for this setup task.

- [ ] **Step 2: Create the package and toolchain contract**

Create `package.json` with this dependency boundary:

```json
{
  "name": "karmu",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --cache"
  },
  "dependencies": {
    "@googlemaps/markerclusterer": "2.6.2",
    "@vis.gl/react-google-maps": "1.9.0",
    "lucide-react": "1.34.0",
    "next": "16.3.3",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.3.3",
    "@types/node": "26.4.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.5",
    "eslint": "9.39.5",
    "eslint-config-next": "16.3.3",
    "tailwindcss": "4.3.3",
    "typescript": "6.0.3",
    "vitest": "4.1.11"
  }
}
```

Run: `npm install`

Expected: exit 0 and a new `package-lock.json`.

- [ ] **Step 3: Configure Next.js, TypeScript, Tailwind, ESLint, and Vitest**

Use strict TypeScript with `@/*` mapped to `./src/*`. Configure Vitest for the Node environment and include `tests/**/*.test.ts`. Use Tailwind 4 through `@tailwindcss/postcss`; do not create a Tailwind 3 config file.

Initialize shadcn in the existing project and add only Button:

```powershell
npx shadcn@latest init --defaults
npx shadcn@latest add button
```

After the CLI runs, change the Button base class to use the shared radius, filled variants, a visible `focus-visible:ring-2`, and no default border class.

- [ ] **Step 4: Create the global mobile design system**

Start `src/app/globals.css` with the exact token direction below:

```css
@import "tailwindcss";

:root {
  --primary: #034ea2;
  --primary-foreground: #ffffff;
  --critical: #e23d3f;
  --ink: #231f20;
  --muted-ink: #68717d;
  --background: #f4f6f8;
  --surface: #ffffff;
  --surface-muted: #eef2f5;
  --radius: 1rem;
  --shadow-card: 0 10px 30px rgb(35 31 32 / 0.06);
}

* { box-sizing: border-box; }
html { background: var(--background); }
body {
  min-width: 320px;
  min-height: 100dvh;
  margin: 0;
  color: var(--ink);
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif;
  -webkit-font-smoothing: antialiased;
}
button, input, select { font: inherit; }
:focus-visible { outline: 3px solid color-mix(in srgb, var(--primary) 35%, transparent); outline-offset: 2px; }
```

The student shell uses `width: min(100%, 480px)`, `min-height: 100dvh`, and bottom padding equal to navigation height plus `env(safe-area-inset-bottom)`.

- [ ] **Step 5: Add install metadata and a truthful offline boundary**

`src/app/manifest.ts` returns `name: "Karmu"`, `short_name: "Karmu"`, `display: "standalone"`, `start_url: "/"`, `background_color: "#F4F6F8"`, `theme_color: "#034EA2"`, and the two SVG icons using `sizes: "any"`; mark the second icon `purpose: "maskable"`.

`public/sw.js` caches only `/`, `/offline`, and the local icon files under a versioned `karmu-shell-v1` cache. It must never cache Google Maps requests or parking/recommendation JSON. Navigation requests use network first and fall back to `/offline`.

Create the initial `/offline` page in this task with the text `인터넷 연결을 확인해 주세요`, an explanation that real-time parking and recommendations require a connection, and a Link back to `/`. Task 6 only polishes this already-working route.

`ServiceWorkerRegister` calls `navigator.serviceWorker.register("/sw.js")` in `useEffect` only when `"serviceWorker" in navigator` and `process.env.NODE_ENV === "production"`.

- [ ] **Step 6: Verify and commit the foundation**

Run:

```powershell
npm run typecheck
npm run lint
npm run build
```

Expected: all three commands exit 0; build output lists `/` and `/manifest.webmanifest` after the first page is added in Task 3. Until Task 3, use a minimal `src/app/page.tsx` returning `<main>Karmu</main>` so this task can build independently.

Commit:

```powershell
git add package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs postcss.config.mjs vitest.config.ts components.json .gitignore .env.example README.md src public
git commit -m "chore: bootstrap karmu mobile pwa"
```

---

### Task 2: Define tenant-aware domain contracts and mock repositories

**Files:**
- Create: `src/domain/university/types.ts`
- Create: `src/domain/parking/types.ts`
- Create: `src/domain/recommendation/types.ts`
- Create: `src/domain/vehicle/types.ts`
- Create: `src/data/contracts/repositories.ts`
- Create: `src/data/mock/fixtures.ts`
- Create: `src/data/mock/repositories.ts`
- Create: `src/lib/tenant/default-tenant.ts`
- Create: `src/lib/recommendation/rank-parking-lots.ts`
- Test: `tests/domain/recommendation.test.ts`
- Test: `tests/domain/repositories.test.ts`

**Interfaces:**
- Consumes: no UI code; fixed default tenant `universityId: "kmu"`, `campusId: "kmu-seongseo"`
- Produces: `TenantContext`, `UniversityBrand`, `Building`, `ParkingLot`, `ParkingRecommendation`, `VehicleOverview`; repository singletons `universityRepository`, `parkingRepository`, `recommendationRepository`, `vehicleRepository`

- [ ] **Step 1: Write the failing recommendation tests**

Create `tests/domain/recommendation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { rankParkingLots } from "@/lib/recommendation/rank-parking-lots";

describe("rankParkingLots", () => {
  it("ranks availability, walking time, and confidence and returns three results", () => {
    const results = rankParkingLots([
      { parkingLotId: "far", predictedAvailable: 42, capacity: 100, walkMinutes: 14, confidence: 90, status: "available" },
      { parkingLotId: "best", predictedAvailable: 34, capacity: 80, walkMinutes: 4, confidence: 88, status: "available" },
      { parkingLotId: "full", predictedAvailable: 0, capacity: 60, walkMinutes: 2, confidence: 95, status: "full" },
      { parkingLotId: "middle", predictedAvailable: 18, capacity: 70, walkMinutes: 7, confidence: 80, status: "moderate" }
    ]);

    expect(results.map((result) => result.parkingLotId)).toEqual(["best", "middle", "far"]);
    expect(results[0].reasons).toContain("목적지까지 도보 4분");
  });
});
```

The test fixture type is `RankableParkingLot`, a deliberately small input type declared beside the ranker.

- [ ] **Step 2: Run the focused test to prove the red state**

Run: `npm test -- tests/domain/recommendation.test.ts`

Expected: FAIL because `rankParkingLots` does not exist.

- [ ] **Step 3: Implement the exact domain model and ranker**

Define:

```ts
export type TenantContext = { universityId: string; campusId: string };
export type Coordinates = { lat: number; lng: number };
export type ParkingStatus = "available" | "moderate" | "busy" | "full";

export type ParkingLot = {
  parkingLotId: string;
  universityId: string;
  campusId: string;
  name: string;
  capacity: number;
  currentAvailable: number;
  predictedAvailable: number;
  confidence: number;
  walkMinutes: number;
  distanceMeters: number;
  status: ParkingStatus;
  coordinates: Coordinates;
  operatingHours: string;
  feeText: string;
  eligibility: string;
};

export type UniversityBrand = {
  universityId: string;
  name: string;
  campusName: string;
  primaryColor: "#034EA2";
  criticalColor: "#E23D3F";
};
export type Building = {
  buildingId: string;
  universityId: string;
  campusId: string;
  name: string;
  coordinates: Coordinates;
};
export type RecommendationInput = { buildingId: string; arrivalAt: string };
export type ParkingRank = { parkingLotId: string; score: number; reasons: string[] };
export type ParkingRecommendation = {
  parkingLot: ParkingLot;
  score: number;
  reasons: string[];
};
export type VehicleOverview = {
  vehicles: Array<{ vehicleId: string; plateNumber: string; modelName: string; status: "approved" }>;
  pass: { name: string; validFrom: string; validTo: string; status: "active" } | null;
  applicationSteps: Array<{ label: string; completedAt: string }>;
};

export type RankableParkingLot = Pick<
  ParkingLot,
  "parkingLotId" | "predictedAvailable" | "capacity" | "walkMinutes" | "confidence" | "status"
>;

export interface UniversityRepository {
  getBrand(tenant: TenantContext): Promise<UniversityBrand>;
  listBuildings(tenant: TenantContext): Promise<Building[]>;
}
export interface ParkingRepository {
  listByCampus(tenant: TenantContext): Promise<ParkingLot[]>;
  getById(tenant: TenantContext, parkingLotId: string): Promise<ParkingLot | undefined>;
}
export interface RecommendationRepository {
  recommend(tenant: TenantContext, input: RecommendationInput): Promise<ParkingRecommendation[]>;
}
export interface VehicleRepository {
  getOverview(tenant: TenantContext): Promise<VehicleOverview>;
}
```

`rankParkingLots` excludes `status === "full"` and `predictedAvailable <= 0`, then calculates:

```ts
const availability = Math.min(lot.predictedAvailable / lot.capacity, 1) * 50;
const distance = Math.max(0, 1 - lot.walkMinutes / 20) * 30;
const confidence = (lot.confidence / 100) * 20;
const score = Math.round((availability + distance + confidence) * 10) / 10;
```

Sort by descending score, break ties by shorter `walkMinutes`, and return the first three. Reasons are exactly `도착 시 ${predictedAvailable}면 예상`, `목적지까지 도보 ${walkMinutes}분`, and `예측 신뢰도 ${confidence}%`.

- [ ] **Step 4: Write and run tenant-isolation tests**

Create two fixtures with the same `parkingLotId` under different `universityId` values. Assert that `parkingRepository.listByCampus({ universityId: "kmu", campusId: "kmu-seongseo" })` returns only KMU records and `getById` never crosses the tenant boundary.

Run: `npm test -- tests/domain`

Expected: both test files pass.

- [ ] **Step 5: Add coherent KMU mock data**

Use official address text `대구광역시 달서구 달구벌대로 1095` and mark all coordinates/data as demo fixtures in the source header. Add at least three destination buildings and four parking lots. Use plausible but explicitly mock remaining-space numbers; never label them as live. Include one registered vehicle, one active pass, and a three-step approved application timeline.

- [ ] **Step 6: Verify and commit the domain slice**

Run: `npm test -- tests/domain && npm run typecheck && npm run lint`

Expected: exit 0 with two passing domain test files.

Commit:

```powershell
git add src/domain src/data src/lib tests/domain
git commit -m "feat: add tenant-aware parking domain"
```

---

### Task 3: Build the mobile shell, navigation, and task-first home

**Files:**
- Create: `src/components/app-shell/app-header.tsx`
- Create: `src/components/app-shell/bottom-nav.tsx`
- Create: `src/components/app-shell/nav-items.ts`
- Create: `src/components/app-shell/page-frame.tsx`
- Create: `src/components/parking/parking-summary.tsx`
- Create: `src/components/parking/recommended-parking-card.tsx`
- Create: `src/components/parking/status-label.tsx`
- Create: `src/app/(student)/layout.tsx`
- Replace: `src/app/page.tsx` with `src/app/(student)/page.tsx`
- Test: `tests/ui/navigation.test.ts`

**Interfaces:**
- Consumes: `parkingRepository.listByCampus(DEFAULT_TENANT)`, `UniversityBrand`, `ParkingLot`
- Produces: reusable `PageFrame`, `AppHeader`, `BottomNav`, `ParkingSummary`, and a complete `/` home route

- [ ] **Step 1: Write the failing navigation resolver test**

```ts
import { describe, expect, it } from "vitest";
import { getActiveNavHref } from "@/components/app-shell/nav-items";

describe("getActiveNavHref", () => {
  it.each([
    ["/", "/"],
    ["/map", "/map"],
    ["/parking/west-gate", "/map"],
    ["/recommend?building=library", "/recommend"],
    ["/profile", "/profile"]
  ])("maps %s to %s", (pathname, expected) => {
    expect(getActiveNavHref(pathname)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run the test to prove the red state**

Run: `npm test -- tests/ui/navigation.test.ts`

Expected: FAIL because `nav-items.ts` does not exist.

- [ ] **Step 3: Implement navigation and the mobile shell**

Export four items with Lucide icon components: Home `/`, Map `/map`, Star `/recommend`, UserRound `/profile`. `BottomNav` is the only Client Component in the app shell; it reads `usePathname()`, applies `aria-current="page"`, and ensures every Link is at least 44px high. The nav background is white with a top separator; the individual items have no border or floating treatment.

The student layout structure is:

```tsx
<div className="mx-auto min-h-dvh w-full max-w-[480px] bg-white shadow-[0_0_40px_rgb(35_31_32/0.08)]">
  <div className="pb-[calc(5rem+env(safe-area-inset-bottom))]">{children}</div>
  <BottomNav />
</div>
```

- [ ] **Step 4: Build the home hierarchy**

The home page is an async Server Component. Fetch the university and parking list in parallel using `Promise.all`. Render, in order: campus selector label, notification icon button, greeting, large destination Link to `/recommend`, compact overall occupancy summary, one recommended parking card, and one vehicle/pass notice.

The destination Link copy is `어디로 가시나요?` with subcopy `도착 시간을 알려주면 주차장을 미리 찾아드려요.` The primary button copy is `주차 추천 받기`. Every interactive surface uses filled neutral or primary backgrounds and `rounded-[var(--radius)]`; do not add `border-*` utilities.

- [ ] **Step 5: Verify and commit the home slice**

Run:

```powershell
npm test -- tests/ui/navigation.test.ts
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit 0 and Next build lists `/`.

Commit:

```powershell
git add src/app src/components/app-shell src/components/parking tests/ui/navigation.test.ts
git commit -m "feat: build karmu mobile home shell"
```

---

### Task 4: Implement recommendation comparison and parking detail

**Files:**
- Create: `src/components/recommendation/destination-form.tsx`
- Create: `src/components/recommendation/recommendation-list.tsx`
- Create: `src/components/recommendation/recommendation-card.tsx`
- Create: `src/components/parking/occupancy-trend.tsx`
- Create: `src/components/parking/parking-facts.tsx`
- Create: `src/app/(student)/recommend/page.tsx`
- Create: `src/app/(student)/parking/[parkingLotId]/page.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/lib/recommendation/search-params.ts`
- Test: `tests/domain/recommendation-search-params.test.ts`

**Interfaces:**
- Consumes: `universityRepository.listBuildings(tenant)`, `recommendationRepository.recommend(tenant, input)`, `parkingRepository.getById(tenant, parkingLotId)`
- Produces: GET-based recommendation URL contract `?buildingId=<id>&arrivalAt=<HH:mm>`, ranked result links, detail route with sticky CTA

- [ ] **Step 1: Write failing query parsing tests**

```ts
import { describe, expect, it } from "vitest";
import { parseRecommendationQuery } from "@/lib/recommendation/search-params";

describe("parseRecommendationQuery", () => {
  it("accepts a known building and valid 24-hour time", () => {
    expect(parseRecommendationQuery({ buildingId: "b2", arrivalAt: "10:30" }, ["b1", "b2"])).toEqual({
      buildingId: "b2",
      arrivalAt: "10:30"
    });
  });

  it("rejects unknown buildings and malformed times", () => {
    expect(parseRecommendationQuery({ buildingId: "x", arrivalAt: "29:80" }, ["b1", "b2"])).toBeNull();
  });
});
```

- [ ] **Step 2: Run the focused test and implement the parser**

Run: `npm test -- tests/domain/recommendation-search-params.test.ts`

Expected first run: FAIL because the parser does not exist.

Implement a pure parser using `/^(?:[01]\d|2[0-3]):[0-5]\d$/` and exact building-ID membership. Run the focused test again and expect PASS.

- [ ] **Step 3: Build a server-submitted destination form**

Use `<form method="get" action="/recommend">`, a native `<select name="buildingId">`, and `<input type="time" name="arrivalAt">`. This keeps form JavaScript out of the initial bundle. Both controls use a filled `surface-muted` background, 48px height, the shared radius, no border, associated labels, and an error paragraph linked with `aria-describedby` when the query is invalid.

- [ ] **Step 4: Render results and an explainable detail page**

When the query is absent, show only the form and a short explanation. When valid, render three recommendation cards with rank, predicted spaces, confidence, walk time, and reasons. Link each result to `/parking/${parkingLotId}?arrivalAt=${arrivalAt}`.

The detail page awaits `params` and `searchParams` per Next.js 16 conventions. Call `notFound()` if the repository returns no parking lot. Render current and predicted spaces, confidence, a small accessible SVG line chart with a text summary, operations/fee/eligibility facts, and a sticky Link to `/map?parkingLotId=<id>` labeled `지도에서 위치 보기`.

- [ ] **Step 5: Verify and commit recommendation/detail**

Run: `npm test && npm run typecheck && npm run lint && npm run build`

Expected: all tests pass; build lists `/recommend` and `/parking/[parkingLotId]`.

Commit:

```powershell
git add src/app src/components/recommendation src/components/parking src/lib/recommendation tests
git commit -m "feat: add explainable parking recommendations"
```

---

### Task 5: Adapt the supplied Google Maps sample behind a lazy fallback boundary

**Files:**
- Create: `src/components/map/map-availability.ts`
- Create: `src/components/map/map-unavailable.tsx`
- Create: `src/components/map/campus-map-loader.tsx`
- Create: `src/components/map/campus-map.tsx`
- Create: `src/components/map/parking-map-list.tsx`
- Create: `src/app/(student)/map/page.tsx`
- Modify: `.env.example`
- Test: `tests/ui/map-fallback.test.ts`

**Interfaces:**
- Consumes: `ParkingLot[]`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, optional `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`
- Produces: `CampusMapLoader({ parkingLots, selectedParkingLotId })`, zero-key list fallback, lazy-loaded Google map with accessible parking list

- [ ] **Step 1: Write the failing map availability test**

```ts
import { describe, expect, it } from "vitest";
import { getMapAvailability } from "@/components/map/map-availability";

describe("getMapAvailability", () => {
  it("requires a non-empty API key", () => {
    expect(getMapAvailability(undefined)).toBe("missing-key");
    expect(getMapAvailability("   ")).toBe("missing-key");
    expect(getMapAvailability("browser-key")).toBe("ready");
  });
});
```

- [ ] **Step 2: Prove red, then implement the fallback state**

Run: `npm test -- tests/ui/map-fallback.test.ts`

Expected first run: FAIL because `map-availability.ts` does not exist.

Implement `getMapAvailability(apiKey?: string): "ready" | "missing-key"`. `MapUnavailable` displays `지도를 연결하려면 Google Maps API 키가 필요해요.` and still renders the full parking list, so the route remains useful without a key.

- [ ] **Step 3: Adapt only the reusable Google sample patterns**

Create `campus-map.tsx` as a Client Component. Preserve the Google LLC Apache-2.0 header because it adapts `APIProvider`, `Map`, `AdvancedMarker`, `Pin`, and `MarkerClusterer` patterns from the supplied solution. Replace Sydney POIs with `ParkingLot[]`; marker keys are `parkingLotId`; marker colors are primary blue, neutral gray, and critical red for full lots.

Do not copy the sample root renderer, Vite config, console logging, click circle, or Sydney fixture data. Map clicks select a parking lot and pan to it. The selected marker links to its parking-detail route through the adjacent HTML list, not through an inaccessible custom-only popup.

- [ ] **Step 4: Ensure the map bundle is route-local**

`campus-map-loader.tsx` is a small Client Component using:

```tsx
const CampusMap = dynamic(() => import("./campus-map").then((module) => module.CampusMap), {
  ssr: false,
  loading: () => <MapSkeleton />
});
```

The Server Component page checks the public API key before rendering the loader. The `/` route must not import any file under `src/components/map/`.

Set `.env.example` to:

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
```

- [ ] **Step 5: Verify no-key behavior, route build, and dependency isolation**

Run:

```powershell
npm test -- tests/ui/map-fallback.test.ts
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit 0; `/map` builds without an API key and renders the fallback list. Inspect `.next/analyze` only if a supported analyzer is already available; do not add a bundle analyzer dependency for this MVP.

Commit:

```powershell
git add src/components/map 'src/app/(student)/map' .env.example tests/ui/map-fallback.test.ts
git commit -m "feat: add lazy campus parking map"
```

---

### Task 6: Complete profile/admin hints, responsive polish, and end-to-end verification

**Files:**
- Create: `src/components/profile/vehicle-card.tsx`
- Create: `src/components/profile/pass-card.tsx`
- Create: `src/components/profile/application-timeline.tsx`
- Create: `src/app/(student)/profile/page.tsx`
- Modify: `src/app/offline/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `README.md`
- Test: `tests/domain/vehicle-repository.test.ts`

**Interfaces:**
- Consumes: `vehicleRepository.getOverview(DEFAULT_TENANT)`, PWA offline fallback contract
- Produces: `/profile`, `/offline`, complete setup documentation, verified 320/375/390/430/480px behavior

- [ ] **Step 1: Write the failing vehicle tenant test**

Assert that the mock vehicle overview returns the KMU demo vehicle only for `DEFAULT_TENANT` and returns an empty overview for a different university. Run the focused test and expect FAIL before implementing the tenant check.

- [ ] **Step 2: Implement the profile route**

Render a registered vehicle card, active pass card, required-document checklist, and application timeline. Approved/active states use primary-blue text and icons rather than introducing a green hue. Primary management actions use blue filled buttons; urgent expiry/error uses the single KM red.

Add a final compact card labeled `관리자 기능은 다음 단계에서 제공돼요` listing live operations, approvals, notices, and demand analysis. It is informational and has no dead button.

- [ ] **Step 3: Implement the offline route and responsive guards**

The offline route says `인터넷 연결을 확인해 주세요` and explains that real-time spaces and recommendations require a connection. Add a Link back to `/` and do not show stale numbers.

In `globals.css`, add `overflow-wrap: anywhere` for dynamic labels, `overflow-x: clip` on the app shell, reduced-motion rules, and safe-area padding. Do not disable zoom or use a restrictive viewport maximum scale.

- [ ] **Step 4: Update README with exact setup and key safety instructions**

Document:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Explain that Google Maps requires Maps JavaScript API, an HTTP referrer-restricted browser key, and preferably a configured map ID. State that all displayed parking counts and coordinates are mock data. Include the source ZIP name and Apache-2.0 attribution.

- [ ] **Step 5: Run the complete verification suite**

Run fresh commands in this order:

```powershell
npm test
npm run typecheck
npm run lint
npm run build
git diff --check
```

Expected: zero failed tests, zero TypeScript errors, zero lint errors, build exit 0, and no whitespace errors.

Start the production server with `npm start`. Verify these paths at mobile widths 320, 375, 390, 430, and 480px:

- `/`
- `/recommend?buildingId=b2&arrivalAt=10%3A30`
- `/parking/<known-mock-id>?arrivalAt=10%3A30`
- `/map` without an API key
- `/profile`
- `/offline`

For each width, verify no unintended horizontal scroll, no content hidden by bottom navigation, 44px touch targets, visible keyboard focus, and readable long Korean labels. Check `/map` once more with a valid local API key if the user supplies one; absence of a key is not a blocker because the fallback is an explicit MVP requirement.

- [ ] **Step 6: Commit the finished MVP foundation**

```powershell
git add src README.md tests public package.json package-lock.json
git commit -m "feat: complete karmu mobile mvp foundation"
git status --short
```

Expected: clean working tree after the commit.
