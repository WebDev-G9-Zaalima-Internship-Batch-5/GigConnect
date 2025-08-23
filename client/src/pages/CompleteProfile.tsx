import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CompleteClientProfile from "./CompleteClientProfile";
import CompleteFreelancerProfile from "./CompleteFreelancerProfile";
import { Loader } from "lucide-react";
import Navigation from "@/components/Navigation";

const CompleteProfile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!loading && !user) {
      navigate("/login", { state: { from: "/complete-profile" } });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If no user or still loading, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Complete Your Profile
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Please complete your profile to get the most out of our platform.
        </p>

        {user.role === "client" ? (
          <CompleteClientProfile />
        ) : (
          <CompleteFreelancerProfile />
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;
