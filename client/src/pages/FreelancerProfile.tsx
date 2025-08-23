import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Edit,
  MapPin,
  Calendar,
  Star,
  DollarSign,
  Clock,
  Award,
  Eye,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { getInitials, getLocationName } from "@/utils/helpers.util";
import { useAuth } from "@/contexts/AuthContext";
import FreelancerStats from "@/components/FreelancerStats";
import FreelancerPortfolio from "@/components/FreelancerPortfolio";
import FreelancerReviews from "@/components/FreelancerReviews";

const FreelancerProfile = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="shadow-elegant mb-8">
            <CardContent className="p-8 space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={profile.avatar} alt={profile.fullName} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(profile.fullName || "")}
                    </AvatarFallback>
                  </Avatar>
                  {user && user._id === profile._id && (
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Photo
                    </Button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {profile.fullName}
                      </h1>
                      <p className="text-xl text-muted-foreground mb-2">
                        {profile.title}
                      </p>
                      <p className="text-lg font-medium text-success mb-2">
                        {profile.hourlyRate}/hour
                      </p>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{getLocationName(profile.location)}</span>
                        <Calendar className="h-4 w-4 ml-4 mr-2" />
                        <span>Joined {profile.joinDate}</span>
                      </div>
                    </div>
                    {user && user._id === profile._id && (
                      <Button
                        variant={isEditing ? "success" : "hero"}
                        onClick={() => setIsEditing(!isEditing)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        {isEditing ? "Save Changes" : "Edit Profile"}
                      </Button>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {profile.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <FreelancerStats profile={profile} />

              <div className="mb-6">
                <h4 className="font-medium mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <FreelancerPortfolio portfolio={profile.portfolio} />
            </TabsContent>

            <TabsContent value="reviews">
              <FreelancerReviews reviews={profile.reviews} />
            </TabsContent>

            <TabsContent value="availability">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                  <CardDescription>
                    Manage your working hours and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">
                      Current Status
                    </Label>
                    <div className="mt-2">
                      <Badge variant="default" className="gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        Available for work
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Weekly Capacity
                    </Label>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Hours per week</span>
                        <span className="font-medium">30 / 40 hours</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Response Time
                    </Label>
                    <p className="text-muted-foreground">
                      Average response time:{" "}
                      <span className="font-medium text-foreground">
                        &lt; 1 hour
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your professional information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hourly-rate">Hourly Rate</Label>
                      <Input
                        id="hourly-rate"
                        value={profile.hourlyRate}
                        onChange={(e) => setIsEditing(true)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.description}
                        onChange={(e) => setIsEditing(true)}
                        rows={4}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-4">
                      Notification Preferences
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New job alerts</span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message notifications</span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment confirmations</span>
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
