export interface LocationData {
  type: {
    type: string;
    enum: ["Point"];
  };
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  displayName?: string;
}
