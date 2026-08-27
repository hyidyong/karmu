export type ParkingAccess = {
  parkingLotId: string;
  buildingId: string;
  walkMinutes: number;
  distanceMeters: number;
};

type AccessTuple = [buildingId: string, walkMinutes: number, distanceMeters: number];

function defineAccess(parkingLotId: string, entries: AccessTuple[]): ParkingAccess[] {
  return entries.map(([buildingId, walkMinutes, distanceMeters]) => ({
    parkingLotId,
    buildingId,
    walkMinutes,
    distanceMeters,
  }));
}

// Demo-only walking estimates for every student/shared lot and KMU destination.
export const parkingAccesses: ParkingAccess[] = [
  ...defineAccess("east-gate", [
    ["b1", 4, 320], ["b2", 6, 470], ["b3", 5, 390], ["b4", 4, 310], ["b5", 7, 540],
    ["b6", 12, 930], ["b7", 8, 610], ["b8", 7, 520], ["b9", 6, 450], ["b10", 13, 980],
  ]),
  ...defineAccess("south-gate", [
    ["b1", 10, 780], ["b2", 11, 850], ["b3", 8, 630], ["b4", 12, 920], ["b5", 13, 990],
    ["b6", 3, 230], ["b7", 8, 620], ["b8", 5, 370], ["b9", 15, 1_160], ["b10", 7, 540],
  ]),
  ...defineAccess("student-1", [
    ["b1", 7, 540], ["b2", 8, 610], ["b3", 9, 690], ["b4", 5, 380], ["b5", 6, 460],
    ["b6", 14, 1_080], ["b7", 10, 770], ["b8", 11, 840], ["b9", 4, 300], ["b10", 15, 1_140],
  ]),
  ...defineAccess("student-2", [
    ["b1", 9, 700], ["b2", 7, 550], ["b3", 6, 460], ["b4", 10, 760], ["b5", 8, 620],
    ["b6", 6, 450], ["b7", 5, 380], ["b8", 10, 780], ["b9", 13, 1_010], ["b10", 3, 220],
  ]),
  ...defineAccess("engineering-student", [
    ["b1", 10, 760], ["b2", 8, 600], ["b3", 7, 530], ["b4", 11, 850], ["b5", 9, 700],
    ["b6", 4, 300], ["b7", 5, 390], ["b8", 9, 680], ["b9", 14, 1_080], ["b10", 4, 310],
  ]),
  ...defineAccess("stadium-temp", [
    ["b1", 11, 850], ["b2", 13, 990], ["b3", 10, 780], ["b4", 12, 930], ["b5", 15, 1_150],
    ["b6", 7, 520], ["b7", 10, 760], ["b8", 3, 240], ["b9", 14, 1_070], ["b10", 12, 920],
  ]),
  ...defineAccess("central", [
    ["b1", 3, 240], ["b2", 4, 300], ["b3", 4, 310], ["b4", 3, 230], ["b5", 5, 380],
    ["b6", 9, 690], ["b7", 5, 360], ["b8", 7, 550], ["b9", 7, 520], ["b10", 9, 680],
  ]),
];

export function getParkingAccess(
  parkingLotId: string,
  buildingId: string,
): ParkingAccess | undefined {
  return parkingAccesses.find(
    (access) => access.parkingLotId === parkingLotId && access.buildingId === buildingId,
  );
}
