import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Star,
  MessageSquare,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import {
  formatMongoDate,
  getInitials,
  getLocationName,
} from "@/utils/helpers.util";
import ClientProjects, { defaultProjects } from "@/components/ClientProjects";
import ClientAbout from "@/components/ClientAbout";
import ClientSettings from "@/components/ClientSettings";
import { useAuth } from "@/contexts/AuthContext";
import ClientStats from "@/components/ClientStats";
import { ClientAboutData } from "@/types/clientProfile.types";

const ClientProfile = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  const clientAboutData: ClientAboutData = {
    description: profile.description,
    website: profile.companyWebsite,
    company: profile.companyName,
    location: profile.location,
    joinDate: profile.createdAt,
  };

  const defaultStats = [
    { label: "Projects Posted", value: profile.projectsPosted, icon: Users },
    { label: "Total Spent", value: profile.totalSpent, icon: DollarSign },
    { label: "Average Rating", value: profile.clientRating, icon: Star },
    {
      label: "Total Reviews",
      value: profile.totalReviews,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="shadow-elegant mb-8 w-full">
            <CardContent className="p-8">
              <div className="flex flex-col md-nav:flex-row gap-6">
                <div className="flex flex-col items-center md-nav:items-start justify-between">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={profile.avatar} alt={profile.fullName} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profile.fullName || "")}
                    </AvatarFallback>
                  </Avatar>
                  {user && user._id === profile._id && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Update Avatar
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start pb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-1">
                        {profile.fullName}
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        Last Login: {formatMongoDate(profile.lastLogin)}
                      </p>
                    </div>
                    <Button
                      variant={isEditing ? "success" : "hero"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="gap-2 self-end"
                    >
                      <Edit className="h-4 w-4" />
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>

                  <ClientStats stats={defaultStats} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Project History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <ClientAbout
                      profile={clientAboutData}
                      isEditing={isEditing}
                    />
                  </CardContent>
                </Card>
                <div className="space-y-6">
                  <Card className="shadow-card">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Recent Activity
                      </h3>
                      <p className="text-muted-foreground">
                        No recent activity to show.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <ClientProjects projects={defaultProjects} />
            </TabsContent>

            <TabsContent value="settings">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <ClientSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
