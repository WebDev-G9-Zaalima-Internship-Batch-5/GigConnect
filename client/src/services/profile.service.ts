import { axiosInstance } from "@/utils/axios.util";

import { Profile, UpdateProfileData } from "@/types/profile.types";
import { LocationData } from "@/types/location.types";
import {
  CompleteClientProfileFormValues,
  CompleteFreelancerProfileFormValues,
} from "@/schemas/profile.schema";

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
  const res = await axiosInstance.post(
    "/profiles/complete-client-profile",
    data
  );
  return res.data.data;
};

export const completeFreelancerProfile = async (
  data: CompleteFreelancerProfileFormValues
) => {
  const res = await axiosInstance.post(
    "/profiles/complete-freelancer-profile",
    data
  );
  return res.data.data;
};

export const uploadAvatar = async (avatarImage: File) => {
  const formData = new FormData();
  formData.append("avatar", avatarImage);
  const res = await axiosInstance.post("/profiles/update-avatar", formData);
  return res.data.data;
};
