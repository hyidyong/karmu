import type { ParkingLot } from "@/domain/parking/types";
import type { Building, UniversityBrand } from "@/domain/university/types";
import type { VehicleOverview } from "@/domain/vehicle/types";

// All coordinates, counts, predictions, vehicles, and dates below are demo-only fixtures.
export const universityBrands: UniversityBrand[] = [
  {
    universityId: "kmu",
    name: "계명대학교",
    campusName: "성서캠퍼스",
    primaryColor: "#034EA2",
    criticalColor: "#E23D3F",
  },
];

export const buildings: Building[] = [
  {
    buildingId: "b1",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "동산도서관",
    coordinates: { lat: 35.8546, lng: 128.4873 },
  },
  {
    buildingId: "b2",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "봉경관",
    coordinates: { lat: 35.8552, lng: 128.4859 },
  },
  {
    buildingId: "b3",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "바우어관",
    coordinates: { lat: 35.8539, lng: 128.4865 },
  },
];

const defaultTrend = [
  { hour: "06", available: 52 },
  { hour: "09", available: 29 },
  { hour: "12", available: 34 },
  { hour: "15", available: 25 },
  { hour: "18", available: 18 },
  { hour: "22", available: 31 },
];

export const parkingLots: ParkingLot[] = [
  {
    parkingLotId: "east-gate",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "동문 주차장",
    capacity: 80,
    currentAvailable: 28,
    predictedAvailable: 34,
    confidence: 88,
    walkMinutes: 4,
    distanceMeters: 320,
    status: "available",
    coordinates: { lat: 35.8548, lng: 128.4892 },
    operatingHours: "06:00–24:00",
    feeText: "무료",
    eligibility: "학생·교직원 이용 가능",
    trend: defaultTrend,
  },
  {
    parkingLotId: "west-gate",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "서문 주차장",
    capacity: 90,
    currentAvailable: 22,
    predictedAvailable: 18,
    confidence: 75,
    walkMinutes: 7,
    distanceMeters: 560,
    status: "moderate",
    coordinates: { lat: 35.8544, lng: 128.4838 },
    operatingHours: "06:00–24:00",
    feeText: "무료",
    eligibility: "학생·교직원 이용 가능",
    trend: defaultTrend,
  },
  {
    parkingLotId: "north-gate",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "북문 주차장",
    capacity: 60,
    currentAvailable: 15,
    predictedAvailable: 12,
    confidence: 61,
    walkMinutes: 6,
    distanceMeters: 470,
    status: "busy",
    coordinates: { lat: 35.8571, lng: 128.4869 },
    operatingHours: "06:00–22:00",
    feeText: "무료",
    eligibility: "학생·교직원 이용 가능",
    trend: defaultTrend,
  },
  {
    parkingLotId: "central",
    universityId: "kmu",
    campusId: "kmu-seongseo",
    name: "중앙 주차장",
    capacity: 45,
    currentAvailable: 0,
    predictedAvailable: 0,
    confidence: 94,
    walkMinutes: 3,
    distanceMeters: 240,
    status: "full",
    coordinates: { lat: 35.8551, lng: 128.4871 },
    operatingHours: "24시간",
    feeText: "무료",
    eligibility: "교직원 우선",
    trend: defaultTrend,
  },
  {
    parkingLotId: "east-gate",
    universityId: "hanbit",
    campusId: "hanbit-main",
    name: "한빛대학교 동문 주차장",
    capacity: 30,
    currentAvailable: 10,
    predictedAvailable: 8,
    confidence: 70,
    walkMinutes: 5,
    distanceMeters: 390,
    status: "moderate",
    coordinates: { lat: 37.55, lng: 126.95 },
    operatingHours: "07:00–23:00",
    feeText: "1시간 무료",
    eligibility: "등록 차량",
    trend: defaultTrend,
  },
];

export const kmuVehicleOverview: VehicleOverview = {
  vehicles: [
    {
      vehicleId: "vehicle-1",
      plateNumber: "12가 3456",
      modelName: "현대 아반떼",
      status: "approved",
    },
  ],
  pass: {
    name: "성서캠퍼스 정기권",
    validFrom: "2026. 03. 01",
    validTo: "2027. 02. 28",
    status: "active",
  },
  applicationSteps: [
    { label: "신청 접수", completedAt: "2026. 02. 24 09:10" },
    { label: "서류 검토", completedAt: "2026. 02. 25 14:20" },
    { label: "승인 완료", completedAt: "2026. 02. 26 10:05" },
  ],
};
