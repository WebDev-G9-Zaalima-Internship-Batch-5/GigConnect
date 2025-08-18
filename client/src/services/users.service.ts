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

export const registerUser = async (data: RegisterPayload) => {
  const res = await axiosInstance.post("/register", data);
  return res.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await axiosInstance.post("/login", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/logout");
  return res.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await axiosInstance.get("/get-current-user");
  return res.data.data;
};

export const resendVerificationEmail = async () => {
  const res = await axiosInstance.post("/resend-verification-email");
  return res.data;
};
