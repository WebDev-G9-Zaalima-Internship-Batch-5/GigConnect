import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

export interface Project {
  title: string;
  budget: string;
  status: string;
  rating?: number;
  freelancer: string;
}

interface ClientProjectsProps {
  projects: Project[];
}

export default function ClientProjects({ projects }: ClientProjectsProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Project History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {projects.map((project, index) => (
          <div key={index}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-medium text-foreground">{project.title}</h4>
                <p className="text-sm text-muted-foreground">
                  Freelancer: {project.freelancer}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={
                    project.status === "Completed"
                      ? "success"
                      : project.status === "In Progress"
                      ? "default"
                      : "secondary"
                  }
                >
                  {project.status}
                </Badge>
                <span className="font-medium">{project.budget}</span>
                {project.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm">{project.rating}</span>
                  </div>
                )}
              </div>
            </div>
            {index < projects.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export const defaultProjects = [
  {
    title: "E-commerce Platform Development",
    budget: "$8,000",
    status: "Completed",
    rating: 5,
    freelancer: "Sarah Johnson",
  },
  {
    title: "Mobile App UI/UX Design",
    budget: "$3,500",
    status: "In Progress",
    freelancer: "Mike Chen",
  },
  {
    title: "Content Writing for Blog",
    budget: "$1,200",
    status: "Completed",
    rating: 5,
    freelancer: "Emma Davis",
  },
];
