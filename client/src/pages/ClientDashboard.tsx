import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Eye, MessageSquare } from "lucide-react";
import Navigation from "@/components/Navigation";
import { PostJobModal } from "@/components/PostJobModal";
import { useNavigate } from "react-router-dom";
import { getClientDashboard } from "@/services/dashboard.service";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { title: "Active Projects", value: "0", icon: Users, color: "text-primary" },
    { title: "Total Spent", value: "₹0", icon: DollarSign, color: "text-success" },
    { title: "Open Gigs", value: "0", icon: Users, color: "text-primary" },
    { title: "Pending Applications", value: "0", icon: Users, color: "text-primary" }
  ]);
  const [activeGigs, setActiveGigs] = useState<any[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getClientDashboard({ appsLimit: 5, contractsLimit: 5, completedLimit: 5 });
        if (!mounted) return;
        setStats([
          { title: "Active Projects", value: String(data.stats.activeProjects), icon: Users, color: "text-primary" },
          { title: "Total Spent", value: `${data.stats.totalSpent}`, icon: DollarSign, color: "text-success" },
          { title: "Open Gigs", value: String(data.stats.openGigs), icon: Users, color: "text-primary" },
          { title: "Pending Applications", value: String(data.stats.pendingApplications), icon: Users, color: "text-primary" },
        ]);
        setActiveGigs(data.activeGigs);
        setRecentApplications(data.recentApplications);
        setCompletedProjects(data.completedProjects);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Client Dashboard</h1>
              <p className="text-muted-foreground">Manage your projects and find talent</p>
            </div>
            <PostJobModal />
          </div>

          {error && <p className="text-destructive mb-4">{error}</p>}
          {loading && <p className="text-muted-foreground mb-4">Loading...</p>}
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

          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Active Projects</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="grid gap-6">
                {activeGigs.map((g) => (
                  <Card key={g._id} className="shadow-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{g.title}</CardTitle>
                          <CardDescription>Status: {g.status}</CardDescription>
                        </div>
                        <Badge variant="secondary">{g.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget: </span>
                            <span className="font-semibold">{g.budget ? `${g.budget.type} ${g.budget.amount} ${g.budget.currency}` : '-'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Applications: </span>
                            <span className="font-semibold">{g.applicationCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/gigs/${g._id}`)}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate(`/gigs/${g._id}/applications`)}>
                            View Applications
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

            <TabsContent value="completed">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Projects</CardTitle>
                  <CardDescription>Recently completed contracts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {completedProjects.map((c) => (
                      <Card key={c._id} className="shadow-card">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{c.gig?.title}</CardTitle>
                              <CardDescription>Freelancer: {c.freelancer ? `${c.freelancer.firstName} ${c.freelancer.lastName}` : ""}</CardDescription>
                            </div>
                            <Badge variant="secondary">{c.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total Paid: </span>
                              <span className="font-semibold">{c.totalPaid}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Completed On: </span>
                              <span className="font-semibold">{c.endDate ? new Date(c.endDate).toLocaleDateString() : "-"}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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

export default ClientDashboard;