# Karmu

현재 위치에서 출발하면 도로 이동시간과 도착 시점의 주차 여유를 자동으로 계산하는 모바일 우선 PWA입니다. 계명대학교 성서캠퍼스를 기본 데모 테넌트로 사용하며, 모든 주요 데이터는 `universityId`, `campusId`, `parkingLotId`로 분리되어 다른 대학을 추가할 수 있습니다.

## 로컬 실행

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. Android Chrome에서는 **앱 설치**, iPhone Safari에서는 **홈 화면에 추가**를 사용해 런처에서 실행할 수 있습니다. 서비스 워커는 프로덕션 빌드에서만 등록됩니다.

## 환경 변수와 Google API

Google Cloud 프로젝트에서 **Maps JavaScript API**와 **Routes API**를 활성화해야 합니다. Google Maps Platform은 사용량 기반 과금 서비스이므로 결제 계정, 일일 할당량, 예산 알림을 함께 설정하세요.

```dotenv
# 브라우저에 포함되는 지도 키
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=

# 서버의 /api/eta에서만 읽는 경로 키
GOOGLE_ROUTES_API_KEY=
```

- 로컬 비밀값은 Git에서 제외되는 `.env.local`에만 둡니다.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`는 브라우저에 공개되므로 Maps JavaScript API와 허용 HTTP 리퍼러로 제한합니다.
- 배포 환경에서는 `GOOGLE_ROUTES_API_KEY`를 별도 서버 키로 만들고 Routes API 및 서버 호출 조건으로 제한합니다.
- Routes API가 비활성화됐거나 키가 제한·거부됐거나 네트워크가 끊기면, 앱은 계명대 데모 출발점과 직선거리 기반 추정으로 자동 전환합니다.
- Map ID가 없거나 지도 키가 동작하지 않아도 접근 가능한 주차장 목록은 계속 표시됩니다.

지도 코드는 사용자가 제공한 `codelab-maps-platform-101-react-js-main.zip`의 Google Maps Platform 101 React 예제에서 `APIProvider`, `Map`, `AdvancedMarker`, `Pin` 사용 패턴을 Next.js 구조에 맞게 수정했습니다. 주차장 8곳은 캠퍼스 확대 수준에서 개별 마커가 더 읽기 쉬워 클러스터 상태를 두지 않았으며, 수정 파일에는 Google LLC 저작권과 Apache-2.0 고지를 보존했습니다.

## 계명대학교 데모 범위

- 목적지 건물 10곳
- 주차장 8곳: 동문·남문 학생주차장, 제1·제2학생주차장, 공학관 학생주차장, 운동장 임시주차장, 본관 교직원주차장, 중앙 공용주차장
- 도착 시각 전후 추세를 보간한 잔여면 예측
- 목적지별 보행 거리와 학생 이용 권한을 반영한 상위 3곳 추천
- 동산도서관은 동문 학생주차장, 공학관은 남문 학생주차장이 우선되는 발표용 시나리오

현재 표시되는 좌표, 잔여면, 예측값, 보행거리, 차량, 신청 일정은 모두 데모용 Mock 데이터이며 실제 계명대학교 운영 데이터가 아닙니다.

## 구조

- `src/domain`: 대학·ETA·주차장·추천·차량의 프레임워크 독립 타입
- `src/data/contracts`: 백엔드로 교체 가능한 repository 인터페이스
- `src/data/mock`: 계명대 기본 테넌트의 데모 데이터와 목적지별 접근 행렬
- `src/app/api/eta`: Google Routes 호출과 결정적 데모 fallback을 캡슐화한 Route Handler
- `src/app/(student)`: 홈, 자동 출발, 추천, 상세, 지도, 내 정보 흐름
- `src/components/map`: 지도 코드의 지연 로딩과 목록 대체 화면

현재 데모는 영속 저장, 로그인, 실시간 구독이 필요하지 않아 Supabase와 Docker를 연결하지 않았습니다. 차량 신청·승인, 관리자 정책, 실제 주차 수집 데이터가 들어오는 단계에서 repository 구현을 Supabase로 교체하면 됩니다.

## 품질 확인

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
npm start
```
