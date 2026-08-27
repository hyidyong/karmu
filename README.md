# Karmu

도착 예정시간을 기준으로 대학 주차장을 예측하고 추천하는 모바일 우선 PWA입니다.

## 로컬 실행

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Google Maps 없이도 목록과 추천 흐름은 동작합니다. 지도 연결 시 `.env.local`에 브라우저 제한이 적용된 Maps JavaScript API 키와 선택적인 Map ID를 설정합니다.

```dotenv
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
```

초기 MVP의 주차 잔여면, 예측값, 차량, 좌표는 모두 데모용 Mock 데이터입니다.
