import { useMemo, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGigApplications,
  updateApplicationStatus,
  markApplicationAsViewed,
} from "@/services/applications.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ClientApplicationDetail() {
  const { gigId, applicationId } = useParams();
  console.log("gigId", gigId);
  console.log("applicationId", applicationId);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gigApplications", gigId],
    queryFn: () => getGigApplications(gigId as string),
    enabled: !!gigId,
  });

  const application = useMemo(
    () => (data || []).find((a) => a._id === applicationId),
    [data, applicationId]
  );

  console.log("application", application);

  // Mark application as viewed when it's first loaded
  useEffect(() => {
    const markAsViewed = async () => {
      if (gigId && applicationId && application && !application.clientViewed) {
        try {
          await markApplicationAsViewed(gigId, applicationId);
          // Invalidate the query to refetch and update the UI if needed
          qc.invalidateQueries({ queryKey: ["gigApplications", gigId] });
        } catch (error) {
          console.error("Failed to mark application as viewed:", error);
        }
      }
    };

    markAsViewed();
  }, [gigId, applicationId, application, qc]);

  const mutation = useMutation({
    mutationFn: (status: "accepted" | "rejected") =>
      updateApplicationStatus(gigId as string, applicationId as string, status),
    onSuccess: (updated) => {
      toast.success(`Application ${updated.status}`);
      qc.invalidateQueries({ queryKey: ["gigApplications", gigId] });
      if (updated.status === "accepted") {
        navigate(`/client/contracts/new?applicationId=${applicationId}`);
      } else {
        navigate(`/client/gigs/${gigId}/applications`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl p-6 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (isError || !application) {
    return (
      <div className="container mx-auto max-w-3xl p-6 text-sm text-destructive">
        Application not found.
      </div>
    );
  }

  const freelancer = application.freelancer;
  const name = `${freelancer.name}`;
  const avatar = freelancer.avatar;

  return (
    <div className="container mx-auto max-w-3xl p-6 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatar} />
                <AvatarFallback>
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <div className="text-xs text-muted-foreground">
                  Applied {new Date(application.appliedAt).toLocaleString()}
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {application.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Proposed Rate</div>
              <div className="text-base font-semibold">
                {application.proposedRate}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Estimated Duration
              </div>
              <div className="text-base font-semibold">
                {application.estimatedDuration}
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-semibold mb-1">Relevant Experience</h4>
            <p className="text-muted-foreground whitespace-pre-line">
              {application.relevantExperience}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Cover Letter</h4>
            <p className="text-muted-foreground whitespace-pre-line">
              {application.coverLetter}
            </p>
          </div>
          {Array.isArray(application.portfolioSamples) &&
            application.portfolioSamples.length > 0 && (
              <div>
                <h4 className="font-semibold mb-1">Portfolio Samples</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {application.portfolioSamples.map((p, i) => (
                    <li key={`${p}-${i}`}>
                      <a
                        className="text-primary hover:underline"
                        href={p}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <div>
            <Link
              to={`/profile/${freelancer._id}`}
              className="text-primary hover:underline"
            >
              Visit Profile
            </Link>
          </div>
          <div className="flex gap-2 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={
                    mutation.isPending || application.status === "accepted"
                  }
                >
                  Accept
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Accept this application?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will create a contract and set the gig to In Progress.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => mutation.mutate("accepted")}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={
                    mutation.isPending || application.status === "rejected"
                  }
                >
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject this application?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The freelancer will be notified.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => mutation.mutate("rejected")}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="ghost" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
