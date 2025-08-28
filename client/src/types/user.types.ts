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
  avatar?: {
    url: string;
    publicId: string;
  };
  phone?: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}
