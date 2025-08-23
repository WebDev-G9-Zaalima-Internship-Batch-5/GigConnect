import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const FreelancerPortfolio = ({ portfolio }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {portfolio.map((project, index) => (
        <Card
          key={index}
          className="shadow-card hover:shadow-elegant transition-all duration-300"
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-sm font-medium">{project.rating}.0</span>
              </div>
            </div>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Technologies Used:</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Client: <span className="font-medium">{project.client}</span>
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Project Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FreelancerPortfolio;
