import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ClientProfile from "./ClientProfile";
import FreelancerProfile from "./FreelancerProfile";
import { useEffect } from "react";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const profileId = id || user?._id;

  if (!profileId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p>Please log in or provide a valid profile ID.</p>
        </div>
      </div>
    );
  }

  const isCurrentUser = profileId === user?._id;
  const profileRole = isCurrentUser ? user?.role : "freelancer";

  useEffect(() => {
    if (!isCurrentUser && profileId) {
      console.log("Fetching profile data for user:", profileId);
    }
  }, [profileId, isCurrentUser]);

  return (
    <div className="min-h-screen bg-background">
      {profileRole === "client" ? <ClientProfile /> : <FreelancerProfile />}
    </div>
  );
};

export default Profile;
