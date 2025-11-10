import { axiosInstance } from "@/utils/axios.util";

export interface ClientDashboardStats {
  activeProjects: number;
  openGigs: number;
  totalSpent: number;
  pendingApplications: number;
}

export interface NameAvatarRef {
  _id: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface GigSummary {
  _id: string;
  title: string;
  budget?: { type: "fixed" | "hourly"; amount: number; currency: string };
}

export interface ContractSummary {
  _id: string;
  status: string;
  agreedRate: number;
  startDate: string;
  endDate?: string;
  totalPaid: number;
  remainingAmount: number;
  gig: GigSummary;
  freelancer?: NameAvatarRef;
  client?: NameAvatarRef;
}

export interface ApplicationSummary {
  _id: string;
  status: string;
  appliedAt: string;
  proposedRate: number;
  gig: GigSummary;
  freelancer?: NameAvatarRef;
  client?: NameAvatarRef;
}

export interface ClientDashboardResponse {
  stats: ClientDashboardStats;
  activeGigs: ActiveGig[];
  activeContracts: ContractSummary[];
  recentApplications: ApplicationSummary[];
  completedProjects: ContractSummary[];
}

export interface FreelancerDashboardStats {
  activeJobs: number;
  totalEarnings: number;
  pendingProposals: number;
}

export interface FreelancerDashboardResponse {
  stats: FreelancerDashboardStats;
  activeContracts: ContractSummary[];
  proposedContracts: Array<ContractSummary & { clientSubmittedAt?: string; freelancerAccepted?: boolean; deadline?: string }>;
  myApplications: ApplicationSummary[];
}

export interface ActiveGig {
  _id: string;
  title: string;
  status: "open" | "in_progress";
  budget?: { type: "fixed" | "hourly"; amount: number; currency: string };
  createdAt: string;
  applicationCount: number;
}

export const getClientDashboard = async (params?: {
  appsLimit?: number;
  contractsLimit?: number;
  completedLimit?: number;
}): Promise<ClientDashboardResponse> => {
  const res = await axiosInstance.get("/dashboard/client", { params });
  return res.data.data as ClientDashboardResponse;
};

export const getFreelancerDashboard = async (params?: {
  appsLimit?: number;
  contractsLimit?: number;
}): Promise<FreelancerDashboardResponse> => {
  const res = await axiosInstance.get("/dashboard/freelancer", { params });
  return res.data.data as FreelancerDashboardResponse;
};
