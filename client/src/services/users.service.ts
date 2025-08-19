// users.service.ts
import { axiosInstance } from "../utils/axios.util";

export interface RegisterPayload {
  email: string;
  password: string;
  role: "client" | "freelancer" | "admin";
  fullName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  role: string;
  fullName: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  avatar?: string;
  phone?: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const res = await axiosInstance.post("/users/register", data);
  return res.data.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await axiosInstance.post("/users/login", data);
  return res.data.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/users/logout");
  return res.data.data;
};

export const getCurrentUser = async () => {
  const res = await axiosInstance.get("/users/get-current-user");
  console.log("getCurrentUser: ", res.data.data);
  return res.data.data;
};

export const resendVerificationEmail = async () => {
  const res = await axiosInstance.post("/users/resend-verification-email");
  console.log("resendVerificationEmail: ", res.data.data);
  return res.data.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosInstance.post("/users/forgot-password", { email });
  console.log("forgotPassword: ", res.data);
  return res.data.data;
};

export const resetPassword = async (
  data: Omit<ResetPasswordPayload, "confirmPassword">
) => {
  const res = await axiosInstance.post("/users/reset-password", data);
  console.log("resetPassword: ", res.data);
  return res.data.data;
};
