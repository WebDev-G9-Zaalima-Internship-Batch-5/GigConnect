import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Users, DollarSign, Clock, Eye, MessageSquare, Star } from "lucide-react";
import Navigation from "@/components/Navigation";

const ClientDashboard = () => {
  const [activeProjects] = useState([
    {
      id: 1,
      title: "E-commerce Website Development",
      freelancer: "Sarah Johnson",
      budget: "$5,000",
      progress: 75,
      deadline: "Dec 15, 2024",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      freelancer: "Mike Chen",
      budget: "$3,200",
      progress: 45,
      deadline: "Jan 10, 2025",
      status: "In Progress"
    }
  ]);

  const stats = [
    { title: "Active Projects", value: "8", icon: Users, color: "text-primary" },
    { title: "Total Spent", value: "$25,430", icon: DollarSign, color: "text-success" },
    { title: "Avg. Project Time", value: "14 days", icon: Clock, color: "text-accent" },
    { title: "Success Rate", value: "96%", icon: Star, color: "text-warning" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Client Dashboard</h1>
              <p className="text-muted-foreground">Manage your projects and find talent</p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid gap-6">
                {activeProjects.map((project) => (
                  <Card key={project.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{project.title}</CardTitle>
                          <CardDescription>Freelancer: {project.freelancer}</CardDescription>
                        </div>
                        <Badge variant="secondary">{project.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget: </span>
                            <span className="font-semibold">{project.budget}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline: </span>
                            <span className="font-semibold">{project.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="proposals">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Proposals</CardTitle>
                  <CardDescription>Review and manage freelancer proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No new proposals at the moment.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communicate with your freelancers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No new messages.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Track your payments and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recent payments.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;