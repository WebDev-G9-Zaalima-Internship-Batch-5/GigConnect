import { axiosInstance } from "../utils/axios.util";

export interface FreelancerInfo {
  _id: string;
  name: string;
  avatar?: string;
}

export interface ApplicationItem {
  _id: string;
  gigId: string;
  freelancer: FreelancerInfo;
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  relevantExperience: string;
  portfolioSamples?: string[];
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  clientViewed: boolean;
  clientViewedAt?: string;
}

export const getGigApplications = async (
  gigId: string
): Promise<ApplicationItem[]> => {
  const res = await axiosInstance.get(`/gigs/${gigId}/applications`);
  return res.data.data as ApplicationItem[];
};

export const updateApplicationStatus = async (
  gigId: string,
  applicationId: string,
  status: "accepted" | "rejected"
): Promise<ApplicationItem> => {
  const res = await axiosInstance.patch(
    `/gigs/${gigId}/applications/${applicationId}`,
    { status }
  );
  return res.data.data as ApplicationItem;
};

export const markApplicationAsViewed = async (
  gigId: string,
  applicationId: string
): Promise<ApplicationItem> => {
  const res = await axiosInstance.patch(
    `/gigs/${gigId}/applications/${applicationId}/viewed`
  );
  return res.data.data as ApplicationItem;
};
