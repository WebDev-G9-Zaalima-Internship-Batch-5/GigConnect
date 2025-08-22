import { User } from "./user.types";

export interface ProfileBase {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile extends ProfileBase {
  companyName: string;
  companyWebsite?: string;
  businessType: string;
  industryType: string;
  description: string;
  preferredBudgetRange: {
    min: number;
    max: number;
  };
  location: {
    type: "Point";
    coordinates: [number, number];
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    displayName?: string;
  };
  communicationPreferences: {
    email: boolean;
    phone: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface FreelancerProfile extends ProfileBase {
  // Add freelancer specific fields here
  // For example:
  // skills: string[];
  // experience: Experience[];
  // education: Education[];
  // hourlyRate: number;
  user: Pick<User, "_id" | "fullName" | "email" | "avatar">;
}

export type Profile = ClientProfile | FreelancerProfile;

export interface UpdateProfileData {
  [key: string]: any; // This should be more specific based on your form data
}
