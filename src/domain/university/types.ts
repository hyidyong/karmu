export type TenantContext = {
  universityId: string;
  campusId: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
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
