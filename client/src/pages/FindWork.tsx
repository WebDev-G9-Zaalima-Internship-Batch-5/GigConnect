import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Filter,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getGigs } from "@/services/gigs.service";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile } from "@/services/profile.service";

const FindWork = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [fixedMin, setFixedMin] = useState<number | undefined>(undefined);
  const [fixedMax, setFixedMax] = useState<number | undefined>(undefined);
  const [hourlyMin, setHourlyMin] = useState<number | undefined>(undefined);
  const [hourlyMax, setHourlyMax] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState("recent");
  const [distanceKm, setDistanceKm] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const { user, isAuthenticated, appLoading } = useAuth();

  // Load user's stored profile location (if logged in)
  console.log("user", user);
  const { data: profileData } = useQuery({
    queryKey: ["profile", user?._id],
    queryFn: () => getProfile(user?._id),
    enabled: !appLoading && !!user?._id,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const coords = useMemo(() => {
    const loc = profileData?.profile?.location;
    if (loc?.coordinates?.length === 2) {
      return { lat: loc.coordinates[1], lng: loc.coordinates[0] };
    }
    return null;
  }, [profileData]);

  const categories = [
    "Development",
    "Design",
    "Writing",
    "Marketing",
    "Data Science",
    "Video & Animation",
  ];

  const distances = ["Any", "10 km", "20 km", "50 km", "100 km"];

  // Debounce search
  const [debouncedQ, setDebouncedQ] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(searchQuery.trim()), 400);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // No geolocation button. We use user's profile location if available.

  // Infinite query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "gigs",
      {
        q: debouncedQ,
        category: selectedCategory !== "any" ? selectedCategory : undefined,
        sort,
        fixedMin,
        fixedMax,
        hourlyMin,
        hourlyMax,
        coords,
        distanceKm,
      },
    ],
    queryFn: ({ pageParam = 1 }) =>
      getGigs({
        q: debouncedQ || undefined,
        category: selectedCategory !== "any" ? selectedCategory : undefined,
        sort: sort as any,
        page: Number(pageParam),
        limit: 10,
        fixedMin,
        fixedMax,
        hourlyMin,
        hourlyMax,
        lat: coords?.lat,
        lng: coords?.lng,
        distanceKm: typeof distanceKm === "number" ? distanceKm : undefined,
      }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      const loaded = page * limit;
      return loaded < total ? page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });

  const items = useMemo(
    () => (data?.pages ?? []).flatMap((p) => p.items),
    [data]
  );
  const total = data?.pages?.[0]?.total ?? 0;

  // Apply filters button: simply refetch from page 1 by invalidating key via state changes
  const onApplyFilters = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Your Perfect Gig
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover thousands of projects that match your skills and
              expertise
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
                    disabled={!isAuthenticated}
                    className="pl-10 h-12 text-lg"
                  />
                  {isAuthenticated && searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    disabled={!isAuthenticated}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Fixed Min"
                        value={fixedMin ?? ""}
                        onChange={(e) =>
                          setFixedMin(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        disabled={!isAuthenticated}
                      />
                      <Input
                        type="number"
                        placeholder="Fixed Max"
                        value={fixedMax ?? ""}
                        onChange={(e) =>
                          setFixedMax(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        disabled={!isAuthenticated}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Hourly Min"
                        value={hourlyMin ?? ""}
                        onChange={(e) =>
                          setHourlyMin(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        disabled={!isAuthenticated}
                      />
                      <Input
                        type="number"
                        placeholder="Hourly Max"
                        value={hourlyMax ?? ""}
                        onChange={(e) =>
                          setHourlyMax(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>

                  <Select
                    value={distanceKm !== undefined ? `${distanceKm}` : "any"}
                    onValueChange={(v) => {
                      if (v === "any") setDistanceKm(undefined);
                      else setDistanceKm(Number(v));
                    }}
                    disabled={!isAuthenticated || !coords}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any (include Remote)</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="20">20 km</SelectItem>
                      <SelectItem value="50">50 km</SelectItem>
                      <SelectItem value="100">100 km</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center">
                    {!isAuthenticated ? (
                      <span className="text-xs text-muted-foreground">
                        Log in to use filters
                      </span>
                    ) : !coords ? (
                      <span className="text-xs text-muted-foreground">
                        Add location in your profile to enable distance filter
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold">{items.length}</span> of{" "}
              {total} jobs
            </p>
            <Select value={sort} onValueChange={setSort}>
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
            {items.map((job: any) => (
              <Card
                key={job._id}
                className="shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                      </div>
                      <p className="text-primary font-medium mb-2">
                        {job.clientId?.fullName}
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4 max-h-16 overflow-hidden">
                        {job.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-4">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skillsRequired?.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
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
                        <span className="font-semibold text-success">
                          {job.budget?.type === "fixed"
                            ? `${job.budget?.amount?.toLocaleString()} ${
                                job.budget?.currency || "INR"
                              }`
                            : `${job.budget?.amount}/hr ${
                                job.budget?.currency || "INR"
                              }`}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {job.budget?.type === "fixed"
                            ? "Fixed Price"
                            : "Hourly"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {job.location?.city ||
                            job.location?.country ||
                            "Remote"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        {job.applicationCount ?? 0} proposals
                      </span>
                      <Button variant="hero" size="sm" onClick={() => navigate(`/gigs/${job._id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More / Infinite Scroll */}
          <div className="text-center mt-8">
            {hasNextPage && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More Jobs"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindWork;
