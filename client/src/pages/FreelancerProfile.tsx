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
import { Progress } from "@/components/ui/progress";
import { Edit, MapPin, Calendar, Star, DollarSign, Clock, Award, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import avatarPlaceholder from "@/assets/avatar-placeholder.jpg";

const FreelancerProfile = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileExample, setProfileExample] = useState({
    name: "Sarah Johnson",
    title: "Full-Stack Developer & UI/UX Designer",
    hourlyRate: "$75",
    location: "New York, NY",
    description: "Passionate full-stack developer with 6+ years of experience building modern web applications. Specialized in React, Node.js, and creating beautiful user interfaces that convert.",
    skills: ["React", "Node.js", "TypeScript", "UI/UX Design", "MongoDB", "AWS"],
    joinDate: "March 2022"
  });

  const stats = [
    { label: "Jobs Completed", value: "127", icon: Award },
    { label: "Total Earned", value: "$89,540", icon: DollarSign },
    { label: "Success Rate", value: "99%", icon: Star },
    { label: "Response Time", value: "< 1hr", icon: Clock }
  ];

  const portfolio = [
    {
      title: "E-commerce Platform",
      description: "Modern React e-commerce solution with payment integration",
      technologies: ["React", "Node.js", "Stripe"],
      rating: 5,
      client: "TechCorp Inc."
    },
    {
      title: "Mobile Banking App",
      description: "Secure mobile banking application with biometric authentication",
      technologies: ["React Native", "Node.js", "PostgreSQL"],
      rating: 5,
      client: "FinanceStart"
    },
    {
      title: "SaaS Dashboard",
      description: "Analytics dashboard for project management platform",
      technologies: ["Vue.js", "D3.js", "Express"],
      rating: 5,
      client: "ProjectFlow"
    }
  ];

  const reviews = [
    {
      client: "John Mitchell",
      rating: 5,
      comment: "Exceptional work! Sarah delivered exactly what we needed and went above and beyond our expectations.",
      project: "E-commerce Platform",
      date: "2 weeks ago"
    },
    {
      client: "Emily Chen",
      rating: 5,
      comment: "Outstanding developer with great communication skills. Will definitely work with her again.",
      project: "Mobile Banking App",
      date: "1 month ago"
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
                    <AvatarFallback className="text-2xl">SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Photo
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">{profile.name}</h1>
                      <p className="text-xl text-muted-foreground mb-2">{profile.title}</p>
                      <p className="text-lg font-medium text-success mb-2">{profile.hourlyRate}/hour</p>
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
                  
                  {/* Skills */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
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
          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <div className="grid md:grid-cols-2 gap-6">
                {portfolio.map((project, index) => (
                  <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{project.rating}.0</span>
                        </div>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Technologies Used:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Client: <span className="font-medium">{project.client}</span>
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          View Project Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Client Reviews</CardTitle>
                  <CardDescription>What clients say about working with Sarah</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{review.client}</h4>
                            <p className="text-sm text-muted-foreground">{review.project}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          "{review.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Availability Settings</CardTitle>
                  <CardDescription>Manage your working hours and availability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Current Status</Label>
                    <div className="mt-2">
                      <Badge variant="default" className="gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        Available for work
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-base font-medium mb-4 block">Weekly Capacity</Label>
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
                    <Label className="text-base font-medium mb-4 block">Response Time</Label>
                    <p className="text-muted-foreground">
                      Average response time: <span className="font-medium text-foreground">&lt; 1 hour</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your professional information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hourly-rate">Hourly Rate</Label>
                      <Input 
                        id="hourly-rate" 
                        value={profileExample.hourlyRate} 
                        onChange={(e) => setProfileExample(prev => ({ ...prev, hourlyRate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileExample.description}
                        onChange={(e) => setProfileExample(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-4">Notification Preferences</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New job alerts</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment confirmations</span>
                        <input type="checkbox" className="rounded" defaultChecked />
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