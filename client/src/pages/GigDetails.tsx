import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getGigById, applyForGig, ApplyForGigPayload } from "@/services/gigs.service";
import { useAuth } from "@/contexts/AuthContext";
import { Loader, ArrowLeft, DollarSign, MapPin, Clock, Paperclip, Eye, FileText, Layers } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const formatBudget = (gig: any) => {
  if (!gig?.budget) return "";
  const { type, amount, currency } = gig.budget;
  if (type === "fixed") return `${amount?.toLocaleString()} ${currency || "INR"} (Fixed)`;
  return `${amount}/hr ${currency || "INR"} (Hourly)`;
};

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatPostedTime = (date: string | Date | undefined) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}mo ago`;
  const yr = Math.floor(mon / 12);
  return `${yr}y ago`;
};

const GigDetails = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: gig, isPending } = useQuery({
    queryKey: ["gig", gigId],
    queryFn: () => getGigById(gigId as string),
    enabled: !!gigId,
    staleTime: 1000 * 60 * 5,
  });

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");

  const applyMutation = useMutation({
    mutationFn: (payload: ApplyForGigPayload) => applyForGig(gigId as string, payload),
    onSuccess: () => {
      toast.success("Application submitted successfully");
      setCoverLetter("");
      setProposedRate("");
      setEstimatedDuration("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit application");
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login as a freelancer to apply");
      return;
    }
    const rateNum = Number(proposedRate);
    if (Number.isNaN(rateNum) || rateNum <= 0) {
      toast.error("Please enter a valid proposed rate");
      return;
    }
    if (!coverLetter.trim()) {
      toast.error("Cover letter is required");
      return;
    }
    if (!relevantExperience.trim()) {
      toast.error("Relevant experience is required");
      return;
    }
    if (relevantExperience.length > 500) {
      toast.error("Relevant experience must be at most 500 characters");
      return;
    }
    applyMutation.mutate({ coverLetter, proposedRate: rateNum, estimatedDuration, relevantExperience });
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 max-w-4xl mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <Card>
            <CardContent className="p-6">Gig not found.</CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to results
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{gig.title}</CardTitle>
                      <CardDescription>{gig.clientId?.fullName}</CardDescription>
                    </div>
                    <Badge variant={gig.status === 'OPEN' ? 'default' : 'secondary'}>
                      {gig.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-success" />
                      <span className="font-semibold text-success">{formatBudget(gig)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {gig.location?.coordinates?.length === 2 
                          ? [gig.location.city, gig.location.country].filter(Boolean).join(', ') || 'Onsite'
                          : 'Remote'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span title={new Date(gig.createdAt).toLocaleString()}>
                        Posted {formatPostedTime(gig.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>{gig.viewCount ?? 0} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{gig.applicationCount ?? 0} applications</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{gig.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold">Experience Level</h4>
                      <p className="text-muted-foreground capitalize">{gig.experienceLevel || 'Not specified'}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold">Duration</h4>
                      <p className="text-muted-foreground">{gig.duration || 'Not specified'}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold">Expected Start</h4>
                      <p className="text-muted-foreground">
                        {gig.expectedStartDate ? formatDate(gig.expectedStartDate) : 'To be discussed'}
                      </p>
                    </div>
                    {gig.deadline && (
                      <div className="space-y-1">
                        <h4 className="font-semibold">Deadline</h4>
                        <p className="text-muted-foreground">
                          {formatDate(gig.deadline)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Location</h4>
                    {gig.location?.coordinates?.length === 2 ? (
                      <>
                        <div className="space-y-1 mb-3">
                          {gig.location.displayName && (
                            <p className="text-muted-foreground">{gig.location.displayName}</p>
                          )}
                          {gig.location.address && (
                            <p className="text-muted-foreground text-sm">{gig.location.address}</p>
                          )}
                          {(gig.location.city || gig.location.state || gig.location.country) && (
                            <p className="text-muted-foreground text-sm">
                              {[gig.location.city, gig.location.state, gig.location.country]
                                .filter(Boolean)
                                .join(', ')}
                              {gig.location.pincode && `, ${gig.location.pincode}`}
                            </p>
                          )}
                        </div>
                        <div className="rounded-md overflow-hidden border">
                          <iframe
                            title="Gig location"
                            width="100%"
                            height="240"
                            loading="lazy"
                            src={`https://www.openstreetmap.org/export/embed.html?&marker=${gig.location.coordinates[1]},${gig.location.coordinates[0]}&layer=mapnik&zoom=14#map=14/${gig.location.coordinates[1]}/${gig.location.coordinates[0]}`}
                            className="border-0"
                            allowFullScreen
                          />
                        </div>
                        <a
                          className="inline-flex items-center text-primary text-sm hover:underline mt-2"
                          href={`https://www.openstreetmap.org/?mlat=${gig.location.coordinates[1]}&mlon=${gig.location.coordinates[0]}#map=14/${gig.location.coordinates[1]}/${gig.location.coordinates[0]}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Open in OpenStreetMap
                        </a>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Remote work</p>
                    )}
                  </div>

                  {Array.isArray(gig.skillsRequired) && gig.skillsRequired.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {gig.skillsRequired.map((s: string, i: number) => (
                          <Badge key={`${s}-${i}`} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(gig.requirements) && gig.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        {gig.requirements.map((r: string, i: number) => (
                          <li key={`req-${i}`}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(gig.deliverables) && gig.deliverables.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Deliverables</h4>
                      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        {gig.deliverables.map((d: string, i: number) => (
                          <li key={`del-${i}`}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(gig.attachments) && gig.attachments.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Attachments</h4>
                      <div className="flex flex-col gap-2">
                        {gig.attachments.map((url: string, i: number) => (
                          <a
                            key={`${url}-${i}`}
                            className="inline-flex items-center text-primary hover:underline"
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Paperclip className="h-4 w-4 mr-2" /> Attachment {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar: Apply */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Submit a Proposal</CardTitle>
                  <CardDescription>
                    {isAuthenticated ? (gig.status === 'OPEN' ? "Introduce yourself and share your approach" : `Applications are closed (${gig.status})`) : "Login as a freelancer to apply"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cover Letter</label>
                      <Textarea
                        placeholder="Write a concise cover letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="min-h-[120px]"
                        disabled={!isAuthenticated || applyMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Relevant Experience</label>
                      <Textarea
                        placeholder="Summarize your directly relevant experience (max 500 chars)"
                        value={relevantExperience}
                        onChange={(e) => setRelevantExperience(e.target.value)}
                        className="min-h-[100px]"
                        disabled={!isAuthenticated || applyMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Proposed Rate</label>
                      <Input
                        type="number"
                        placeholder={gig?.budget?.type === "hourly" ? "e.g., 40 (per hour)" : "e.g., 2000 (fixed)"}
                        value={proposedRate}
                        onChange={(e) => setProposedRate(e.target.value)}
                        disabled={!isAuthenticated || applyMutation.isPending}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Estimated Duration</label>
                      <Input
                        placeholder="e.g., 2 weeks"
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(e.target.value)}
                        disabled={!isAuthenticated || applyMutation.isPending}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!isAuthenticated || applyMutation.isPending || !gig || gig.status?.toUpperCase() !== 'OPEN'}
                    >
                      {applyMutation.isPending 
                        ? "Submitting..." 
                        : (!isAuthenticated 
                            ? "Login to Apply"
                            : !gig 
                              ? "Loading..."
                              : gig.status?.toUpperCase() !== 'OPEN'
                                ? `Applications ${gig.status?.toLowerCase()}`
                                : "Submit Proposal")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
