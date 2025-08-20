import { useAuth } from "@/contexts/AuthContext";
import FreelancerDashboard from "./FreelancerDashboard";
import ClientDashboard from "./ClientDashboard";
import { Loader } from "lucide-react";
import NotFound from "./NotFound";

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  return user.role === "freelancer" ? (
    <FreelancerDashboard />
  ) : user.role === "client" ? (
    <ClientDashboard />
  ) : (
    <NotFound />
  );
};

export default Dashboard;
