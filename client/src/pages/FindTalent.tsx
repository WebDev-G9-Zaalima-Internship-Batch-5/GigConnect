import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, MapPin, Clock, DollarSign, MessageSquare, Heart, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import avatarPlaceholder from "@/assets/avatar-placeholder.jpg";

const FindTalent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedRate, setSelectedRate] = useState("");

  const freelancers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Full-Stack Developer & UI/UX Designer",
      description: "Passionate developer with 6+ years building modern web applications. Specialized in React, Node.js, and creating beautiful interfaces.",
      hourlyRate: 75,
      location: "New York, NY",
      rating: 4.9,
      reviewCount: 127,
      completedJobs: 89,
      skills: ["React", "Node.js", "TypeScript", "UI/UX Design", "AWS"],
      responseTime: "< 1hr",
      verified: true,
      topRated: true
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Mobile App Developer",
      description: "Expert in React Native and Flutter development. Built 50+ mobile apps for startups and enterprises with focus on performance.",
      hourlyRate: 65,
      location: "San Francisco, CA",
      rating: 4.8,
      reviewCount: 93,
      completedJobs: 67,
      skills: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
      responseTime: "2hrs",
      verified: true,
      topRated: false
    },
    {
      id: 3,
      name: "Emma Davis",
      title: "Content Writer & Digital Marketing",
      description: "Creative content strategist with expertise in tech writing, SEO optimization, and social media campaigns that drive engagement.",
      hourlyRate: 45,
      location: "London, UK",
      rating: 4.9,
      reviewCount: 156,
      completedJobs: 203,
      skills: ["Content Writing", "SEO", "Social Media", "Email Marketing", "Analytics"],
      responseTime: "< 1hr",
      verified: true,
      topRated: true
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      title: "Data Scientist & ML Engineer",
      description: "PhD in Computer Science with 8+ years experience in machine learning, AI, and big data analytics for Fortune 500 companies.",
      hourlyRate: 95,
      location: "Toronto, CA",
      rating: 5.0,
      reviewCount: 74,
      completedJobs: 45,
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis", "SQL"],
      responseTime: "3hrs",
      verified: true,
      topRated: true
    },
    {
      id: 5,
      name: "Lisa Wang",
      title: "Graphic Designer & Brand Strategist",
      description: "Award-winning designer specializing in brand identity, logo design, and visual storytelling for startups and established brands.",
      hourlyRate: 55,
      location: "Singapore",
      rating: 4.8,
      reviewCount: 112,
      completedJobs: 134,
      skills: ["Graphic Design", "Branding", "Adobe Creative Suite", "Figma", "Web Design"],
      responseTime: "1hr",
      verified: false,
      topRated: false
    },
    {
      id: 6,
      name: "David Kim",
      title: "DevOps Engineer & Cloud Architect",
      description: "Senior DevOps engineer with expertise in AWS, Docker, Kubernetes, and CI/CD pipelines. Helped scale 100+ applications.",
      hourlyRate: 85,
      location: "Seoul, KR",
      rating: 4.9,
      reviewCount: 68,
      completedJobs: 52,
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
      responseTime: "2hrs",
      verified: true,
      topRated: true
    }
  ];

  const categories = ["Development", "Design", "Writing", "Marketing", "Data Science", "Video & Animation"];
  const locations = ["Remote", "United States", "Europe", "Asia", "Australia"];
  const rates = ["$0 - $25/hr", "$25 - $50/hr", "$50 - $100/hr", "$100+/hr"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Find Top Talent</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with skilled freelancers ready to bring your projects to life
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
                    placeholder="Search for skills, freelancers, or expertise..."
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

                  <Select value={selectedRate} onValueChange={setSelectedRate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Hourly Rate" />
                    </SelectTrigger>
                    <SelectContent>
                      {rates.map((rate) => (
                        <SelectItem key={rate} value={rate}>
                          {rate}
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
              Showing <span className="font-semibold">{freelancers.length}</span> freelancers
            </p>
            <Select defaultValue="rating">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="rate-low">Lowest Rate</SelectItem>
                <SelectItem value="rate-high">Highest Rate</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Freelancer Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {freelancers.map((freelancer) => (
              <Card key={freelancer.id} className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex gap-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={avatarPlaceholder} alt={freelancer.name} />
                      <AvatarFallback className="text-lg">
                        {freelancer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {freelancer.name}
                          </h3>
                          <p className="text-muted-foreground text-sm">{freelancer.title}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium">{freelancer.rating}</span>
                          <span className="text-muted-foreground text-sm">
                            ({freelancer.reviewCount} reviews)
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{freelancer.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                        {freelancer.topRated && (
                          <Badge variant="default" className="gap-1">
                            Top Rated
                          </Badge>
                        )}
                        {freelancer.verified && (
                          <Badge variant="success" className="gap-1">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {freelancer.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {freelancer.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.skills.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-semibold text-success">${freelancer.hourlyRate}/hr</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{freelancer.responseTime}</span>
                      </div>
                      
                      <span className="text-muted-foreground">
                        {freelancer.completedJobs} jobs completed
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                      <Button variant="hero" size="sm">
                        Hire Now
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
              Load More Freelancers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindTalent;