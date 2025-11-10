import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, DollarSign, Clock, Star, MessageSquare, Calendar, Filter, ArrowDownWideNarrow } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { getFreelancerDashboard } from "@/services/dashboard.service";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { title: "Active Jobs", value: "0", icon: Clock, color: "text-primary" },
    { title: "Total Earnings", value: "0", icon: DollarSign, color: "text-success" },
    { title: "Pending Proposals", value: "0", icon: Star, color: "text-warning" }
  ]);
  const [activeContracts, setActiveContracts] = useState<any[]>([]);
  const [proposedContracts, setProposedContracts] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [contractsView, setContractsView] = useState<"new" | "all">("new");
  const [contractsSort, setContractsSort] = useState<"deadlineAsc" | "deadlineDesc" | "newest" | "oldest">("deadlineAsc");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getFreelancerDashboard({ appsLimit: 5, contractsLimit: 10 });
        if (!mounted) return;
        setStats([
          { title: "Active Jobs", value: String(data.stats.activeJobs), icon: Clock, color: "text-primary" },
          { title: "Total Earnings", value: `${data.stats.totalEarnings}`, icon: DollarSign, color: "text-success" },
          { title: "Pending Proposals", value: String(data.stats.pendingProposals), icon: Star, color: "text-warning" },
        ]);
        setActiveContracts(data.activeContracts);
        setProposedContracts(data.proposedContracts || []);
        setMyApplications(data.myApplications);
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
              <h1 className="text-3xl font-bold text-foreground">Freelancer Dashboard</h1>
              <p className="text-muted-foreground">Manage your gigs and find new opportunities</p>
            </div>
            <Button variant="hero" className="gap-2" onClick={() => navigate('/find-work')}>
              <Search className="h-4 w-4" />
              Find Work
            </Button>
          </div>

          {error && <p className="text-destructive mb-4">{error}</p>}
          {loading && <p className="text-muted-foreground mb-4">Loading...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          <Tabs defaultValue="active-jobs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active-jobs">Active Jobs</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="proposals">My Proposals</TabsTrigger>
            </TabsList>

            <TabsContent value="active-jobs" className="space-y-6">
              <div className="grid gap-6">
                {activeContracts.map((c) => (
                  <Card key={c._id} className="shadow-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{c.gig?.title}</CardTitle>
                          <CardDescription>Client: {c.client?.fullName || ""}</CardDescription>
                        </div>
                        <Badge variant={c.status === 'active' ? 'default' : 'secondary'}>
                          {c.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Budget: </span>
                            <span className="font-semibold">{c.agreedRate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Start Date: </span>
                            <span className="font-semibold">{new Date(c.startDate).toLocaleDateString()}</span>
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

            <TabsContent value="contracts" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Contracts</CardTitle>
                      <CardDescription>New proposals from clients and your existing contracts</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant={contractsView === 'new' ? 'default' : 'outline'} size="sm" onClick={() => setContractsView('new')}>New Proposals</Button>
                      <Button variant={contractsView === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setContractsView('all')}>View All</Button>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setContractsSort((s) => s === 'deadlineAsc' ? 'deadlineDesc' : 'deadlineAsc')}>
                        <ArrowDownWideNarrow className="h-4 w-4" />
                        {contractsSort === 'deadlineAsc' ? 'Deadline ↑' : 'Deadline ↓'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {((contractsView === 'new') ? proposedContracts : [...proposedContracts, ...activeContracts])
                      .sort((a, b) => {
                        const getDeadline = (x: any) => new Date(x.deadline || x.endDate || x.startDate || x.createdAt).getTime();
                        const da = getDeadline(a), db = getDeadline(b);
                        if (contractsSort === 'deadlineAsc') return da - db;
                        if (contractsSort === 'deadlineDesc') return db - da;
                        if (contractsSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                      })
                      .map((c: any) => (
                        <Card key={c._id} className="shadow-card">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{c.gig?.title}</CardTitle>
                                <CardDescription>Client: {c.client?.fullName || ''}</CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="capitalize">{c.status}</Badge>
                                {c.deadline && (<Badge variant="outline">Due {new Date(c.deadline).toLocaleDateString()}</Badge>)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Amount: </span>
                                <span className="font-semibold">{c.agreedRate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Start: </span>
                                <span className="font-semibold">{c.startDate ? new Date(c.startDate).toLocaleDateString() : '-'}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              {c.status === 'pending' ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => navigate(`/freelancer/contracts/${c._id}`)}
                                >
                                  Review
                                </Button>
                              ) : (
                                <>
                                  <Button variant="outline" size="sm" className="gap-2">Open</Button>
                                  <Button variant="outline" size="sm" className="gap-2">Message</Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="proposals">
              <Card>
                <CardHeader>
                  <CardTitle>My Proposals</CardTitle>
                  <CardDescription>Track your submitted proposals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {myApplications.map((a) => (
                      <Card key={a._id} className="shadow-card">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{a.gig?.title}</CardTitle>
                              <CardDescription>Client: {a.client?.fullName || ""}</CardDescription>
                            </div>
                            <Badge variant={a.status === 'pending' ? 'secondary' : 'default'}>{a.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Proposed Rate: </span>
                              <span className="font-semibold">{a.proposedRate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Applied On: </span>
                              <span className="font-semibold">{new Date(a.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                        <p className="text-2xl font-bold text-success">{stats[1]?.value}</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">$890</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-accent">{stats[1]?.value}</p>
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