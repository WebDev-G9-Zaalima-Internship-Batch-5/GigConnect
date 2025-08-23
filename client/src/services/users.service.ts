// users.service.ts
import { axiosInstance } from "../utils/axios.util";
import {
  RegisterPayload,
  LoginPayload,
  ResetPasswordPayload,
} from "../types/user.types";

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
