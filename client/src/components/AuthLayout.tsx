// src/components/AuthLayout.tsx
import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { Loader } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  authentication?: boolean; // true = requires auth, false = requires no-auth
}

function AuthLayout({ children, authentication = true }: AuthLayoutProps) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  const { isAuthenticated, loading, appLoading } = useAuth();

  useEffect(() => {
    setLoader(true);

    if (!appLoading && !loading) {
      if (authentication && !isAuthenticated) {
        navigate("/login");
        setLoader(false);
      } else if (!authentication && isAuthenticated) {
        navigate(-1);
      } else {
        setLoader(false);
      }
    }
  }, [isAuthenticated, authentication, navigate, loading, appLoading]);

  return loader || loading || appLoading ? (
    <div className="flex items-center justify-center min-h-svh">
      <Loader className="w-12 h-12 animate-spin" />
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
