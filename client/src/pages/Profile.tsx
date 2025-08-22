import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ClientProfile from "@/pages/ClientProfile";
import FreelancerProfile from "@/pages/FreelancerProfile";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/profile.service";
import CompleteProfile from "@/pages/CompleteProfile";
import NotFound from "./NotFound";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isProfileComplete } = useAuth();

  const profileId = id || user?._id;

  const { data, isPending } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => getProfile(profileId),
    enabled: !!profileId,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (!id || id === user?._id && !isProfileComplete) {
    return <CompleteProfile />
  }

  if (!profileId) {
    return <NotFound />;
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <NotFound />;
  }

  const profileRole = data.profile?.role;

  return (
    <div className="min-h-svh bg-background">
      {profileRole === "client" ? <ClientProfile profile={data.profile} /> : <FreelancerProfile profile={data.profile} />}
    </div>
  );
};

export default Profile;
