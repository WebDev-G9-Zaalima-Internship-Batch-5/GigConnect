// src/components/AuthLayout.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "lucide-react";
import VerifyEmail from "@/pages/VerifyEmail";
import CompleteProfile from "@/pages/CompleteProfile";

interface AuthLayoutProps {
  children: ReactNode;
  authentication?: boolean; // true = requires auth, false = Only for public routes, Authenticated users not allowed
}

export default function AuthLayout({
  children,
  authentication = true,
}: AuthLayoutProps) {
  const { isAuthenticated, appLoading, isVerified, isProfileComplete } =
    useAuth();
  const location = useLocation();

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <Loader className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!authentication) {
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated but not verified
  if (!isVerified) return <VerifyEmail />;

  // Verified but profile incomplete
  if (!isProfileComplete) return <CompleteProfile />;

  return <>{children}</>;
}
