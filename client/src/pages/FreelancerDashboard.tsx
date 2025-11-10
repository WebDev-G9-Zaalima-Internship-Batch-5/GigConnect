import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, DollarSign, Clock, Star, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [activeJobs] = useState([
    {
      id: 1,
      title: "React Developer for SaaS Platform",
      client: "TechCorp Inc.",
      budget: "$4,500",
      progress: 60,
      deadline: "Dec 20, 2024",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Logo Design for Startup",
      client: "StartupXYZ",
      budget: "$800",
      progress: 90,
      deadline: "Dec 5, 2024",
      status: "Review"
    }
  ]);

  const stats = [
    { title: "Active Jobs", value: "3", icon: Clock, color: "text-primary" },
    { title: "Total Earnings", value: "$18,750", icon: DollarSign, color: "text-success" },
    { title: "Success Rate", value: "98%", icon: Star, color: "text-warning" },
    { title: "Profile Views", value: "245", icon: TrendingUp, color: "text-accent" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Freelancer Dashboard</h1>
              <p className="text-muted-foreground">Manage your gigs and find new opportunities</p>
            </div>
            <Button variant="hero" className="gap-2" onClick={() => navigate('/find-work')}>
              <Search className="h-4 w-4" />
              Find Work
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
          <Tabs defaultValue="active-jobs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
              <TabsTrigger value="proposals">My Proposals</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="active-jobs" className="space-y-6">
              <div className="grid gap-6">
                {activeJobs.map((job) => (
                  <Card key={job.id} className="shadow-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <CardDescription>Client: {job.client}</CardDescription>
                        </div>
                        <Badge 
                          variant={job.status === 'In Progress' ? 'default' : 'secondary'}
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget: </span>
                            <span className="font-semibold">{job.budget}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deadline: </span>
                            <span className="font-semibold">{job.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Update Progress
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Message Client
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
                  <CardTitle>My Proposals</CardTitle>
                  <CardDescription>Track your submitted proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No pending proposals.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Track your income and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-success">$2,340</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">$890</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-accent">$18,750</p>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
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

export default FreelancerDashboard;