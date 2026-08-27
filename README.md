# Karmu

도착 예정 시간을 기준으로 대학 주차장을 예측하고 추천하는 모바일 우선 PWA입니다. 계명대학교 성서캠퍼스를 기본 테넌트로 사용하지만, 모든 주요 데이터는 `universityId`와 `campusId`로 분리되어 다른 대학을 추가할 수 있습니다.

## 로컬 실행

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다. Android Chrome에서는 브라우저의 **앱 설치**, iPhone Safari에서는 **홈 화면에 추가**를 사용해 런처에서 실행할 수 있습니다. 서비스 워커는 프로덕션 빌드에서만 등록됩니다.

## 품질 확인

```powershell
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

## Google Maps 연결

Google Maps 없이도 목록과 추천 흐름은 동작합니다. 지도 연결 시 Google Cloud에서 **Maps JavaScript API**를 활성화한 뒤, HTTP 리퍼러 제한이 적용된 브라우저 키와 가급적 별도로 만든 Map ID를 `.env.local`에 설정합니다. API 키는 브라우저에 공개되는 값이므로 API 제한과 리퍼러 제한을 반드시 함께 적용해야 합니다.

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
```

지도 코드는 사용자가 제공한 `codelab-maps-platform-101-react-js-main.zip`의 Google Maps Platform 101 React 예제에서 `APIProvider`, `Map`, `AdvancedMarker`, `Pin`, `MarkerClusterer` 사용 패턴만 Next.js 구조에 맞게 수정했습니다. 수정 파일에는 Google LLC 저작권과 Apache-2.0 고지를 보존했습니다.

## MVP 구조

- `src/domain`: 대학·주차장·추천·차량의 프레임워크 독립 타입
- `src/data/contracts`: 백엔드로 교체 가능한 repository 인터페이스
- `src/data/mock`: 계명대 기본 테넌트의 데모 데이터
- `src/app/(student)`: 홈, 추천, 상세, 지도, 내 정보 사용자 흐름
- `src/components/map`: API 키 유무에 따른 지연 로딩 지도와 목록 대체 화면

현재 표시되는 주차 잔여면, 예측값, 차량 번호, 일정, 좌표는 모두 데모용 Mock 데이터이며 실제 계명대학교 운영 데이터가 아닙니다. 다음 단계에서는 실시간 수집 API, 인증·권한, 차량/정기권 신청, 대학별 관리자 설정을 repository 구현으로 연결할 수 있습니다.
