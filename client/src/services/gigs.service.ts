import { axiosInstance } from "../utils/axios.util";

export const createGigWithAttachments = async (formData: FormData) => {
  const res = await axiosInstance.post("/gigs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

export interface GetGigsParams {
  q?: string;
  category?: string;
  subCategory?: string;
  experienceLevel?: string;
  // legacy single-type budget filtering (back-compat)
  budgetType?: "fixed" | "hourly";
  budgetMin?: number;
  budgetMax?: number;
  // new separate filters
  fixedMin?: number;
  fixedMax?: number;
  hourlyMin?: number;
  hourlyMax?: number;
  skills?: string[];
  lat?: number;
  lng?: number;
  distanceKm?: number;
  sort?: "recent" | "budget-high" | "budget-low" | "proposals";
  page?: number;
  limit?: number;
}

export interface GetGigsResponse {
  items: any[];
  total: number;
  page: number;
  limit: number;
}

export const getGigs = async (
  params: GetGigsParams
): Promise<GetGigsResponse> => {
  const query: Record<string, string> = {};
  if (params.q) query.q = params.q;
  if (params.category) query.category = params.category;
  if (params.subCategory) query.subCategory = params.subCategory;
  if (params.experienceLevel) query.experienceLevel = params.experienceLevel;
  // legacy fields
  if (params.budgetType) query.budgetType = params.budgetType;
  if (typeof params.budgetMin === "number")
    query.budgetMin = String(params.budgetMin);
  if (typeof params.budgetMax === "number")
    query.budgetMax = String(params.budgetMax);
  // new fields
  if (typeof params.fixedMin === "number")
    query.fixedMin = String(params.fixedMin);
  if (typeof params.fixedMax === "number")
    query.fixedMax = String(params.fixedMax);
  if (typeof params.hourlyMin === "number")
    query.hourlyMin = String(params.hourlyMin);
  if (typeof params.hourlyMax === "number")
    query.hourlyMax = String(params.hourlyMax);
  if (params.skills?.length) query.skills = params.skills.join(",");
  if (typeof params.lat === "number") query.lat = String(params.lat);
  if (typeof params.lng === "number") query.lng = String(params.lng);
  if (typeof params.distanceKm === "number")
    query.distanceKm = String(params.distanceKm);
  if (params.sort) query.sort = params.sort;
  if (typeof params.page === "number") query.page = String(params.page);
  if (typeof params.limit === "number") query.limit = String(params.limit);

  const res = await axiosInstance.get("/gigs", { params: query });
  return res.data.data as GetGigsResponse;
};

export const getGigById = async (gigId: string) => {
  const res = await axiosInstance.get(`/gigs/${gigId}`);
  return res.data.data;
};

export interface ApplyForGigPayload {
  coverLetter: string;
  proposedRate: number;
  estimatedDuration: string;
  relevantExperience: string;
}

export const applyForGig = async (gigId: string, payload: ApplyForGigPayload) => {
  const res = await axiosInstance.post(`/gigs/${gigId}/applications/apply`, payload);
  return res.data.data;
};
