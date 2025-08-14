import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, DollarSign, Bookmark, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";

const FindWork = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  const jobs = [
    {
      id: 1,
      title: "Full-Stack Developer for SaaS Platform",
      company: "TechVenture Inc.",
      description: "We're looking for an experienced full-stack developer to help build our next-generation SaaS platform. You'll work with React, Node.js, and AWS.",
      budget: "$5,000 - $8,000",
      type: "Fixed Price",
      location: "Remote",
      skills: ["React", "Node.js", "AWS", "MongoDB"],
      postedTime: "2 hours ago",
      proposals: 12,
      verified: true
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      company: "StartupXYZ",
      description: "Create a modern, intuitive UI/UX design for our mobile banking application. Must have experience with financial apps.",
      budget: "$50 - $75/hr",
      type: "Hourly",
      location: "Remote",
      skills: ["Figma", "UI Design", "UX Research", "Mobile Design"],
      postedTime: "4 hours ago",
      proposals: 8,
      verified: true
    },
    {
      id: 3,
      title: "Content Writer for Tech Blog",
      company: "DevBlog Pro",
      description: "Write engaging technical articles about web development, AI, and emerging technologies. 3-5 articles per week.",
      budget: "$30 - $50/hr",
      type: "Hourly",
      location: "Remote",
      skills: ["Content Writing", "Technical Writing", "SEO", "JavaScript"],
      postedTime: "1 day ago",
      proposals: 25,
      verified: false
    },
    {
      id: 4,
      title: "E-commerce Website Development",
      company: "RetailMax",
      description: "Build a complete e-commerce solution with payment integration, inventory management, and admin dashboard.",
      budget: "$3,000 - $5,000",
      type: "Fixed Price",
      location: "Remote",
      skills: ["Shopify", "React", "Payment Integration", "PHP"],
      postedTime: "2 days ago",
      proposals: 18,
      verified: true
    },
    {
      id: 5,
      title: "Data Science & Analytics",
      company: "DataCorp",
      description: "Analyze large datasets and create predictive models for customer behavior. Experience with Python and machine learning required.",
      budget: "$60 - $90/hr",
      type: "Hourly",
      location: "Remote",
      skills: ["Python", "Machine Learning", "Pandas", "TensorFlow"],
      postedTime: "3 days ago",
      proposals: 15,
      verified: true
    },
    {
      id: 6,
      title: "Video Editing for YouTube Channel",
      company: "CreativeMedia",
      description: "Edit educational videos for our tech YouTube channel. Need someone with experience in motion graphics and storytelling.",
      budget: "$25 - $40/hr",
      type: "Hourly",
      location: "Remote",
      skills: ["Video Editing", "After Effects", "Premiere Pro", "Motion Graphics"],
      postedTime: "5 days ago",
      proposals: 22,
      verified: false
    }
  ];

  const categories = ["Development", "Design", "Writing", "Marketing", "Data Science", "Video & Animation"];
  const locations = ["Remote", "United States", "Europe", "Asia", "Australia"];
  const budgets = ["$0 - $25/hr", "$25 - $50/hr", "$50 - $100/hr", "$100+/hr", "Fixed Price"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect Gig</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover thousands of projects that match your skills and expertise
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-elegant mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search for jobs, skills, or companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Budget Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgets.map((budget) => (
                        <SelectItem key={budget} value={budget}>
                          {budget}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button variant="hero" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold">{jobs.length}</span> jobs
            </p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="budget-high">Highest Budget</SelectItem>
                <SelectItem value="budget-low">Lowest Budget</SelectItem>
                <SelectItem value="proposals">Fewest Proposals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        {job.verified && (
                          <Badge variant="success" className="gap-1">
                            Verified Client
                          </Badge>
                        )}
                      </div>
                      <p className="text-primary font-medium mb-2">{job.company}</p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {job.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-4">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Job Details */}
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-semibold text-success">{job.budget}</span>
                        <Badge variant="outline" className="text-xs">
                          {job.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{job.postedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        {job.proposals} proposals
                      </span>
                      <Button variant="hero" size="sm">
                        Submit Proposal
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWork;