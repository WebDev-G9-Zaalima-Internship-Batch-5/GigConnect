import { axiosInstance } from "@/utils/axios.util";

import {
  Profile,
  UpdateProfileData,
  ClientProfile,
  ProfileBase,
} from "@/types/profile.types";
import { LocationData } from "@/types/location";
import { CompleteClientProfileFormValues } from "@/pages/CompleteClientProfile";

export const getProfile = async (userId: string) => {
  const res = await axiosInstance.get(`/profiles/${userId}`);
  return res.data.data;
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileData
): Promise<Profile> => {
  const res = await axiosInstance.patch(`/profiles/${userId}`, data);
  return res.data.data;
};

export const completeClientProfile = async (
  data: CompleteClientProfileFormValues & { location: LocationData }
) => {
  const res = await axiosInstance.post("/profiles/complete-client-profile", data);
  return res.data.data;
};
