import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGigApplications } from "@/services/applications.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const StatusBadge = ({ status }: { status: string }) => {
  const color =
    status === "accepted"
      ? "bg-emerald-600"
      : status === "rejected"
      ? "bg-rose-600"
      : "bg-gray-600";
  return (
    <span className={`text-xs text-white px-2 py-0.5 rounded ${color}`}>
      {status}
    </span>
  );
};

export default function ClientGigApplications() {
  const { gigId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gigApplications", gigId],
    queryFn: () => getGigApplications(gigId as string),
    enabled: !!gigId,
  });

  const apps = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl p-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-3xl p-6 text-center text-sm text-destructive">
        Failed to load applications.
      </div>
    );
  }

  if (!apps.length) {
    return (
      <div className="container mx-auto max-w-3xl p-10 text-center">
        <h2 className="text-xl font-semibold mb-2">No applications yet</h2>
        <p className="text-muted-foreground">
          You'll see applications to this gig here.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 grid gap-4 sm:grid-cols-2">
      {apps.map((a) => {
        const freelancer = a.freelancer;
        const name = `${freelancer.name}`;
        const avatar = freelancer.avatar;
        const applied = new Date(a.appliedAt).toLocaleDateString();
        return (
          <Card
            key={a._id}
            className="cursor-pointer transition hover:shadow-md"
            onClick={() =>
              navigate(`/client/gigs/${gigId}/applications/${a._id}`)
            }
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatar} />
                    <AvatarFallback>
                      {name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{name}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      Applied {applied}
                    </div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">
                  Proposed rate:{" "}
                  <Badge variant="secondary">{a.proposedRate}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {a.estimatedDuration}
                </div>
              </div>
              <p className="text-sm line-clamp-3 text-muted-foreground">
                {a.coverLetter}
              </p>
              <div className="mt-3">
                <Link
                  to={`/profile/${a.freelancer._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary text-sm hover:underline"
                >
                  Visit Profile
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
