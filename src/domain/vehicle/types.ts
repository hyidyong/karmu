export type VehicleOverview = {
  vehicles: Array<{
    vehicleId: string;
    plateNumber: string;
    modelName: string;
    status: "approved";
  }>;
  pass: {
    name: string;
    validFrom: string;
    validTo: string;
    status: "active";
  } | null;
  applicationSteps: Array<{
    label: string;
    completedAt: string;
  }>;
};
