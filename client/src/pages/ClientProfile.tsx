import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, MapPin, Calendar, Star, DollarSign, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import avatarPlaceholder from "@/assets/avatar-placeholder.jpg";

const ClientProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Mitchell",
    title: "Startup Founder & CEO",
    company: "TechVenture Inc.",
    location: "San Francisco, CA",
    description: "Experienced entrepreneur building innovative SaaS solutions. Looking for top talent to help scale our platform and deliver exceptional user experiences.",
    website: "https://techventure.com",
    joinDate: "January 2023"
  });

  const stats = [
    { label: "Projects Posted", value: "24", icon: Users },
    { label: "Total Spent", value: "$45,230", icon: DollarSign },
    { label: "Average Rating", value: "4.9", icon: Star },
    { label: "Response Rate", value: "98%", icon: Calendar }
  ];

  const recentProjects = [
    {
      title: "E-commerce Platform Development",
      budget: "$8,000",
      status: "Completed",
      rating: 5,
      freelancer: "Sarah Johnson"
    },
    {
      title: "Mobile App UI/UX Design",
      budget: "$3,500",
      status: "In Progress",
      freelancer: "Mike Chen"
    },
    {
      title: "Content Writing for Blog",
      budget: "$1,200",
      status: "Completed",
      rating: 5,
      freelancer: "Emma Davis"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="shadow-elegant mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={avatarPlaceholder} alt={profile.name} />
                    <AvatarFallback className="text-2xl">JM</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Photo
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{profile.name}</h1>
                      <p className="text-xl text-muted-foreground mb-2">{profile.title}</p>
                      <p className="text-lg font-medium text-primary mb-2">{profile.company}</p>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{profile.location}</span>
                        <Calendar className="h-4 w-4 ml-4 mr-2" />
                        <span>Joined {profile.joinDate}</span>
                      </div>
                    </div>
                    <Button 
                      variant={isEditing ? "success" : "hero"} 
                      onClick={() => setIsEditing(!isEditing)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {profile.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                      <div key={stat.label} className="text-center p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <stat.icon className="h-5 w-5 text-primary mr-2" />
                          <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
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
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={profile.description}
                            onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Company Description</h4>
                          <p className="text-muted-foreground">{profile.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Website</h4>
                          <a href={profile.website} className="text-primary hover:underline">
                            {profile.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <p className="text-sm">Posted new job: "React Developer"</p>
                        <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <p className="text-sm">Hired freelancer for mobile app project</p>
                        <span className="text-xs text-muted-foreground ml-auto">1 week ago</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <p className="text-sm">Completed project with 5-star rating</p>
                        <span className="text-xs text-muted-foreground ml-auto">2 weeks ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Project History</CardTitle>
                  <CardDescription>Your completed and ongoing projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{project.title}</h4>
                          <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Freelancer: {project.freelancer}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-success">{project.budget}</span>
                          {project.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-warning text-warning" />
                              <span className="text-sm">{project.rating}.0</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value="john@techventure.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" value="+1 (555) 123-4567" />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-4">Notification Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS notifications</span>
                        <input type="checkbox" className="rounded" />
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

export default ClientProfile;